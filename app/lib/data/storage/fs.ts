import fs from 'fs/promises';
import path from 'path';
import { Storage } from '@/app/lib/data/storage';
import { Option, some, none } from 'fp-ts/Option';

function isFileDoesNotExistError(error: unknown): error is NodeJS.ErrnoException {
    return error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT';
}

export class FsStorage implements Storage {
    constructor(private readonly basePath: string) {}

    async write(filename: string, data: string): Promise<void> {
        const absolutePath = path.resolve(process.cwd(), this.basePath);
        await fs.mkdir(absolutePath, { recursive: true });
        await fs.writeFile(
            path.join(absolutePath, `${filename}.json`),
            data
        );
    }

    async read<T>(filename: string): Promise<Option<T>> {
        try {
            const absolutePath = path.resolve(process.cwd(), this.basePath);
            const content = await fs.readFile(
                path.join(absolutePath, `${filename}.json`),
                'utf-8'
            );
            const parsed = JSON.parse(content) as T;
            return some(parsed);
        } catch (error) {
            if (isFileDoesNotExistError(error)) return none;
            throw error;
        }
    }
}
