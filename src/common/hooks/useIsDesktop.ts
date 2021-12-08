import { useMedia } from 'react-use';

export const useIsDesktop = () => {
  const below1080 = useMedia('(max-width: 1080px)');

  return !below1080;
};
