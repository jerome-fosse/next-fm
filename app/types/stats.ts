import {Artist} from "@/app/types/albums";

export type ArtistTopEntry = {
    artist: Artist,
    url: string,
    image: string,
    score: number,
}