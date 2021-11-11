const Router = require('koa-router');
const {models} = require("../models");

const router = new Router({prefix: '/work'});
router.use(require('../middleware/auth-required'))

router.get('/items', async function (ctx) {
    let result = [];

    const items = await models.Item.findAll();
    const inventory = await models.InventoryItem.findAll({where: {user_id: ctx.state.user.data.id}});

    items.forEach((item) => {
        let inventoryItem = inventory.find(i => i.item_id === item.id)

        result.push({
            id: item.id,
            name: item.name,
            rate: item.rate,
            quantity: inventoryItem ? inventoryItem.quantity : 0
        });
    })

    ctx.body = result;
});

module.exports = router.routes();