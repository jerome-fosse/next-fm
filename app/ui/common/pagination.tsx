'use client'

import {memo, useState} from "react";
import {logger} from "@/app/lib/logger";

type Props = {
    pages: number,
    page: number,
    showFirst?: boolean,
    showLast?: boolean,
    showPrev?: boolean,
    showNext?: boolean,
    firstLabel?: string,
    lastLabel?: string,
    prevLabel?: string,
    nextLabel?: string,
    onChangePage: (page: number) => void
}

//export default function PaginationControl({
const PaginationControl= memo(function PaginationControl({
                                       pages,
                                       page,
                                       showFirst = true,
                                       showLast = true,
                                       showPrev = true,
                                       showNext = true,
                                       firstLabel ="<<",
                                       lastLabel = ">>",
                                       prevLabel = "<",
                                       nextLabel = ">",
                                       onChangePage
                                   }: Props) {

    logger.debug("PaginationControl Params:", "pages=", pages, "page=", page, "showFirst=", showFirst, "showLast=", showLast, "showPrev=", showPrev, "showNext=", showNext, "firstLabel=", firstLabel, "lastLabel=", lastLabel, "prevLabel=", prevLabel, "nextLabel=", nextLabel);

    function changePage(page: number) {
        onChangePage(page);
        setActivePage(page);
    }

    const [activePage, setActivePage] = useState(page);
    const startPagesRange = Math.max(1, Math.min(page - 3, pages - 6));
    const endPagesRange = Math.min(pages, startPagesRange + 6);
    const pagesRange = [...Array(endPagesRange - startPagesRange + 1).keys()].map((_, i) => i + startPagesRange);

    logger.debug("PaginationControl:", "startPagesRange=", startPagesRange, "endPagesRange=", endPagesRange, "pagesRange=", pagesRange);

    return (
        <div className="join">
            {showFirst && <button className="join-item btn" name="first" onClick={() => changePage(1)}>{firstLabel}</button>}
            {showPrev && <button className={`join-item btn ${activePage === 1 ? 'btn-disabled' : ''}`} name="previous" onClick={() => changePage(activePage - 1)}>{prevLabel}</button>}
            {pagesRange.map((value, i) =>
                <input key={i} className="join-item btn btn-square checked:btn-secondary" type="radio" name="page" aria-label={value.toString()} onChange={() => changePage(value)} checked={page === value} />
            )}
            {showNext && <button className={`join-item btn ${activePage === pages ? 'btn-disabled' : ''}`} name="next" onClick={() => changePage(activePage + 1)}>{nextLabel}</button>}
            {showLast && <button className={`join-item btn`} name="last" onClick={() => changePage(pages)}>{lastLabel}</button>}
        </div>
    )
});

export default PaginationControl;