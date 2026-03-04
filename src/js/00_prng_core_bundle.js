/* Browser bundle for prng.core — exposes window._PRNGCore.
 * Prefixed 00_ so tweego includes it before prng.js (alphabetical order).
 * The pure logic is duplicated here; prng.core.js is the canonical ES module
 * source used by tests. Keep them in sync.
 */

(function () {
    "use strict";

    function hash(str) {
        let h = 0xdeadbeef;
        for (let i = 0; i < str.length; i++) {
            h = Math.imul(h ^ str.charCodeAt(i), 0x9e3779b9);
        }
        h ^= h >>> 16;
        h = Math.imul(h, 0x85ebca6b);
        h ^= h >>> 13;
        h = Math.imul(h, 0xc2b2ae35);
        h ^= h >>> 16;
        return h >>> 0;
    }

    function makeXoshiro128ss(a, b, c, d) {
        let s0 = a, s1 = b, s2 = c, s3 = d;
        return {
            next() {
                const t = s1 << 9;
                let r = s0 * 5;
                r = ((r << 7) | (r >>> 25)) * 9;
                s2 ^= s0; s3 ^= s1; s1 ^= s2; s0 ^= s3;
                s2 ^= t;
                s3 = (s3 << 11) | (s3 >>> 21);
                return (r >>> 0) / 0x100000000;
            },
            nextInt(n) { return Math.floor(this.next() * n); },
            fork(key) {
                const s = hash(key + String(this.nextInt(0xffffffff)));
                return makeXoshiro128ss(
                    hash("a" + s), hash("b" + s),
                    hash("c" + s), hash("d" + s)
                );
            }
        };
    }

    window._PRNGCore = {
        hash,
        makeXoshiro128ss,
        seedFromString(str) {
            return makeXoshiro128ss(
                hash(str + "a"), hash(str + "b"),
                hash(str + "c"), hash(str + "d")
            );
        }
    };

    const BOTTOM_FLOOR = 0;
    const SEGMENT_BOOK_COUNT = 640;
    const DIRS = { LEFT: "left", RIGHT: "right", UP: "up", DOWN: "down", CROSS: "cross" };

    function locationKey({ side, position, floor }) {
        return `${side}:${position}:${floor}`;
    }

    function generateSegment(side, position, floor, forkRng) {
        const rng = forkRng("seg:" + locationKey({ side, position, floor }));
        const lightLevel = rng.next() < 0.05 ? "dim" : "normal";
        return {
            side, position, floor,
            lightLevel,
            restArea: {
                hasSubmissionSlot: true,
                hasStairs: true,
                hasKiosk: true,
                bedsAvailable: 7,
                hasZoroastrianText: position === 0,
            },
            hasBridge: floor === BOTTOM_FLOOR,
            bookCount: SEGMENT_BOOK_COUNT,
        };
    }

    function availableMoves({ side, position, floor }) {
        const moves = [DIRS.LEFT, DIRS.RIGHT, DIRS.UP];
        if (floor > BOTTOM_FLOOR) moves.push(DIRS.DOWN);
        if (floor === BOTTOM_FLOOR) moves.push(DIRS.CROSS);
        return moves;
    }

    function applyMove({ side, position, floor }, dir) {
        switch (dir) {
            case DIRS.LEFT:  return { side, position: position - 1, floor };
            case DIRS.RIGHT: return { side, position: position + 1, floor };
            case DIRS.UP:    return { side, position, floor: floor + 1 };
            case DIRS.DOWN:
                if (floor <= BOTTOM_FLOOR) throw new Error("Cannot descend below floor 0");
                return { side, position, floor: floor - 1 };
            case DIRS.CROSS:
                if (floor !== BOTTOM_FLOOR) throw new Error("Can only cross at the bottom floor");
                return { side: side === 0 ? 1 : 0, position, floor };
            default: throw new Error(`Unknown direction: ${dir}`);
        }
    }

    function describeLocation({ side, position, floor }) {
        return `${side === 0 ? "west" : "east"} corridor, segment ${position}, floor ${floor}`;
    }

    window._LibraryCore = {
        DIRS, BOTTOM_FLOOR, SEGMENT_BOOK_COUNT,
        locationKey, generateSegment, availableMoves, applyMove, describeLocation,
    };

    // ---- BookCore ----

    const PAGES_PER_BOOK = 410;
    const LINES_PER_PAGE = 40;
    const CHARS_PER_LINE = 80;
    const CHARS_PER_PAGE = LINES_PER_PAGE * CHARS_PER_LINE;
    const CHARS_PER_BOOK = PAGES_PER_BOOK * CHARS_PER_PAGE;
    const CHARSET = Array.from({ length: 95 }, (_, i) => String.fromCharCode(i + 32)).join("");

    function generateBookPage(side, position, floor, bookIndex, pageIndex, forkRng) {
        const rng = forkRng(`book:${side}:${position}:${floor}:${bookIndex}:p${pageIndex}`);
        const n = CHARSET.length;
        const lines = [];
        for (let l = 0; l < LINES_PER_PAGE; l++) {
            let line = "";
            for (let c = 0; c < CHARS_PER_LINE; c++) {
                line += CHARSET[rng.nextInt(n)];
            }
            lines.push(line);
        }
        return lines.join("\n");
    }

    function bookMeta(side, position, floor, bookIndex) {
        return { side, position, floor, bookIndex };
    }

    function findCoherentFragment(pageText) {
        const match = pageText.match(/[a-zA-Z ,.'!?\-]{4,}/g);
        if (!match) return null;
        return match.reduce((best, s) => s.length > best.length ? s : best, "");
    }

    window._BookCore = {
        PAGES_PER_BOOK, LINES_PER_PAGE, CHARS_PER_LINE, CHARS_PER_PAGE, CHARS_PER_BOOK, CHARSET,
        generateBookPage, bookMeta, findCoherentFragment,
    };
}());
