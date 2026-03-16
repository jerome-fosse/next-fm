import fs from 'fs/promises';
import path from 'path';
import {NOT_FOUND, ReadResult, Storage, WriteResult} from '@/app/lib/data/storage';
import {logger} from "@/app/lib/utils/logger";

function isFileDoesNotExistError(error: unknown): error is NodeJS.ErrnoException {
    return error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT';
}

export class FsStorage implements Storage {
    constructor(private readonly basePath: string) {}

    async write<T>(filename: string, data: T): Promise<WriteResult> {
        try {
            const absolutePath = path.resolve(process.cwd(), this.basePath);
            await fs.mkdir(absolutePath, {recursive: true});
            await fs.writeFile(path.join(absolutePath, `${filename}.json`), JSON.stringify(data));
            return { success: true};
        } catch (error) {
            const message = `Erreur lors de l'écriture du fichier ${filename}.json${error instanceof Error ? ': ' + error.message : '.'}`;
            logger.error(message);
            return { success: false, error: message };
        }
    }

    async read<T>(filename: string): Promise<ReadResult<T>> {
        try {
            const absolutePath = path.resolve(process.cwd(), this.basePath);
            const content = await fs.readFile(
                path.join(absolutePath, `${filename}.json`),
                'utf-8'
            );
            return  { success: true, data: JSON.parse(content) as T };
        } catch (error) {
            const message = `Erreur lors de la lecture du fichier ${filename}.json${error instanceof Error ? ': ' + error.message : '.'}`;
            const type = isFileDoesNotExistError(error) ? NOT_FOUND : 'UNKNOWN';
            logger.error(message);
            return { success: false, errorType: type, error: message };
        }
    }
}
