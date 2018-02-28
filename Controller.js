const
    Router = require('koa-router'),
    compose = require('koa-compose');

class Controller {
    constructor(name, router, log) {
        this.log = log;
        this.Name = name;
        this.Router = router;

        this.log('Initializing ' + this.Name + ' controller');
    }

    register(method, route, action) {
        route = '/' + this.Name + route;
        this.Router[method](route, action);

        this.log('registered ' + method.toUpperCase() + ': ' + route);
    }
}

module.exports = Controller;