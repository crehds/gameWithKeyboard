import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* Shared layout tokens: side safe area and reserved header height, used
       by the keyboard sizing, the status bar and the round banner so none
       of them overlap on any viewport. */
    --gutter: 8px;
    --header: 64px;
  }

  html {
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  ul, li, h1, h2, h3, p, button { margin: 0; padding: 0; }
  ul { list-style: none; }
  button {
    background: transparent;
    border: 0;
  }
  button:focus {
    outline: 0;
  }
  button:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }

  /* #app {
    box-shadow: 0 0 10px rgba(0, 0, 0, .05);
    overflow-x: hidden;
    min-height: 100vh;
    padding-bottom: 10px; 
  } */

  body {
    background: black;
    color: white;
    /* height: 100vh; */
  }


  #root {
    /* min-height: 100vh; */
  }

  .App {
    font-family: 'Montserrat', sans-serif;
    position:relative;
    /* min-height: 100vh; */
    /* width: 100%; */
  }
`;

export default GlobalStyle;
