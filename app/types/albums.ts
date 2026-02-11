import {Pagination} from "@/app/types/common";

export type SearchAlbumsResult ={
    albums: AlbumShort[],
    pagination: Pagination,
}

export type AlbumShort = {
    id: string,
    title: string,
    year?: string,
    artist: Artist,
    origin: "Discogs" | "Last.fm"
    url?: string,
    images?: Image[],
}

export type Album = {
    id: string,
    title: string,
    artist: Artist,
    year?: number,
    images?: Image[],
}

export type Artist = {
    id: string,
    name: string,
}

export type Image = {
    size: "small" | "medium" | "large" | "extralarge" | "mega" | ""
    uri: string,
}