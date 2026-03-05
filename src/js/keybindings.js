/* Keybindings — vim-style navigation + game actions.
 *
 * Keys are dispatched based on the current passage, not a mode variable.
 *
 * Corridor / general:
 *   h / ArrowLeft  → left
 *   l / ArrowRight → right
 *   k / ArrowUp    → up (stairs)
 *   j / ArrowDown  → down (stairs)
 *   x              → cross bridge
 *   .              → wait
 *   r              → read/interact (open shelves)
 *   z              → sleep/rest (stub)
 *   J              → jump into chasm
 *   `              → toggle debug panel
 *
 * Shelf Browse:
 *   Esc            → back to corridor
 *
 * Shelf Open Book:
 *   h / ArrowLeft  → previous page
 *   l / ArrowRight → next page
 *   Esc / q        → back to shelf browse
 *
 * Life Story:
 *   e              → continue to corridor
 */

(function () {
    "use strict";

    const VI_MOVE = {
        "h": "left",  "ArrowLeft":  "left",
        "l": "right", "ArrowRight": "right",
        "k": "up",    "ArrowUp":    "up",
        "j": "down",  "ArrowDown":  "down",
        "x": "cross",
    };

    setup.doMove = function (dir) {
        const loc = {
            side:     State.variables.side,
            position: State.variables.position,
            floor:    State.variables.floor,
        };
        const available = setup.Library.availableMoves(loc);
        if (!available.includes(dir)) return false;
        const dest = setup.Library.applyMove(loc, dir);
        State.variables.side     = dest.side;
        State.variables.position = dest.position;
        State.variables.floor    = dest.floor;
        setup.Tick.onMove();
        return true;
    };

    $(document).on("keydown.hell", function (ev) {
        if (ev.target.tagName === "INPUT" || ev.target.tagName === "TEXTAREA") return;

        const passage = State.passage;
        const key = ev.key;
        const v = State.variables;

        if (passage === "Shelf Open Book") {
            switch (key) {
                case "h": case "ArrowLeft":
                    ev.preventDefault();
                    if (v.openPage > 0) {
                        v.openPage -= 1;
                        Engine.play("Shelf Open Book");
                    }
                    return;
                case "l": case "ArrowRight":
                    ev.preventDefault();
                    if (v.openPage < 411) {
                        v.openPage += 1;
                        Engine.play("Shelf Open Book");
                    }
                    return;
                case "Escape": case "q":
                    ev.preventDefault();
                    v.openBook = null;
                    Engine.play("Corridor");
                    return;
            }
        } else if (passage === "Life Story") {
            if (key === "e" || key === "E") {
                ev.preventDefault();
                Engine.play("Corridor");
                return;
            }
        }

        // Corridor and general navigation (any passage not handled above)
        if (Object.prototype.hasOwnProperty.call(VI_MOVE, key)) {
            ev.preventDefault();
            if (setup.doMove(VI_MOVE[key])) Engine.play("Corridor");
            return;
        }
        switch (key) {
            case ".":
                ev.preventDefault();
                Engine.play("Wait Stub");
                break;
            case "z":
                ev.preventDefault();
                Engine.play("Wait Stub");
                break;
            case "J":
                ev.preventDefault();
                Engine.play("Chasm Stub");
                break;
            case "~":
            case "`":
                ev.preventDefault();
                v.debug = !v.debug;
                Engine.play(passage);
                break;
        }
    });
}());
