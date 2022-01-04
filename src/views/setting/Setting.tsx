import { css } from '@emotion/react';
import { Box, BaseInput, BaseSelect, LinkButton, NavHeader } from '../../components';

export const Setting = () => {
  return (
    <Box
      css={css`
        padding-top: 56px;
      `}
    >
      <BaseSelect>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </BaseSelect>

      
      <BaseInput placeholder="large size" size="lg" />
    </Box>
  );
};
