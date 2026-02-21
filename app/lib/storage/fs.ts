import fs from 'fs/promises';
import path from 'path';
import { Storage } from '@/app/lib/storage';
import { Option, some, none } from '@/app/types/option';

export class FsStorage implements Storage {
    constructor(private readonly basePath: string) {}

    async write<T>(filename: string, data: T): Promise<void> {
        await fs.mkdir(this.basePath, { recursive: true });
        await fs.writeFile(
            path.join(this.basePath, `${filename}.json`),
            JSON.stringify(data)
        );
    }

    async read<T>(filename: string): Promise<Option<T>> {
        try {
            const content = await fs.readFile(
                path.join(this.basePath, `${filename}.json`),
                'utf-8'
            );
            return some(JSON.parse(content) as T);
        } catch (error) {
            if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
                return none();
            }
            throw error;
        }
    }
}
