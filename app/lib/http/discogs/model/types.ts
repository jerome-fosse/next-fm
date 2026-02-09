
export type DiscogsPagination = {
    per_page: number,
    pages: number,
    page: number,
    urls: {
        first?: string,
        prev?: string,
        next?: string,
        last?: string,
    },
    items: number
}

export type DiscogsErrorResponse = {
    message: string
}

export type DiscogsRelease = {
    title: string
    id: number
    artists: DiscogsArtist[]
    data_quality: string
    thumb: string
    community: {
        contributors: DiscogsUser[]
        data_quality: string
        have: number
        rating: {
            average: number
            count: number
        }
        status: string
        submitter: DiscogsUser
        want: number
    }
    companies: DiscogsCompany[]
    country: string
    date_added: string // ISO-8601
    date_changed: string // ISO-8601
    estimated_weight: number
    extraartists: DiscogsArtist[]
    format_quantity: number
    formats: DiscogsFormat[]
    genres: string[]
    identifiers: DiscogsIdentifier[]
    images: DiscogsImage[]
    labels: DiscogsLabel[]
    lowest_price: number
    master_id: number
    master_url: string
    notes: string
    num_for_sale: number
    released: string
    released_formatted: string
    resource_url: string
    series: unknown[]
    status: string
    styles: string[]
    tracklist: DiscogsTrack[]
    uri: string
    videos: DiscogsVideo[]
    year: number
}

export type DiscogsMaster = {
    id: number
    main_release: number
    most_recent_release: number
    resource_url: string
    uri: string
    versions_url: string
    main_release_url: string
    most_recent_release_url: string
    num_for_sale: number
    lowest_price: number
    images: DiscogsImage[]
    genres: string[]
    styles: string[]
    year: number
    tracklist: DiscogsTrack[]
    artists: DiscogsArtist[]
    title: string
    data_quality: string
    videos: DiscogsVideo[]
}

export type DiscogsUser = {
    resource_url: string
    username: string
}

export type DiscogsArtist = {
    id: number
    name: string
    anv?: string
    join?: string
    role?: string
    resource_url: string
    thumbnail_url: string
    tracks?: string
}

export type DiscogsCompany = {
    catno: string
    entity_type: string
    entity_type_name: string
    id: number
    name: string
    resource_url: string
}

export type DiscogsFormat = {
    descriptions: string[]
    name: string
    qty: string
}

export type DiscogsIdentifier = {
    type: string
    value: string
}

export type DiscogsImage = {
    type: "primary" | "secondary"
    uri: string
    resource_url: string
    uri150: string
    height: number
    width: number
}

export type DiscogsLabel = {
    catno: string
    entity_type: string
    id: number
    name: string
    resource_url: string
}

export type DiscogsTrack = {
    position: string
    type_: string
    title: string
    duration: string
    extraartists: DiscogsArtist[]
}

export type DiscogsVideo = {
    uri: string
    title: string
    description: string
    duration: number
    embed: boolean
}

// Search parameters
export type DiscogsSearchParams = {
    // Your search query. (optional)<br>
    // Example: nirvana
    query?: string,
    type?: "release" | "master" | "artist" | "label",
    // Search by combined “Artist Name - Release Title” title field. (optional)<br>
    // Example: nirvana - nevermind
    title?: string,
    // Search release titles. (optional)<br>
    // Example: nevermind
    release_title?: string,
    // Search release credits. (optional)<br>
    // Example: kurt cobain
    credit?: string,
    // Search artist names. (optional)<br>
    // Example: nirvana
    artist?: string,
    // Search artist ANV. (optional)<br>
    // Example: nirvana
    anv?: string,
    // Search label names. (optional)<br>
    // Example: dgc
    label?: string,
    // Search genres. (optional)<br>
    // Example: rock
    genre?: string,
    // Search styles. (optional)<br>
    // Example: grunge
    style?: string,
    // Search release country. (optional)<br>
    // Example: canada
    country?: string,
    // Search release year. (optional)<br>
    // Example: 1991
    year?: number,
    // Search format. (optional)<br>
    // Example: album
    format?: string,
    // Search catalog number. (optional)<br>
    // Example: DGCD-24425
    catno?: string,
    // Search barcode. (optional)<br>
    // Example: 7 2064-24425-2 4
    barcode?: string,
    // Search track titles. (optional)<br>
    // Example: smells like teen spirit
    track?: string,
    // Search submitter username. (optional)<br>
    // Example: jerome99
    submitter?: string,
    // Search contributor username. (optional)<br>
    // Example: jerome99
    contributor?: string,
    // Number of results to return per page. (optional)<br>
    // Example: 20
    per_page?: number,
    // Page number to retrieve. (optional)<br>
    // Example: 1
    page?: number,
}

export type DiscogsSearchResultItem = {
    id: number
    title: string
    country: string
    year: string
    format: string[]
    label: string[]
    type: string
    genre: string[]
    style: string[]
    barcode: string[],
    master_id: number,
    master_url: string,
    uri: string
    catno: string
    thumb: string,
    cover_image: string,
    resource_url: string
    community: {
        want: number
        have: number
    }
}

export type DiscogsSearchResponse = {
    pagination: DiscogsPagination,
    results: DiscogsSearchResultItem[]
}