/* PRNG wrapper — registers window.PRNG. */

(function () {
    "use strict";

    window.PRNG = {
        _rng:  null,
        _seed: null,

        seed: function (s) {
            this._seed = String(s);
            this._rng  = window._PRNGCore.seedFromString(this._seed);
        },

        next: function ()     { this._assertSeeded(); return this._rng.next(); },
        nextInt: function (n) { this._assertSeeded(); return this._rng.nextInt(n); },
        fork: function (key)  { this._assertSeeded(); return this._rng.fork(key); },
        getSeed: function ()  { return this._seed; },

        _assertSeeded: function () {
            if (!this._rng) throw new Error("PRNG not seeded — call PRNG.seed() first");
        }
    };
}());
