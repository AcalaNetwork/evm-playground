import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Link } from './Link';

export default {
  title: 'components/Link',
  component: Link,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof Link>;

const Template: ComponentStory<typeof Link> = (args) => <Link {...args}>link</Link>;

export const Default = Template.bind({});

Default.args = {
  href: '/',
  isExternal: false
};
