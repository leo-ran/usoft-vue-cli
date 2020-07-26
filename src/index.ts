import ora from "ora";
import webpack from "webpack";
import webpackHotMiddleware from "webpack-hot-middleware";
import WebpackDevServer from "webpack-dev-server";
import {webpackConfigs} from "./config";

import {Logo} from "./sources";

/**
 * 开发环境启动
 */
export function start() {
    // Print Logo
    console.log(Logo);

    const spinner = ora("Starting... \n").start();

    // Add hot reload
    const entry = webpackConfigs.entry;
    if (Array.isArray(entry)) {
        webpackConfigs.entry = [
            "webpack-hot-middleware/client?path=/__what&timeout=2000&overlay=false",
            ...entry,
        ];
    }

    // Create webpack compiler instance
    const compiler = webpack(webpackConfigs);

    compiler.hooks.afterEmit.tap("USoftDevDone", () => {
        spinner.succeed("started.");
    });

    compiler.hooks.failed.tap("USoftDevFailed", (error) => {
        spinner.fail("start fail.");
        console.error(error);
    });

    if (webpackConfigs.devServer) {
        // Create webpack dev server
        const server = new WebpackDevServer(compiler, {
            ...webpackConfigs.devServer,
            before (app) {
                app.use(webpackHotMiddleware(compiler,{
                    log: false,
                    path: "/__what",
                    heartbeat: 2000
                }));
            }
        });

        server.listen(webpackConfigs.devServer.port || 3000);
    }
}

/**
 * 编译
 */
export function build() {
    // Print Logo
    console.log(Logo);

    const spinner = ora("Build starting... \n").start();

    const compiler = webpack(webpackConfigs);
    compiler.run((err, stats) => {
        if (err && stats.hasErrors()) {
            console.log(stats.toString())
        }
    });

    compiler.hooks.afterEmit.tap("USoftBuildDone", () => {
        spinner.succeed("Build end");
    });
    compiler.hooks.failed.tap("USoftBuildFailed", (error) => {
        spinner.fail("Build fail");
        console.error(error);
    });
}