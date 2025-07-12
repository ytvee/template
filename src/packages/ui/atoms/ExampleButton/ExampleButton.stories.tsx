import type { Meta, StoryObj } from '@storybook/vue3';
import ExampleButton from './ExampleButton.vue';

const meta: Meta<typeof ExampleButton> = {
  title: 'Atoms/ExampleButton',
  component: ExampleButton,
};

export default meta;

export const Basic: StoryObj<typeof ExampleButton> = {
  render: () => ({
    components: { ExampleButton },
    template: '<ExampleButton>Click me</ExampleButton>',
  }),
};
