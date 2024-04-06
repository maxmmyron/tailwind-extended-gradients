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
  },
  plugins: [plugin(function({addUtilities, matchUtilities, theme}) {
    matchUtilities({
      [`bg-gradient-to`]: (val) => {
        return {
          '--tw-color-interpolation-method': 'oklab',
          'background-image': `linear-gradient(${val} in var(--tw-color-interpolation-method), var(--tw-gradient-stops,))`,
        }
      },
    },
    {
      values: theme('gradientDirection'),
    });

    const rectSpaces = ["srgb", "srgb-linear", "lab", "oklab", "xyz"];
    const cylSpaces = ["hsl", "hwb", "lch", "oklch"];

    // Add classes for default rectangular and cylindrical spaces
    for (let space of [...rectSpaces, ...cylSpaces]) {
      // Gradients w/ rectangular color space interpolation
      addUtilities({
        [`.bg-interpolate-${space}`]: {
          '--tw-color-interpolation-method': space,
        },
      });
    }

    // Add classes for cylindrical spaces that specify the interpolation method
    for (let space of cylSpaces) {
      // with specified interpolation method
      const interpMethods = ["longer", "shorter", "increasing", "decreasing"];
      for(let interpMethod of interpMethods) {
        addUtilities({
          [`.bg-interpolate-${space}\\/${interpMethod}`]: {
            '--tw-color-interpolation-method': `${space} ${interpMethod} hue`,
          },
        });
      }
    }
    }
  )],
}

