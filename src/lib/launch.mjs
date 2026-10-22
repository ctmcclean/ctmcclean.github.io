// Feature switches. Plain JavaScript so astro.config.mjs and the pages can both import it.
//
// JMED_LIVE: while false, /jmed/ renders a short page and the build leaves out the Atlas
// (dist/jmed/map/) and the codebook PDF.
export const JMED_LIVE = false;
