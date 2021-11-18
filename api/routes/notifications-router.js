const Router = require('koa-router');
const {models} = require("../models");

const router = new Router({prefix: '/notifications'});
router.use(require('../middleware/auth-required'))

router.get('/', async function (ctx) {
    ctx.body = await models.InventoryItem.findAll({where: {user_id: ctx.state.user.data.id}})
});

module.exports = router.routes();
