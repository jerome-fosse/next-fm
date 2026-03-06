'use server'

import {fetchDiscogsMasterReleaseById} from "@/app/lib/services/discogs";
import {Album} from "@/app/types/albums";
import {DISCOGS, LASTFM, Origin, ORIGINS} from "@/app/types/common";
import {fetchLastfmAlbumByIdOrNameAndArtist} from "@/app/lib/services/lastfm";
import {logger} from "@/app/lib/utils/logger";
import {z} from "zod";
import {match} from "ts-pattern";

export type FetchAlbumParams = {
    id?: string,
    title?: string,
    artist?: string,
    origin: Origin,
}

export type FetchAlbumResult =
    | { album: Album; error?: never }
    | { album?: never; error: string }

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
        return {error: "Les parametres d'album sont invalides."};
    }

    type Params = z.infer<typeof schema>
    const handleDiscogs = async (params: Params) => {
        if (!params.idDiscogs) {
            return {error: "L'id est obligatoire pour Discogs."};
        }
        return {album: await fetchDiscogsMasterReleaseById(params.idDiscogs)};
    }
    const handleLastfm = async (params: Params) => {
        return {album: await fetchLastfmAlbumByIdOrNameAndArtist(params.idLastfm, params.title, params.artist)};
    }

    try {
        return match(parsed.data.origin)
            .with(DISCOGS, async () => handleDiscogs(parsed.data))
            .with(LASTFM, async () => handleLastfm(parsed.data))
            .exhaustive();
    } catch (error) {
        return {error: error instanceof Error ? error.message : "Une erreur inattendue s'est produite."};
    }
}