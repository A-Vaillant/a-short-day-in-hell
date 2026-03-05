/* Events wrapper — exposes window.Events from _EventsCore + TEXT. */

(function () {
    "use strict";
    var C = window._EventsCore;
    var cards = window.TEXT.events;

    window.Events = {
        cards: cards,
        createDeck:  C.createDeck,
        drawEvent:   C.drawEvent,

        /** Draw an event, mutate state in place. Returns event card or null. */
        draw: function () {
            var rng = PRNG.fork("event:" + state.tick + ":" + state.day);
            var result = C.drawEvent(state.eventDeck || [], cards, rng);
            state.eventDeck = result.deck;
            if (result.event) {
                state.lastEvent = result.event;
                if (result.event.morale) {
                    state.morale = Math.max(0, Math.min(100, state.morale + result.event.morale));
                }
            } else {
                state.lastEvent = null;
            }
            return result.event;
        },

        /** Initialize event deck in state. */
        init: function () {
            var rng = PRNG.fork("eventdeck:init");
            state.eventDeck = C.createDeck(cards.length, rng);
            state.lastEvent = null;
        }
    };
}());
