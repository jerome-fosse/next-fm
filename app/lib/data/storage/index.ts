import config from "@/app/config";
import { Option } from "@/app/types/option";
import { FsStorage } from "@/app/lib/data/storage/fs";

export interface Storage {
    write(filename: string, data: string): Promise<void>;
    read<T>(filename: string): Promise<Option<T>>;
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
