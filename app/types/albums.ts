import {Origin, Pagination} from "@/app/types/common";

export type SearchAlbumsResult ={
    albums: AlbumShort[],
    pagination: Pagination,
}

export type AlbumShort = {
    id: string,
    title: string,
    year?: string,
    artist: Artist,
    origin: Origin,
    url?: string,
    images?: Image[],
}

export type Album = {
    id: string,
    title: string,
    origin: Origin,
    genres?: string[],
    styles?: string[],
    tags?: string[],
    released?: string,
    year?: number,
    artists: Artist[],
    tracks: Track[],
    images?: Image[],
}

export type Track = {
    position: string,
    title: string,
    duration?: string,
    artists?: Artist[],
}

export type Artist = {
    id: string,
    name: string,
    roles: string,
}

export type Image = {
    type?: "primary" | "secondary" | "",
    size?: "small" | "medium" | "large" | "extralarge" | "mega" | "",
    height?: number,
    width?: number,
    uri: string,
}
