'use server'

import {fetchDiscogsMasterReleaseById, searchDiscogsAlbums} from "@/app/lib/data/discogs";
import {Album, AlbumShort, SearchAlbumsResult} from "@/app/types/albums";
import {DISCOGS, LASTFM, Origin, ORIGINS, Pagination} from "@/app/types/common";
import {fetchLastfmAlbumByIdOrNameAndArtist, searchLastfmAlbums} from "@/app/lib/data/lastfm";
import {logger} from "@/app/lib/logger";
import {z} from "zod";
import {zfd} from "zod-form-data";

export type SearchAlbumsState = {
    query: string,
    searchApi: string,
    error?: Error,
    albums?: AlbumShort[],
    pagination?: Pagination,
}

export type FetchAlbumParams = {
    id?: string,
    title?: string,
    artist?: string,
    origin: Origin,
}

export async function searchAlbumsAction(prevState: SearchAlbumsState, formData: FormData) {
    const schema = zfd.formData({
        query: zfd.text(z.string().min(1, "Une requête de recherche est obligatoire.")),
        searchapi: zfd.text(z.enum(ORIGINS, {
            error: "Seules les API Discogs et Last.fm sont supportées."
        })),
        page: zfd.numeric(z.number().int().min(1).default(1)),
    });

    const parsed = schema.safeParse(formData);

    if (!parsed.success) {
        logger.error("Paramètres de recherche invalides:", parsed.error.message);
        return {
            query: formData.get('query')?.toString() || "",
            searchApi: formData.get('searchapi')?.toString() || "",
            error: new Error('Paramètres de recherche invalides.'),
            albums: undefined,
            pagination: undefined
        };
    }

    logger.debug("searchAlbumsAction:", "SearchParams=", parsed.data);

    let data: SearchAlbumsResult;

    switch (parsed.data.searchapi) {
        case "Discogs":
            data = await searchDiscogsAlbums(parsed.data.query, parsed.data.page);
            break;
        case "Last.fm":
            data = await searchLastfmAlbums(parsed.data.query, parsed.data.page);
            break;
        default:
            throw new Error("API de recherche non supportée");
    }

    return {
        query: parsed.data.query,
        searchApi: parsed.data.searchapi,
        error: undefined,
        albums: data.albums,
        pagination: data.pagination
    };
}

export async function fetchAlbumAction(params: FetchAlbumParams): Promise<Album> {
    logger.debug("fetchAlbumAction:", "params=", params);

    const schema = z.object({
        idDiscogs: z.coerce.number().int().optional().catch(undefined),
        idLastfm: z.string().optional(),
        title: z.string().optional(),
        artist: z.string().optional(),
        origin: z.enum(ORIGINS),
    }).refine(data => {
            if (data.origin === LASTFM) {
                return data.idLastfm || (data.title && data.artist)
            }

            return true;
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
        throw new Error("Les parametres d'album sont invalides.");
    }

    switch (parsed.data.origin) {
        case DISCOGS:
            if (!parsed.data.idDiscogs) {
                throw new Error("L'id est obligatoire pour Discogs.");
            }

            return await fetchDiscogsMasterReleaseById(parsed.data.idDiscogs);
        case LASTFM:
            return await fetchLastfmAlbumByIdOrNameAndArtist(parsed.data.idLastfm, parsed.data.title, parsed.data.artist);
        default:
            throw new Error(`Cette origine est non supportée: ${origin}`);
    }
}