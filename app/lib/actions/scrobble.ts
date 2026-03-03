'use server';

import {logger} from "@/app/lib/utils/logger";

export async function scrobbleAction(formData: FormData) {
    logger.info(formData)
}