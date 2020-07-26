# usoft-fe/vue-cli

Chongqing ©USoft front-end vue-cli.

### Install
```shell
> npm i -g @usoft-fe/vue-cli
```

### Use
```shell
> usoft-vue create <app-name>
> cd <app-name>
> yarn start
# or
> npm start
```

### Configuration
Create `usoft.config.js` in your project root directory;

```js
module.exports = {
    less(config) {
        // update config object
        return config;
    },
    sass() {
        // update config object
        return config;
    },
    ts(config) {
        // update config object
        return [config];
    },
    // https://www.webpackjs.com/configuration/module/
    overwriteLoaders(loaders) {
        // update loaders object
        return loaders;
    },
    // https://www.webpackjs.com/configuration/plugins/
    overwritePlugins(plugins) {
        // update plugins object
        return plugins;
    },
    // https://www.webpackjs.com/configuration/dev-server/#devserver
    devServer: DevServerConfiguration,
    // https://www.webpackjs.com/configuration/
    webpack: WebpackConfiguration,
}
```