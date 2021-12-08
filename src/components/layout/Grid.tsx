import { Grid as CGrid } from '@chakra-ui/layout';
import styled from '@emotion/styled';

export const Grid = CGrid;

export const GridCenter = styled(CGrid)`
  align-items: center;
`;

GridCenter.defaultProps = {
  gap: '0px'
};
