/* Debug API — window.Debug for console / shot-scraper use. */

(function () {
    "use strict";

    window.Debug = {
        goToLocation: function (side, position, floor) {
            state.side     = side;
            state.position = position;
            state.floor    = floor;
            Engine.goto("Corridor");
        },

        goToBook: function (side, position, floor, bookIndex) {
            state.side      = side;
            state.position  = position;
            state.floor     = floor;
            state.openBook  = { side: side, position: position, floor: floor, bookIndex: bookIndex };
            state.openPage  = 0;
            Engine.goto("Shelf Open Book");
        },

        openPage: function (n) {
            if (!state.openBook) return "no book open";
            state.openPage = n;
            Engine.goto("Shelf Open Book");
        },

        getBookKey: function () {
            var b = state.openBook;
            if (!b) return null;
            return b.side + ":" + b.position + ":" + b.floor + ":" + b.bookIndex;
        },

        getLocation: function () {
            return { side: state.side, position: state.position, floor: state.floor };
        },

        setSeed: function (seed) {
            var url = new URL(window.location.href);
            url.searchParams.set("seed", String(seed));
            window.location.href = url.toString();
        },

        setTick: function (n) {
            state.tick     = Math.max(0, Math.min(239, n));
            state.lightsOn = state.tick < 160;
            Engine.goto(state.screen);
        },

        setDay: function (n) {
            state.day = Math.max(1, n);
            Engine.goto(state.screen);
        },

        nearLightsOut: function () { this.setTick(155); },
        nearDawn: function () { this.setTick(235); },

        getTime: function () {
            return { tick: state.tick, day: state.day, lightsOn: state.lightsOn };
        },

        setStat: function (name, value) {
            var allowed = ["hunger", "thirst", "exhaustion", "morale", "mortality"];
            if (allowed.indexOf(name) === -1) return "unknown stat: " + name;
            state[name] = Math.max(0, Math.min(100, value));
            Engine.goto(state.screen);
        },

        triggerParched: function () { this.setStat("thirst", 0); },
        triggerStarving: function () { this.setStat("hunger", 0); },

        getStats: function () {
            return {
                hunger: state.hunger, thirst: state.thirst, exhaustion: state.exhaustion,
                morale: state.morale, mortality: state.mortality,
                despairing: state.despairing, dead: state.dead,
            };
        },
    };
}());
