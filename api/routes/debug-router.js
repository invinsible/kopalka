const Router = require('koa-router');
const {models} = require("../models");

const router = new Router({prefix: '/debug'});
router.use(require('../middleware/auth-required'))

router.get('/me', async function (ctx) {
    const user = await models.User.findByPk(ctx.state.user.data.id);

    ctx.body = {
        id: user.id,
        username: user.username
    }
});

module.exports = router.routes();