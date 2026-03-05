/* Survival wrapper — registers window.Surv.
 * Reads/writes window.state directly.
 */
(function () {
    "use strict";
    var core = window._SurvivalCore;

    window.Surv = {
        init: function () {
            var d = core.defaultStats();
            state.hunger     = d.hunger;
            state.thirst     = d.thirst;
            state.exhaustion = d.exhaustion;
            state.morale     = d.morale;
            state.mortality  = d.mortality;
            state.despairing = d.despairing;
            state.dead       = d.dead;
        },

        _statsFromState: function () {
            return {
                hunger: state.hunger, thirst: state.thirst, exhaustion: state.exhaustion,
                morale: state.morale, mortality: state.mortality,
                despairing: state.despairing, dead: state.dead,
            };
        },

        onMove: function () {
            Object.assign(state, core.applyMoveTick(this._statsFromState()));
        },

        onSleep: function () {
            Object.assign(state, core.applySleep(this._statsFromState()));
        },

        onResurrection: function () {
            Object.assign(state, core.defaultStats());
        },

        onEat: function ()   { Object.assign(state, core.applyEat(this._statsFromState())); },
        onDrink: function () { Object.assign(state, core.applyDrink(this._statsFromState())); },

        severity: function (val) { return core.severity(val); },
        showMortality: function () { return core.showMortality(this._statsFromState()); },
        warnings: function () { return core.getWarnings(this._statsFromState()); },
        describeRising: function (val) {
            return core.describeFromTable(val, TEXT.stats.rising);
        },
        describeMorale: function (val) {
            // Morale is inverted: 100=good, 0=bad. Invert so table works like rising.
            return core.describeFromTable(100 - val, TEXT.stats.morale);
        },
    };
}());
