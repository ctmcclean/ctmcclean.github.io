// Sätteri (Astro's Markdown processor) plugin: a paragraph that is only a link
// to a video becomes an in-site player, so visitors can watch without leaving
// the page. In a post, put the link on its own line:
//
//   [Watch the discussion](https://www.youtube.com/watch?v=xF1F3JSM-fo)
//
// YouTube and Vimeo become a 16:9 player (YouTube via the no-cookie domain).
// A link whose text is "Embedded video" or "Embedded audio" with any other URL
// becomes a plain iframe at a fixed height (used for the NPR player). Links
// inside sentences are left alone. No client-side JavaScript is added.

const YT = /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/;
const VIMEO = /^https?:\/\/(?:www\.)?(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/;
const GENERIC_TEXT = /^embedded (?:video|audio)$/i;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function embedFor(url, text) {
  const title = text || 'Embedded video';
  let m;
  if ((m = url.match(YT))) {
    const src = `https://www.youtube-nocookie.com/embed/${m[1]}`;
    return `<div class="embed video"><iframe src="${src}" title="${esc(title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
  }
  if ((m = url.match(VIMEO))) {
    const src = `https://player.vimeo.com/video/${m[1]}?dnt=1`;
    return `<div class="embed video"><iframe src="${src}" title="${esc(title)}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
  }
  if (text && GENERIC_TEXT.test(text)) {
    return `<div class="embed frame"><iframe src="${esc(url)}" title="${esc(title)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
  }
  return null;
}

export const embedsPlugin = {
  name: 'embeds',
  paragraph(node, ctx) {
    if (node.children.length !== 1 || node.children[0].type !== 'link') return;
    const link = node.children[0];
    const html = embedFor(link.url, ctx.textContent(link).trim());
    if (html) ctx.replaceNode(node, { type: 'html', value: html });
  },
};
