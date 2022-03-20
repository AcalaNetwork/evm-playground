export interface CustomTheme {
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
  };
  colors: {
    header: string;
    body: string;
    inputBg: string;
    modalCard: string;
    borderFocus: string;
    borderColor1: string;
    borderColor2: string;
    card: string;
    mainButton: string;
    font: {
      input: string;
      button: string;
      title: string;
      card: string;
      body: string;
      nav: string;
      navActive: string;
    };
  };
  sizes: {
    container: string;
  };
  lineHeights: {
    normal: number;
    none: number;
  };
}

export const theme: CustomTheme = {
  breakpoints: {
    sm: '768px',
    md: '1024px',
    lg: '1440px'
  },
  colors: {
    header: '#171b21',
    body: '#0d1117',
    inputBg: '#232426',
    modalCard: '#2c2f36',
    borderFocus: '#1f6feb',
    borderColor1: '#30363d',
    borderColor2: '#3c3c3c',
    card: '#161b22',
    mainButton: '#1d69e0',
    font: {
      input: '#c9d1d9',
      button: '#ffffff',
      title: '#ffffff',
      card: '#c9d1d9',
      body: '#c9d1d9',
      nav: '#8b949e',
      navActive: '#ffffff'
    }
  },
  sizes: {
    container: '1024px'
  },
  lineHeights: {
    normal: 1.5,
    none: 1
  }
};
