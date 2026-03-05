#!/usr/bin/env node
// Builds dist/index.html by inlining CSS and JS into the HTML template.

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT  = resolve(__dir, "..");

// Read template
let html = readFileSync(resolve(ROOT, "src/html/index.html"), "utf8");

// Inline CSS
const css = readFileSync(resolve(ROOT, "src/css/style.css"), "utf8");
html = html.replace("/* INJECT:CSS */", css);

// Collect JS files in load order:
// 1. 00_prng_core_bundle.js (the IIFE bundle — must be first)
// 2. prng.js, library.js, book.js, lifestory.js, survival.js, tick.js (wrappers)
// 3. engine.js (state + router)
// 4. screens.js (screen renderers)
// 5. keybindings.js (input handling)
// 6. debug.js (debug API)
const jsOrder = [
    "00_prng_core_bundle.js",
    "prng.js",
    "library.js",
    "book.js",
    "lifestory.js",
    "survival.js",
    "tick.js",
    "events.js",
    "npc.js",
    "engine.js",
    "screens.js",
    "keybindings.js",
    "debug.js",
];

const jsDir = resolve(ROOT, "src/js");
const scripts = jsOrder.map(name => {
    const path = resolve(jsDir, name);
    return readFileSync(path, "utf8");
});

// Inline content/text.json as window.TEXT
const textJson = readFileSync(resolve(ROOT, "content/text.json"), "utf8");
const textBlock = "<script>window.TEXT = " + textJson + ";</script>";

const jsBlock = "<script>\n" + scripts.join("\n\n") + "\n</script>";
html = html.replace("<!-- INJECT:JS -->", textBlock + "\n" + jsBlock);

writeFileSync(resolve(ROOT, "dist/index.html"), html, "utf8");
console.log("Built: dist/index.html");
