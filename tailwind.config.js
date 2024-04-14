const defaultTheme = require("tailwindcss/defaultTheme")
const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,svelte}"],
  theme: {
    gradientDirection: ({ theme }) => ({
      t: "to top",
      tr: "to top right",
      r: "to right",
      br: "to bottom right",
      b: "to bottom",
      bl: "to bottom left",
      l: "to left",
      tl: "to top left",
      ...theme("rotate"),
    }),
    backgroundImage: {
      none: "none",
    },
    gradientPosition: {
      center: "center",
      left: "left",
      right: "right",
      top: "top",
      bottom: "bottom",
      "1/2": "50%",
      "1/3": "33.333333%",
      "2/3": "66.666667%",
      "1/4": "25%",
      "2/4": "50%",
      "3/4": "75%",
      "1/5": "20%",
      "2/5": "40%",
      "3/5": "60%",
      "4/5": "80%",
      "1/6": "16.666667%",
      "2/6": "33.333333%",
      "3/6": "50%",
      "4/6": "66.666667%",
      "5/6": "83.333333%",
      "1/12": "8.333333%",
      "2/12": "16.666667%",
      "3/12": "25%",
      "4/12": "33.333333%",
      "5/12": "41.666667%",
      "6/12": "50%",
      "7/12": "58.333333%",
      "8/12": "66.666667%",
      "9/12": "75%",
      "10/12": "83.333333%",
      "11/12": "91.66667%",
      "full": "100%"
    },

    /*
     * FIXME: we can't override this because <angle> is not a supported type
     * in matchUtilities... why???????? it's available internally, but
     * isn't exposed to the plugin API :(
     */
    // extend: {
    //   gradientColorStopPositions: ({ theme }) => ({
    //     ...theme("rotate"),
    //   }),
    // },
  },
  corePlugins: {
    backgroundImage: false,
  },
  plugins: [
    plugin(function ({ addUtilities, matchUtilities, theme }) {
      // --------------------------------
      // Reimplement disabled core plugins

      // reimplement backgroundImage core plugin
      matchUtilities(
        {
          "bg": (val) => {
            return {
              "background-image": val,
            }
          }
        },
        {
          values: theme("backgroundImage"),
          type: ["image", "url"],
        }
      );

      // add dynamic utilities for angle-based gradient directions (this essentially overrides existing tailwind bg-gradient-to-* utilities)
      matchUtilities(
        {
          "bg-gradient-to": (val) => {
            return {
              "background-image": `linear-gradient(${val} var(--tw-color-interpolation-method, ), var(--tw-gradient-stops,))`,
            }
          },
        },
        {
          values: theme("gradientDirection"),
        }
      );

      // add static utilities for radial and conic gradients
      addUtilities(
        {
          ".bg-gradient-radial": {
            "--tw-gradient-x-position": "center",
            "--tw-gradient-y-position": "center",
            "background-image": "radial-gradient(at var(--tw-gradient-x-position) var(--tw-gradient-y-position) var(--tw-color-interpolation-method, ), var(--tw-gradient-stops))"
          },
          ".bg-gradient-conic": {
            "--tw-gradient-x-position": "center",
            "--tw-gradient-y-position": "center",
            "background-image": "conic-gradient(at var(--tw-gradient-x-position) var(--tw-gradient-y-position) var(--tw-color-interpolation-method, ), var(--tw-gradient-stops))"
          }
        }
      );

      matchUtilities(
        {
          "bg-gradient-pos": (val) => {
            console.log(val)
            const splitIdx = val.indexOf(" ");
            console.log(splitIdx)

            let x = val;
            let y = val;
            if (splitIdx > -1) {
              x = val.substring(0, splitIdx);
              y = val.substring(splitIdx + 1);
            }

            return {
              "--tw-gradient-x-position": x,
              "--tw-gradient-y-position": y,
            }
          },
          "bg-gradient-pos-x": (val) => {
            return {
              "--tw-gradient-x-position": val,
            }
          },
          "bg-gradient-pos-y": (val) => {
            return {
              "--tw-gradient-y-position": val,
            }
          },
        },
        {
          values: theme("gradientPosition"),
          type: ["percentage", "length", "position"],
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
              "--tw-color-interpolation-method": `in ${space}`,
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
                "--tw-color-interpolation-method": `in ${space} ${interpMethod} hue`,
              },
            }
          });
        }
      }
    })
  ],
}

