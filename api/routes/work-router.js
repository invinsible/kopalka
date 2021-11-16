const Router = require('koa-router');
const {models} = require("../models");
const WorkService = require('../services/work-service')
const dayjs = require("dayjs");

const router = new Router({prefix: '/work'});
router.use(require('../middleware/auth-required'))

const workService = new WorkService();


// Список вариантов добычи и кол-ва предметов у пользователя
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

// Начало работы
router.post('/start', async function (ctx) {
    try {
        const newCycle = await workService.start(ctx.state.user.data.id);

        ctx.body = {
            cycle: {
                id: newCycle.id,
                timeStart: dayjs(newCycle.time_start).valueOf(),
                timeEnd: dayjs(newCycle.time_end).valueOf(),
            }
        }

    } catch (err) {
        ctx.throw(400, err.message)
    }
});

// Вернуть статус
router.get('/status', async function (ctx) {
    let currentCycle = await workService.getCurrent(ctx.state.user.data.id);

    // Проверяем, не закончен ли цикл
    if (currentCycle !== null && workService.hasEnded(currentCycle)) {
        await workService.end(currentCycle);
        currentCycle = null;
    }

    const previousCycle = await workService.getPrevious(ctx.state.user.data.id),
        previous = {
            timeEnd: dayjs(previousCycle.time_end).valueOf(),
            itemName: previousCycle.item ? previousCycle.item.name : null,
            quantity: previousCycle.quantity
        };

    if (currentCycle === null) {
        ctx.body = {
            cycle: null,
            previous
        };
        return;
    }

    ctx.body = {
        cycle: {
            id: currentCycle.id,
            timeStart: dayjs(currentCycle.time_start).valueOf(),
            timeEnd: dayjs(currentCycle.time_end).valueOf(),
        },
        previous
    };
});


module.exports = router.routes();