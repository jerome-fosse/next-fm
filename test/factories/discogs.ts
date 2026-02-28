import type {
    DiscogsArtist,
    DiscogsImage,
    DiscogsMaster,
    DiscogsRelease,
    DiscogsTrack,
} from "@/app/lib/data/http/discogs/model/types"

export const makeDiscogsArtist = (overrides?: Partial<DiscogsArtist>): DiscogsArtist => ({
    id: 1,
    name: "Miles Davis",
    resource_url: `https://api.discogs.com/artists/${overrides?.id ?? 1}`,
    thumbnail_url: "",
    ...overrides,
})

export const makeDiscogsTrack = (overrides?: Partial<DiscogsTrack>): DiscogsTrack => ({
    position: "1",
    type_: "track",
    title: "So What",
    duration: "9:22",
    extraartists: [],
    ...overrides,
})

export const makeDiscogsImage = (overrides?: Partial<DiscogsImage>): DiscogsImage => ({
    type: "primary",
    uri: "https://api.discogs.com/images/1.jpg",
    resource_url: "https://api.discogs.com/images/1.jpg",
    uri150: "https://api.discogs.com/images/1-150.jpg",
    height: 600,
    width: 600,
    ...overrides,
})

export const makeDiscogsMaster = (overrides?: Partial<DiscogsMaster>): DiscogsMaster => ({
    id: 1234,
    title: "Kind of Blue",
    year: 1959,
    main_release: 5678,
    most_recent_release: 9012,
    resource_url: `https://api.discogs.com/masters/${overrides?.id ?? 1234}`,
    uri: `https://www.discogs.com/master/${overrides?.id ?? 1234}`,
    versions_url: `https://api.discogs.com/masters/${overrides?.id ?? 1234}/versions`,
    main_release_url: `https://api.discogs.com/releases/${overrides?.main_release ?? 5678}`,
    most_recent_release_url: `https://api.discogs.com/releases/${overrides?.most_recent_release ?? 9012}`,
    num_for_sale: 10,
    lowest_price: 5.99,
    images: [],
    genres: ["Jazz"],
    styles: ["Modal"],
    tracklist: [],
    artists: [makeDiscogsArtist()],
    data_quality: "Correct",
    videos: [],
    ...overrides,
})

export const makeDiscogsRelease = (overrides?: Partial<DiscogsRelease>): DiscogsRelease => ({
    id: 5678,
    title: "Kind of Blue",
    year: 1959,
    artists: [makeDiscogsArtist()],
    data_quality: "Correct",
    thumb: "",
    community: {
        contributors: [],
        data_quality: "Correct",
        have: 100,
        rating: { average: 4.5, count: 50 },
        status: "Accepted",
        submitter: { resource_url: "", username: "user" },
        want: 20,
    },
    companies: [],
    country: "US",
    date_added: "2020-01-01T00:00:00-08:00",
    date_changed: "2020-01-01T00:00:00-08:00",
    estimated_weight: 180,
    extraartists: [],
    format_quantity: 1,
    formats: [],
    genres: ["Jazz"],
    identifiers: [],
    images: [],
    labels: [],
    lowest_price: 5.99,
    master_id: 1234,
    master_url: `https://api.discogs.com/masters/${overrides?.master_id ?? 1234}`,
    notes: "",
    num_for_sale: 10,
    released: "1959",
    released_formatted: "1959",
    resource_url: `https://api.discogs.com/releases/${overrides?.id ?? 5678}`,
    series: [],
    status: "Accepted",
    styles: ["Modal"],
    tracklist: [],
    uri: `https://www.discogs.com/release/${overrides?.id ?? 5678}`,
    videos: [],
    ...overrides,
})

/*
export const makeDiscogsSearchResultItem = (overrides?: Partial<DiscogsSearchResultItem>): DiscogsSearchResultItem => ({
    id: 1234,
    title: "Miles Davis - Kind of Blue",
    country: "US",
    year: "1959",
    format: ["Vinyl", "LP"],
    label: ["Columbia"],
    type: "master",
    genre: ["Jazz"],
    style: ["Modal"],
    barcode: [],
    master_id: 1234,
    master_url: "https://api.discogs.com/masters/1234",
    uri: "/master/1234",
    catno: "CL 1355",
    thumb: "",
    cover_image: "",
    resource_url: "https://api.discogs.com/masters/1234",
    community: { want: 20, have: 100 },
    ...overrides,
})

export const makeDiscogsSearchResponse = (overrides?: Partial<DiscogsSearchResponse>): DiscogsSearchResponse => ({
    pagination: {
        per_page: 50,
        pages: 1,
        page: 1,
        urls: {},
        items: 1,
    },
    results: [makeDiscogsSearchResultItem()],
    ...overrides,
})
*/
