import {Pagination} from "@/app/types/common";
import {DiscogsPagination} from "@/app/lib/http/discogs";

export function discogsPaginationToPagination(pagination: DiscogsPagination): Pagination {
    return {
        page: pagination.page,
        pages: pagination.pages,
        size: pagination.per_page,
        total: pagination.items,
        urls: {
            first: pagination.urls?.first,
            prev: pagination.urls?.prev,
            next: pagination.urls?.next,
            last: pagination.urls?.last,
        }
    }
}

export function secondsToDuration(seconds: number): string {
    return new Date(seconds * 1000).toISOString()
        .slice(11, 19)
        .split(':')
        .filter((s, i) => !(s === '00' && i === 0))
        .join(':')
        ;
}
