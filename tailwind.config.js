const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,svelte}"],
  theme: {
    gradientDirection: ({ theme }) => ({
      t: 'to top',
      tr: 'to top right',
      r: 'to right',
      br: 'to bottom right',
      b: 'to bottom',
      bl: 'to bottom left',
      l: 'to left',
      tl: 'to top left',
      ...theme('rotate'),
    }),
    backgroundImage: {
      none: "none",
    },
  },
  corePlugins: {
    backgroundImage: false,

  },
  plugins: [
    plugin(function ({ addUtilities, matchUtilities, theme }) {
      // Because we disabled the backgroundImage core plugin, we need to re-implement background image utilities
      matchUtilities(
        {
          [`bg`]: (val) => {
            return {
              'background-image': val,
            }
          }
        },
        {
          values: theme('backgroundImage'),
          type: ["url", "image"],
        }
      );

      // add utilities for gradient directions (this essentially overrides existing tailwind bg-gradient-to-* utilities)
      matchUtilities(
        {
          [`bg-gradient-to`]: (val) => {
            return {
              'background-image': `linear-gradient(${val} var(--tw-color-interpolation-method, ), var(--tw-gradient-stops,))`,
            }
          },
        },
        {
          values: theme('gradientDirection'),
        }
      );

      const rectangularSpaces = ["srgb", "srgb-linear", "lab", "oklab", "xyz"];
      const polarSpaces = ["hsl", "hwb", "lch", "oklch"];

      // Add classes for default rectangular and cylindrical spaces
      for (const space of [...rectangularSpaces, ...polarSpaces]) {
        // Gradients w/ rectangular color space interpolation
        addUtilities({
          [`@supports (background-image: linear-gradient(in ${space}, red, red))`]: {
            [`.bg-interpolate-${space}`]: {
              '--tw-color-interpolation-method': `in ${space}`,
            },
          }
        });
      }

      // Add classes for cylindrical spaces that specify the interpolation method
      for (const space of polarSpaces) {
        // with specified interpolation method
        const hueInterpMethod = ["longer", "shorter", "increasing", "decreasing"];
        for (const interpMethod of hueInterpMethod) {
          addUtilities({
            [`@supports (background-image: linear-gradient(in ${space}, red, red))`]: {
              [`.bg-interpolate-${space}\\/${interpMethod}`]: {
                '--tw-color-interpolation-method': `in ${space} ${interpMethod} hue`,
              },
            }
          });
        }
      }
    })
  ],
}

