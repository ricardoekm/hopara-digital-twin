import {DefaultThemeProvider} from "../src/storybook-theme";
import {CssBaseline} from '../src/theme/Theme'

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: {argTypesRegex: "^on[A-Z].*"},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <DefaultThemeProvider>
        <CssBaseline />
        <div style={{minHeight: '100vh'}}>
          <Story/>
        </div>
      </DefaultThemeProvider>
    ),
  ],
};

export default preview;



