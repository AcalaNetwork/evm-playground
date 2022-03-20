import { Link, LinkProps } from '../link';
import { MainButton } from './MainButton';

export const LinkButton = ({ children, ...props }: LinkProps) => {
  return (
    <Link {...props}>
      <MainButton>{children}</MainButton>
    </Link>
  );
};
