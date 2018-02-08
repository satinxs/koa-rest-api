# koa-rest-api

Simple koa rest api module.
Probably not ready for production.

---

Usage: 

```javascript
    const Koa = require('koa');
    const Api = require('koa-rest-api');

    let app = new Koa();

    Api.create(app);

    app.listen();
```
