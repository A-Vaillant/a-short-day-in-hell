/* Book wrapper — registers window.Book. */

(function () {
    "use strict";

    var core = window._BookCore;

    window.Book = {
        getPage: function (side, position, floor, bookIndex, pageIndex) {
            return core.generateBookPage(
                side, position, floor, bookIndex, pageIndex,
                PRNG.getSeed()
            );
        },

        getMeta: function (side, position, floor, bookIndex) {
            return core.bookMeta(side, position, floor, bookIndex);
        },

        findCoherentFragment: function (pageText) {
            return core.findCoherentFragment(pageText);
        },

        PAGES_PER_BOOK: core.PAGES_PER_BOOK,
        CHARS_PER_LINE: core.CHARS_PER_LINE,
        LINES_PER_PAGE: core.LINES_PER_PAGE,
    };
}());
