import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Contract } from './Contract';

export default {
  title: 'components/Contract',
  component: Contract,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof Contract>;

//@ts-ignore
const Template: ComponentStory<typeof Contract> = (args) => <Contract {...args} />;

export const Default = Template.bind({});

Default.args = {};
