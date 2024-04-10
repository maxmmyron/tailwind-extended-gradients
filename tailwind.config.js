const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,svelte}"],
  theme: {
    gradientDirection: {
      t: 'to top',
      tr: 'to top right',
      r: 'to right',
      br: 'to bottom right',
      b: 'to bottom',
      bl: 'to bottom left',
      l: 'to left',
      tl: 'to top left',
      15: '15deg',
      30: '30deg',
      45: '45deg',
      60: '60deg',
      75: '75deg',
      90: '90deg',
      105: '105deg',
      120: '120deg',
      135: '135deg',
      150: '150deg',
      165: '165deg',
      180: '180deg',
      195: '195deg',
      210: '210deg',
      225: '225deg',
      240: '240deg',
      255: '255deg',
      270: '270deg',
      285: '285deg',
      300: '300deg',
      315: '315deg',
      330: '330deg',
      345: '345deg',
    },
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
        addUtilities(
          {
            [`.bg-interpolate-${space}`]: {
              '--tw-color-interpolation-method': `in ${space}`,
            },
            // firefox specific: disable interpolation
            [`@supports (-moz-appearance:none)`]: {
              [`.bg-interpolate-${space}`]: {
                '--tw-color-interpolation-method': "",
              },
            },
          }
        );
      }

      // Add classes for cylindrical spaces that specify the interpolation method
      for (const space of polarSpaces) {
        // with specified interpolation method
        const hueInterpMethod = ["longer", "shorter", "increasing", "decreasing"];
        for (const interpMethod of hueInterpMethod) {
          addUtilities(
            {
              [`.bg-interpolate-${space}\\/${interpMethod}`]: {
                '--tw-color-interpolation-method': `in ${space} ${interpMethod} hue`,
              },
              // firefox specific: disable interpolation
              [`@supports (-moz-appearance:none)`]: {
                [`.bg-interpolate-${space}\\/${interpMethod}`]: {
                  '--tw-color-interpolation-method': "",
                },
              },
            }
          );
        }
      }
    }
    )
  ],
}

