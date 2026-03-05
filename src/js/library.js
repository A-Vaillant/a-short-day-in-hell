/* Library wrapper — registers window.Lib. */

(function () {
    "use strict";

    var core = window._LibraryCore;

    window.Lib = {
        _cache: {},

        getSegment: function (side, position, floor) {
            var key = core.locationKey({ side: side, position: position, floor: floor });
            if (!this._cache[key]) {
                this._cache[key] = core.generateSegment(
                    side, position, floor,
                    function (k) { return PRNG.fork(k); }
                );
            }
            return this._cache[key];
        },

        availableMoves: function (loc)   { return core.availableMoves(loc); },
        applyMove: function (loc, dir)   { return core.applyMove(loc, dir); },
        describeLocation: function (loc) { return core.describeLocation(loc); },

        DIRS: core.DIRS,
        BOTTOM_FLOOR: core.BOTTOM_FLOOR,
        BOOKS_PER_GALLERY: core.BOOKS_PER_GALLERY,
        GALLERIES_PER_SEGMENT: core.GALLERIES_PER_SEGMENT,
        isRestArea: core.isRestArea,

        debugSegment: function (side, position, floor) {
            var s = this.getSegment(side, position, floor);
            var moves = core.availableMoves({ side: side, position: position, floor: floor });
            return "Segment [side:" + side + ", pos:" + position + ", floor:" + floor + "]\n" +
                "Light: " + s.lightLevel + "\n" +
                "Bridge: " + s.hasBridge + "\n" +
                "Available moves: " + moves.join(", ");
        }
    };
}());
