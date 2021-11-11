const Router = require('koa-router')
const router = new Router()

router.get('/healthcheck', (ctx) => {
    ctx.body = 'ok'
});

module.exports = router.routes();