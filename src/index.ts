import ora from "ora";
import webpack from "webpack";
import webpackHotMiddleware from "webpack-hot-middleware";
import WebpackDevServer from "webpack-dev-server";
import portUsed from "port-used";
import {webpackConfigs} from "./config";
import inquirer from "inquirer";
import {Logo} from "./sources";

/**
 * 开发环境启动
 */
export function start() {
    // Print Logo
    console.log(Logo);

    const spinner = ora("启动webpack... \n").start();

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
        spinner.succeed("启动完成");
    });

    compiler.hooks.failed.tap("USoftDevFailed", (error) => {
        spinner.fail("启动异常");
        console.error(error);
    });

    if (webpackConfigs.devServer) {
        spinner.succeed("Webpack已启动，即将启动Webpack dev server");
        // 启动服务
        serve(compiler, webpackConfigs.devServer);
    }
}


export async function serve(compiler: webpack.Compiler, devServer: WebpackDevServer.Configuration): Promise<void> {
    let port = devServer.port || 3000;
    const used = await portUsed.check(port, devServer.host)

    if (used) {
        // 端口被占用 获取新未使用端口
        const newPort = await getUnusedPort(port,devServer.host);

        // 询问是否使用新端口
        const {isUseNewPort} = await inquirer.prompt<{isUseNewPort: boolean}>({
            type: "confirm",
            name: "isUseNewPort",
            message:  `端口${port} 被占用，是否启用新端口:${newPort}？`,
            default: true,
        });

        // 如果不使用 终止执行
        if (!isUseNewPort) return;

        // 设置新端口
        port = devServer.port = newPort;
    }

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

    server.listen(port);
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

/**
 * 获取未使用端口号
 */
async function getUnusedPort(originPort: number, host?: string): Promise<number> {
    const newPort = originPort+1;
    const used = await portUsed.check(originPort+1, host);
    if (!used) return newPort;
    return await getUnusedPort(newPort, host);
}