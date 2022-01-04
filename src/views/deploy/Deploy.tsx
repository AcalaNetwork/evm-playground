import { useTranslation } from 'next-i18next';
import { Box, LinkButton, NavHeader } from '../../components';

export const Deploy = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <NavHeader title={t('Deploy Contract')} />
    </Box>
  );
};
