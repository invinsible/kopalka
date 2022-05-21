const Router = require('koa-router');
const InventoryService = require("../services/inventory-service");
const enums = require("../lib/enums");

const router = new Router({prefix: '/inventory'});
router.use(require('../middleware/auth-required'))

router.get('/', async function (ctx) {
    const inventoryService = new InventoryService()

    ctx.body = await inventoryService.getItems(ctx.state.user.data.id, enums.inventory.types.MAIN)
});

router.get('/maze', async function (ctx) {
    const inventoryService = new InventoryService()

    ctx.body = await inventoryService.getItems(ctx.state.user.data.id, enums.inventory.types.MAZE)
});

module.exports = router.routes();
