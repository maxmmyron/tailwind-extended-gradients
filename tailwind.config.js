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
      "5%": "5%",
      "10%": "10%",
      "15%": "15%",
      "20%": "20%",
      "25%": "25%",
      "30%": "30%",
      "35%": "35%",
      "40%": "40%",
      "45%": "45%",
      "50%": "50%",
      "55%": "55%",
      "60%": "60%",
      "65%": "65%",
      "70%": "70%",
      "75%": "75%",
      "80%": "80%",
      "85%": "85%",
      "90%": "90%",
      "95%": "95%",
      "100%": "100%",
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
            "background-image": "radial-gradient(at var(--tw-gradient-x-position) var(--tw-gradient-x-position) var(--tw-color-interpolation-method, ), var(--tw-gradient-stops))"
          },
          ".bg-gradient-conic": {
            "--tw-gradient-x-position": "center",
            "--tw-gradient-y-position": "center",
            "background-image": "conic-gradient(at var(--tw-gradient-x-position) var(--tw-gradient-x-position) var(--tw-color-interpolation-method, ), var(--tw-gradient-stops))"
          }
        }
      );

      matchUtilities(
        {
          "bg-gradient-pos": (val) => {
            return {
              "--tw-gradient-x-position": val,
              "--tw-gradient-y-position": val,
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

