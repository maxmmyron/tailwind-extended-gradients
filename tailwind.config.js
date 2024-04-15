const defaultTheme = require("tailwindcss/defaultTheme")
const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,svelte}"],
  theme: {
    backgroundImage: {
      none: "none",
    },
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
    gradientPosition: ({ theme }) => ({
      ...theme("percentage"),
    }),
    percentage: {
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
    radialGradientSize: {
      "closest-side": "closest-side",
      "farthest-side": "farthest-side",
      "closest-corner": "closest-corner",
      "farthest-corner": "farthest-corner",
    }

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
            "--tw-radial-shape": "ellipse",
            "--tw-radial-size": "farthest-corner",
            "background-image": "radial-gradient(var(--tw-radial-shape) var(--tw-radial-size) at var(--tw-gradient-x-position) var(--tw-gradient-y-position) var(--tw-color-interpolation-method, ), var(--tw-gradient-stops))"
          },
          ".bg-gradient-conic": {
            "--tw-gradient-x-position": "center",
            "--tw-gradient-y-position": "center",
            "--tw-conic-angle": "0deg",
            "background-image": "conic-gradient(from var(--tw-conic-angle) at var(--tw-gradient-x-position) var(--tw-gradient-y-position) var(--tw-color-interpolation-method, ), var(--tw-gradient-stops))"
          }
        }
      );

      // -------------------------------------------
      // radial-gradient/conic-gradient center position

      // CASE 1: two-component syntax
      const corners = [
        ["t", "center top"],
        ["tr", "right top"],
        ["r", "right center"],
        ["br", "right bottom"],
        ["b", "center bottom"],
        ["bl", "left bottom"],
        ["l", "left center"],
        ["tl", "left top"]
      ];

      for (const [shorthand, value] of corners) {
        addUtilities({
          [`.bg-gradient-pos-${shorthand}`]: {
            "--tw-gradient-x-position": value.split(" ")[0],
            "--tw-gradient-y-position": value.split(" ")[1],
          }
        });
      }

      matchUtilities(
        {
          "bg-gradient-pos": (val) => {
            const splitIdx = val.indexOf(" ");

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
        },
        {
          type: "any",
          values: theme("gradientPosition"),
        }
      );

      // CASE 1: one-component syntax: X directions
      const xEdges = [["l", "left"], ["r", "right"]];

      for (const [shorthand, value] of xEdges) {
        addUtilities({
          [`.bg-gradient-pos-x-${shorthand}`]: {
            "--tw-gradient-x-position": value
          }
        });
      }

      matchUtilities(
        {
          "bg-gradient-pos-x": (val) => {
            return {
              "--tw-gradient-x-position": val,
            }
          },
        },
        {
          type: "any",
          values: theme("gradientPosition"),
        }
      );

      // CASE 3: one-component: syntax: Y directions

      const yEdges = [["t", "top"], ["b", "bottom"]];

      for (const [shorthand, value] of yEdges) {
        addUtilities({
          [`.bg-gradient-pos-y-${shorthand}`]: {
            "--tw-gradient-y-position": value
          }
        });
      }

      matchUtilities(
        {
          "bg-gradient-pos-y": (val) => {
            return {
              "--tw-gradient-y-position": val,
            }
          },
        },
        {
          type: "any",
          values: theme("gradientPosition"),
        }
      );

      // radial-gradient <radial-shape>
      addUtilities(
        {
          ".radial-grad-circle": {
            "--tw-radial-shape": "circle",
          },
          ".radial-grad-ellipse": {
            "--tw-radial-shape": "ellipse",
          }
        }
      );

      // radial-gradient <radial-size>
      matchUtilities(
        {
          "radial-grad-extent": (val) => {
            return {
              "--tw-radial-size": val,
            }
          }
        },
        {
          values: theme("radialGradientSize"),
        }
      );

      // conic-gradient angle
      matchUtilities(
        {
          "conic-grad-angle": (val) => {
            return {
              "--tw-conic-angle": val,
            }
          }
        },
        {
          values: theme("rotate"),
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

