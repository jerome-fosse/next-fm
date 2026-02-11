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
