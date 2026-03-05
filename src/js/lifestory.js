/* LifeStory wrapper — registers window.LifeStory. */
(function () {
    "use strict";
    var core = window._LifeStoryCore;
    window.LifeStory = {
        generate: function (seed) { return core.generateLifeStory(seed); },
        format: function (story)  { return core.formatLifeStory(story); },
    };
}());
