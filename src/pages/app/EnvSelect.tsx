import { SelectButton } from 'components/buttons';
import { FormControl, FormLabel } from 'components/form';
import { useEnv, useEnvModal } from 'state/application/hooks';

export const EnvSelect = () => {
  const [env] = useEnv();
  const [_, toggleEnv] = useEnvModal();

  return (
    <FormControl>
      <FormLabel>{'environment'}</FormLabel>
      <SelectButton onClick={() => toggleEnv()} variant={env ? 'selected' : undefined}>
        {env || 'Select an environment'}
      </SelectButton>
    </FormControl>
  );
};
