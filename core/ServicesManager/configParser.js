const {
    checkMethod
} = require("./supportedMethod");
const chalk = require("chalk");



function prepareMethod(data, method, funcPath) {
    if (method == null) return;
    if (typeof method == "string") {
        var standardMethod = method.toUpperCase();
        checkMethod(standardMethod, funcPath);
        data.method = [standardMethod];
    } else if (method instanceof Array) {
        method.forEach((curMethod) => {
            curMethod = curMethod.toUpperCase();
            checkMethod(curMethod, funcPath);
            data.method.push(curMethod.toUpperCase());
        });
    } else {
        throw new TypeError(
            `Method "${method}" in "${funcPath}" isn"t string or array`
        );
    }
}

function inheritFromGeneralConfig(data, generalConfig, methodPath) {
    if (generalConfig == null) return;
    if (data.method.length == 0) {
        if (generalConfig.method == null) {
            data.method = ["GET"];
        } else {
            prepareMethod(data, generalConfig.method, methodPath);
        }
    }
    if (generalConfig.frontware != null) {
        data.frontware = data.frontware.concat(generalConfig.frontware);
    }
    if (generalConfig.backware != null) {
        data.backware = data.backware.concat(generalConfig.backware);
    }
    if (generalConfig.plugins != null) {
        data.backware = data.plugins.concat(generalConfig.plugins);
    }

    data.path = generalConfig.path;
    data.params = generalConfig.params;
}

function loadFromRouteConfig(data, routeConfig, methodPath) {
    if (typeof routeConfig == "string" ||
        routeConfig instanceof Array) {
        routeConfig = {
            method: routeConfig
        };
    }
    if (routeConfig.constructor.name !== "Object") {
        return;
    }
    prepareMethod(data, routeConfig.method, methodPath);

    if (routeConfig.frontware != null) {
        data.frontware = data.frontware.concat(routeConfig.frontware);
    }
    if (routeConfig.backware != null) {
        data.backware = data.backware.concat(routeConfig.backware);
    }
    if (routeConfig.plugins != null) {
        data.frontware = data.frontware.concat(routeConfig.plugins);
        data.backware = data.backware.concat(routeConfig.plugins);
    }

    if(routeConfig.path!== undefined){
        data.path = routeConfig.path;
    }
    if(routeConfig.handle!== undefined){
        data.handle = routeConfig.handle;
    }
    if(routeConfig.params!== undefined){
        data.params = routeConfig.params;
    }
}

function prepareConfigModel(methodPath, routeConfig, generalConfig) {
    if (typeof routeConfig !== "string" &&
        !routeConfig instanceof Array &&
        routeConfig.constructor.name !== "Object") {
        console.warn(chalk.yellow(
            `[warning] Don't support for config type at '${methodPath}'`
        ));
    }

    var config = {
        method: [],
        frontware: [],
        backware: [],
        plugins: [],
        handle: undefined,
        path: undefined,
        params: undefined
    };

    inheritFromGeneralConfig(config, generalConfig, methodPath);
    loadFromRouteConfig(config, routeConfig, methodPath);

    return config;
}

module.exports = prepareConfigModel;