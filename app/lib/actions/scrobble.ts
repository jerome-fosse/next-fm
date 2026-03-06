'use server';

import {logger} from "@/app/lib/utils/logger";
import {z} from "zod";
import {zfd} from "zod-form-data";
import {displayTimeToSeconds} from "@/app/lib/utils/duration";
import {scrobbleTracks} from "@/app/lib/services/lastfm";
import {ScrobbleReport} from "@/app/types/scrobble";

export type ScrobbleState =
    | { success: true, report: ScrobbleReport }
    | { success: false, error: string }

const scrobblesSchema = zfd.formData({
    title: z.string().min(1, "le titre est obligatoire"),
    artists: z.string().min(1, "l'artiste est obligatoire"),
    trackName: z.array(z.string()).min(1, "au minimum une piste requise"),
    trackArtist: z.array(z.string()).optional(),
    duration: z.array(z.string().regex(/^[0-9]{2}:[0-9]{2}$/), "la durée doit être au format mm:ss").optional(),
    scrobbling: z.enum(['album', 'tracks'])
}).refine((fd) => !(fd.duration && fd.duration.length > 0 && fd.duration?.length !== fd.trackName.length),
    {message: 'chaque piste doit avoir une durée'})


export async function scrobbleAction(prevState: ScrobbleState | null, formData: FormData): Promise<ScrobbleState> {
    logger.info('Scrobbling.....');

    const parsed = scrobblesSchema.safeParse(formData);
    if (!parsed.success) {
        logger.error('les données de scrobbling ne sont pas valides.');
        logger.error(parsed.error);
        return {
            success: false,
            error: `Données non valides: ${parsed.error.issues.map(issue => issue.message).join(', ')}`
        };
    }

    const trackArtists = parsed.data.trackArtist ?
        parsed.data.trackArtist.map(artist => artist === '' ? parsed.data.artists : artist) :
        Array(parsed.data.trackName.length).fill(parsed.data.artists);

    const durations = parsed.data.duration ?
        parsed.data.duration.map(duration => displayTimeToSeconds(duration)) :
        Array(parsed.data.trackName.length).fill(180);

    try {
        const response = await scrobbleTracks(parsed.data.title, parsed.data.artists, parsed.data.trackName, trackArtists, durations);

        if (response.status !== "ok") {
            return {success: false, error: 'Unexpected server error.'};
        }

        return {success: true, report: response.report};
    } catch(error) {
        return {success: false, error: `${error instanceof Error ? error.message : "Unexpected server error."}`};
    }

}