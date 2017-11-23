const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const Router = require('koa-router'),
    Koa = require('koa'),
    Controller = require('./Controller');

function create(controllersRoute) {
    let api = new Koa(),
        router = new Router();

    let directory = await promisify(fs.readdir)(controllersRoute);

    for (let file of directory) {
        let controllerPath = path.join(controllersRoute + file),
            controller = new (require(controllerPath))(router);

        controller.initialize();
    }

    api.use(router.routes());
    api.use(router.allowedMethods());
}

create.Controller = Controller;

module.exports = create;
