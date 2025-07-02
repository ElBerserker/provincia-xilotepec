import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-LLL7D8D6KW'); 
};

export const trackPageView = (path) => {
  ReactGA.send({ 
    hitType: 'pageview', 
    page: path 
  });
};