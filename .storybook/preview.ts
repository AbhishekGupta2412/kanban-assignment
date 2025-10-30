import type { Preview } from "@storybook/react";
import '../src/styles/globals.css'; // <-- This imports your Tailwind styles

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
