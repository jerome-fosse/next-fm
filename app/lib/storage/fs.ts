import fs from 'fs/promises';
import path from 'path';
import { Storage } from '@/app/lib/storage';
import { Option, some, none } from '@/app/types/option';

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

    async read(filename: string): Promise<Option<string>> {
        try {
            const absolutePath = path.resolve(process.cwd(), this.basePath);
            const content = await fs.readFile(
                path.join(absolutePath, `${filename}.json`),
                'utf-8'
            );
            return some(content);
        } catch (error) {
            if (isFileDoesNotExistError(error)) return none();
            throw error;
        }
    }
}
