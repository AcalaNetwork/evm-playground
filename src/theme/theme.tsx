export interface CustomTheme {
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
  };
  sizes: {
    body: string;
  };
  linearGradient1: string;
}

export const theme: CustomTheme = {
  breakpoints: {
    sm: '768px',
    md: '900px',
    lg: '1200px'
  },
  sizes: {
    body: '1200px'
  },
  linearGradient1: 'linear-gradient(93.99deg, #5493F1 3.36%, #0500F2 112.98%)'
};
