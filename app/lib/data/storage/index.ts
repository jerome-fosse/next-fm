import config from "@/app/config";
import {FsStorage} from "@/app/lib/data/storage/fs";

export const NOT_FOUND = 'NOT_FOUND';
export const UNKNOWN = 'UNKNOWN';

export type ReadError = typeof NOT_FOUND | typeof UNKNOWN;

export type ReadResult<T> =
    | { success: true, data: T }
    | { success: false, errorType: ReadError, error: string };

export type WriteResult =
    | { success: true }
    | { success: false, error: string };

export interface Storage {
    write(filename: string, data: string): Promise<WriteResult>;
    read<T>(filename: string): Promise<ReadResult<T>>;
}

export function getStorage(name: string): Storage {
    const storageConfig = config.storage.get(name);
    if (!storageConfig) throw new Error(`Storage "${name}" non configuré`);

    switch (storageConfig.type) {
        case 'fs':
            return new FsStorage(storageConfig.path);
        case 's3':
            throw new Error('S3 storage not yet implemented');
    }
}
