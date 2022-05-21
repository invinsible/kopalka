const Router = require('koa-router');
const {models} = require("../models");

const router = new Router({prefix: '/user'});
router.use(require('../middleware/auth-required'))

router.get('/me', async function (ctx) {
    const user = await models.User.findByPk(ctx.state.user.data.id);

    ctx.body = {
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin,
    }
});

module.exports = router.routes();
