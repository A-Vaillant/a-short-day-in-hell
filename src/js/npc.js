/* NPC wrapper — exposes window.Npc from _NpcCore + TEXT. */

(function () {
    "use strict";
    var C = window._NpcCore;
    var names = window.TEXT.npc_names;
    var dialogue = window.TEXT.npc_dialogue;

    window.Npc = {
        DISPOSITIONS: C.DISPOSITIONS,
        getNPCsAt:    C.getNPCsAt,

        /** Initialize NPCs near player start. */
        init: function () {
            var rng = PRNG.fork("npc:spawn");
            var loc = { side: state.side, position: state.position, floor: state.floor };
            state.npcs = C.spawnNPCs(loc, 8, names, rng);
        },

        /** Daily tick: move NPCs and deteriorate. Called at dawn. */
        onDawn: function () {
            var moveRng = PRNG.fork("npc:move:" + state.day);
            state.npcs = C.moveNPCs(state.npcs, moveRng);

            var detRng = PRNG.fork("npc:det:" + state.day);
            state.npcs = state.npcs.map(function (npc) {
                return C.deteriorate(npc, state.day, detRng);
            });
        },

        /** Get NPCs at player's current location. */
        here: function () {
            if (!state.npcs) return [];
            return C.getNPCsAt(state.npcs, state.side, state.position, state.floor);
        },

        /** Get interaction text for an NPC. */
        talk: function (npc) {
            var rng = PRNG.fork("npc:talk:" + npc.id + ":" + state.day);
            return C.interactText(npc, dialogue, rng);
        }
    };
}());
