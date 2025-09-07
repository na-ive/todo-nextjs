import React from 'react';

const lightTheme = "caramellatte";
const darkTheme = "luxury";

const ThemeScript = () => {
  const scriptTxt = `
    (function() {
      function getInitialTheme() {
        const storedTheme = window.localStorage.getItem('theme');
        if (typeof storedTheme === 'string') {
          return storedTheme;
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.matches) {
          return '${darkTheme}';
        }

        return '${lightTheme}';
      }

      const theme = getInitialTheme();
      document.documentElement.setAttribute('data-theme', theme);
    })();
  `;

  return (
    <script dangerouslySetInnerHTML={{ __html: scriptTxt }} />
  );
};

export default ThemeScript;