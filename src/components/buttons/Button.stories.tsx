import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { MainButton } from './MainButton';

export default {
  title: 'components/Button',
  component: MainButton,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof MainButton>;

const Template: ComponentStory<typeof MainButton> = (args) => <MainButton {...args}>Button</MainButton>;

export const Default = Template.bind({});

Default.args = {};
