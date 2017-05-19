let scrollPosition = 0;
let frozen = false;

const canUseDOM = typeof window !== 'undefined';

export const freezeScrollPosition = () => {
  if (frozen || !canUseDOM) {
    return;
  }

  frozen = true;

  const {document: {documentElement: html, body}, innerHeight} = window;

  // Detect if the page scrollbar was visible.
  const hasScrollbar = body.scrollHeight > innerHeight;

  // Capture the current scroll position.
  scrollPosition = body.scrollTop || html.scrollTop;

  // Preserve the scrollbar with position "scroll" to prevent horizontal jank.
  html.style.overflowY = hasScrollbar ? 'scroll' : 'hidden';
  html.style.position = 'fixed';
  body.style.position = 'fixed';
  body.style.width = '100%';
  html.style.right = html.style.left = 0;

  // Offset the now fixed document by the previous scroll position. This
  // preserves the scroll position when changing the `overflow` property on the
  // document.
  html.style.top = `${-scrollPosition}px`;
};

export const thawScrollPosition = () => {
  if (!frozen || !canUseDOM) {
    return;
  }

  frozen = false;

  const {document: {documentElement: html, body}} = window;

  // Clear inline style attributes.
  // TODO: Return these to the initial values instead of clearing them.
  html.style.overflowY = '';
  html.style.position = '';
  html.style.overflow = '';
  html.style.right = '';
  html.style.left = '';
  html.style.top = '';
  body.style.position = '';
  body.style.width = '';

  // Restore saved scroll position.
  body.scrollTop = html.scrollTop = scrollPosition;
};
