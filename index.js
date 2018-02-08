const
    path = require('path'),
    fs = require('fs'),
    { promisify } = require('util'),
    Router = require('koa-router'),
    Koa = require('koa'),
    mount = require('koa-mount'),
    Controller = require('./Controller'),
    ManagerController = require('./ManagerController');

function checkConfiguration(config) {
    config = config || {};

    config.controllersRoute = config.controllersRoute || "./controllers";

    config.appName = config.appName || "App";

    config.apiRoute = config.apiRoute || "/api";

    return config;
}

function handleError() {
    return async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                code: err.code || ctx.status,
                message: err.message
            };
        }
    }
}

async function create(app, config) {
    const log = require('debug')(config.appName + ':api');

    config = checkConfiguration(config);

    try {
        let api = new Koa(),
            router = new Router();

        let directory = await promisify(fs.readdir)(config.controllersRoute);

        for (let file of directory) {
            let controllerPath = path.join(config.controllersRoute, file),
                controller = new (require(controllerPath))(router, log);

            controller.initialize();
        }

        app.use(handleError());
        api.use(router.routes());
        api.use(router.allowedMethods());
        app.use(mount(config.apiRoute, api));

        log('Initialized API');
    } catch (error) {
        log(error);
    }
}

module.exports = { create, Controller, ManagerController };