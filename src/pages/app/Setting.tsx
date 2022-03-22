import styled from '@emotion/styled/macro';
import { FormControl, FormLabel } from 'components/form';
import { BaseInput } from 'components/inputs';
import { Box } from 'components/layout';
import { selectedAccountSelector } from 'state/account/selectors';
import { useAppSelector } from 'state/hooks';
import { AccountSelect } from './AccountSelect';
import { EnvSelect } from './EnvSelect';

const Container = styled(Box)`
  ${FormControl} {
    margin-top: 20px;
  }
`;

export const Setting = () => {
  const acc = useAppSelector(selectedAccountSelector);

  return (
    <Container>
      <EnvSelect />
      <AccountSelect />
      <FormControl>
        <FormLabel>{'gas limit'}</FormLabel>
        <BaseInput placeholder="custom endpoint" />
      </FormControl>
      <FormControl>
        <FormLabel>{'storage limit'}</FormLabel>
        <BaseInput placeholder="storage limit" />
      </FormControl>
      <FormControl>
        <FormLabel>{'value'}</FormLabel>
        <BaseInput placeholder="value" />
      </FormControl>
    </Container>
  );
};
