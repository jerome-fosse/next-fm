import {z} from "zod";

export const sessionCookieSchema = z.object({ username: z.string().min(1) });
