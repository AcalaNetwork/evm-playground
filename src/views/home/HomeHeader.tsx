import { useTranslation } from 'next-i18next';
import { LinkButton, NavHeader } from '../../components';

export const HomeHeader = () => {
  const { t } = useTranslation();

  return (
    <NavHeader title={t('Contracts')}>
      <LinkButton href="/deploy">Deploy Contract</LinkButton>
      <LinkButton href="/load">Load Contract</LinkButton>
    </NavHeader>
  );
};
