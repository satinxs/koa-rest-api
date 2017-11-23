const Router = require('koa-router');
const compose = require('koa-compose');

class Controller {
    constructor(model, router) {
        this.Name = model.collection.name;
        this.Model = model;
        this.Router = router;

        this.allowCreate = true;
        this.allowDelete = true;
        this.allowReadAll = true;
        this.allowReadById = true;
        this.allowUpdate = true;
    }

    initialize() {
        if (this.allowReadById)
            this.register('get', '/:id', async ctx => ctx.body = await this.readById(ctx.params.id));

        if (this.allowReadAll)
            this.register('get', '/', async ctx => ctx.body = await this.readAll());

        if (this.allowCreate)
            this.register('post', '/', async ctx => ctx.body = await this.create(ctx.request.body));

        if (this.allowUpdate)
            this.register('put', '/:id', async ctx => ctx.body = await this.save(ctx.params.id, ctx.request.body));

        if (this.allowDelete)
            this.register('del', '/:id', async ctx => ctx.body = await this.delete(ctx.params.id));
    }

    async create(document) {
        return await this.Model.create(document);
    }

    async readById(id) {
        return await this.Model.findById(id);
    }

    async readAll() {
        return await this.Model.find({});
    }

    async save(id, document) {
        let savedDoc = await this.Model.findById(id);

        for (let field of Object.keys(document))
            savedDoc[field] = document[field];

        return await savedDoc.save();
    }

    async delete(_id) {
        return await this.Model.remove({
            _id
        });
    }

    register(method, route, action) {
        route = '/' + this.Name + route;
        this.Router[method](route, action);

        log('registered ' + method.toUpperCase() + ': ' + route);
    }
}

module.exports = Controller;