import { css } from '@emotion/react/macro';

export const globalCSS = css`
  * {
    border-width: 0px;
    border-width: 0px;
    box-sizing: border-box;
  }

  html,
  body,
  h1,
  input,
  select {
    font-family: 'Montserrat', sans-serif;
    height: 100%;
  }

  body {
    font-size: 14px;
    font-weight: 400;
    position: relative;
    min-height: 100%;
    height: 100%;
    color: var(--colors-font-body);
    background-color: var(--colors-body);
    min-width: fit-content;
    line-height: var(--lineHeights-normal);
  }

  ol,
  ul {
    list-style: none;
  }
  blockquote,
  q {
    quotes: none;
  }
  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
  }
`;

export const presetCSS = css`
  .chakra-modal__content-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0px;
    top: 0px;
    justify-content: center;
    align-items: flex-start;
    overflow: auto;
  }
`;
