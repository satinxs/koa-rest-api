const
    Router = require('koa-router'),
    compose = require('koa-compose'),
    Controller = require('./Controller');

class ManagerController extends Controller {
    constructor(model, router) {
        super(model.collection.name, router);

        // this.Name = model.collection.name;
        this.Model = model;
        // this.Router = router;

        this.allowCreate = true;
        this.allowDelete = true;
        this.allowReadAll = true;
        this.allowReadById = true;
        this.allowUpdate = true;
    }

    initialize() {
        if (this.allowReadById)
            this.register('get', '/:id', async ctx => ctx.body = await this.readById(ctx, ctx.params.id));

        if (this.allowReadAll)
            this.register('get', '/', async ctx => ctx.body = await this.readAll(ctx));

        if (this.allowCreate)
            this.register('post', '/', async ctx => ctx.body = await this.create(ctx, ctx.request.body));

        if (this.allowUpdate)
            this.register('put', '/:id', async ctx => ctx.body = await this.save(ctx, ctx.params.id, ctx.request.body));

        if (this.allowDelete)
            this.register('del', '/:id', async ctx => ctx.body = await this.delete(ctx, ctx.params.id));
    }

    async create(ctx, document) {
        try {
            return this.Model.create(document);
        } catch (error) {
            ctx.throw(error);
        }
    }

    async readById(ctx, id) {
        try {

            let result = await this.Model.findById(id);

            if (result == null)
                ctx.throw(404);

        } catch (error) {
            ctx.throw(error);
        }
    }

    async readAll(ctx) {
        try {
            return await this.Model.find({});
        } catch (error) {
            ctx.throw(error);
        }
    }

    async save(ctx, id, document) {
        try {
            let savedDoc = await this.Model.findById(id);

            for (let field of Object.keys(document))
                savedDoc[field] = document[field];

            return await savedDoc.save();

        } catch (error) {
            ctx.throw(error);
        }
    }

    async delete(ctx, _id) {
        try {
            return await this.Model.remove({ _id });
        } catch (error) {
            ctx.throw(error);
        }
    }
}

module.exports = ManagerController;