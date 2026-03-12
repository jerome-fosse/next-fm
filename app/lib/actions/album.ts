'use server'

import {fetchDiscogsMasterReleaseById} from "@/app/lib/services/discogs";
import {Album} from "@/app/types/albums";
import {DISCOGS, LASTFM, Origin, ORIGINS} from "@/app/types/common";
import {fetchLastfmAlbumByIdOrNameAndArtist} from "@/app/lib/services/lastfm";
import {logger} from "@/app/lib/utils/logger";
import {z} from "zod";

export type FetchAlbumParams = {
    id?: string,
    title?: string,
    artist?: string,
    origin: Origin,
}

export type FetchAlbumResult =
    | { success: true, album: Album }
    | { success: false, error: string }

export async function fetchAlbumAction(params: FetchAlbumParams): Promise<FetchAlbumResult> {
    logger.debug("fetchAlbumAction:", "params=", params);

    const schema = z.object({
        idDiscogs: z.coerce.number().int().optional().catch(undefined),
        idLastfm: z.string().optional(),
        title: z.string().optional(),
        artist: z.string().optional(),
        origin: z.enum(ORIGINS),
    }).refine(data => {
            return data.origin === LASTFM ?
                data.idLastfm || (data.title && data.artist) :
                true;
        },
        {message: "Vous devez donner soit un id, soit un titre et un artiste."}
    );

    const parsed = schema.safeParse({
        idDiscogs: params.id,
        idLastfm: params.id,
        ...params
    });
    if (!parsed.success) {
        logger.error("Paramètres d'album invalides:", parsed.error.message);
        return {success: false, error: "Les parametres d'album sont invalides."};
    }

    try {
        switch (parsed.data.origin) {
            case DISCOGS:
                if (!parsed.data.idDiscogs) {
                    return {success: false, error: "L'id est obligatoire pour Discogs."};
                }
                return {success: true, album: await fetchDiscogsMasterReleaseById(parsed.data.idDiscogs)};
            case LASTFM:
                return {success: true, album: await fetchLastfmAlbumByIdOrNameAndArtist(parsed.data.idLastfm, parsed.data.title, parsed.data.artist)};
        }
    } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : "Une erreur inattendue s'est produite."};
    }
}