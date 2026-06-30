import { defineConfig, type UserConfigExport } from "@tarojs/cli";
import devConfig from "./dev";
import prodConfig from "./prod";

export default defineConfig<"webpack5">(async (merge) => {
  const baseConfig: UserConfigExport<"webpack5"> = {
    projectName: "putige-miniprogram",
    date: "2026-6-29",
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: "src",
    outputRoot: "dist",
    plugins: [],
    defineConstants: {},
    copy: { patterns: [], options: {} },
    framework: "react",
    compiler: "webpack5",
    mini: {
      postcss: {
        pxtransform: { enable: true, config: {} },
      },
    },
    h5: {
      publicPath: "/",
      staticDirectory: "static",
    },
  };

  if (process.env.NODE_ENV === "development") {
    return merge({}, baseConfig, devConfig);
  }
  return merge({}, baseConfig, prodConfig);
});
