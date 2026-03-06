'use server';

import {logger} from "@/app/lib/utils/logger";

export type ScrobbleState =
    | { error: false, message?: never }
    | { error: true, message: string }

export async function scrobbleAction(prevState: ScrobbleState, formData: FormData): Promise<ScrobbleState> {
    logger.info(formData)

    return { error: false};
}