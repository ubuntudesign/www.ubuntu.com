let esbuild = require("esbuild");

let entries = {
  contributions: "./static/js/src/contributions.js",
  "desktop-statistics": "./static/js/src/desktop-statistics.js",
  tutorials: "./static/js/src/tutorials.js",
  forms: "./static/js/src/forms.js",
  "image-download": "./static/js/src/image-download.js",
  main: "./static/js/src/main.js",
  "release-chart": "./static/js/src/release-chart.js",
  tabotronic: "./static/js/src/tabotronic.js",
  appliance: "./static/js/src/appliance.js",
  "tco-calculator": "./static/js/src/tco-calculator.js",
  "ua-payment-modal": "./static/js/src/ua-payment-modal.js",
  "sticky-nav": "./static/js/src/sticky-nav.js",
  imageBuilder: "./static/js/src/imageBuilder.js",
  chassisAnimation: "./static/js/src/chassis-animation.js",
  cve: "./static/js/src/cve/cve.js",
  "ua-product-selector": "./static/js/src/ua-product-selector.js",
  "ua-entitlements-callout":
    "./static/js/src/advantage/entitlements-callout.js",
  "ua": "./static/js/src/advantage/ua.jsx",
};

for (const [key, value] of Object.entries(entries)) {
  const options = {
    entryPoints: [value],
    bundle: true,
    minify: true,
    sourcemap: true,
    outfile: "static/js/dist/" + key + ".js",
    target: ["chrome58", "firefox57", "safari11", "edge16"],
    define: {'process.env.NODE_ENV': '"production"'},
  };

  esbuild.build(options).then((result) => {
    console.log("Built " + key + ".js");
  });
}
