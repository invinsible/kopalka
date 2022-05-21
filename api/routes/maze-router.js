const Router = require('koa-router')
const MazeService = require('../services/maze-service')
const UserService = require("../services/user-service");

const router = new Router({prefix: '/maze'});
router.use(require('../middleware/auth-required'))

const userService = new UserService();

// Создаёт новый инстанс лабиринта
router.post('/start', async function (ctx) {
    const mazeService = new MazeService(userService);

    try {
        const id = await mazeService.start(ctx.state.user.data.id);
        ctx.body = {
            id
        };
    } catch (err) {
        ctx.throw(400, err.message)
    }
});

// Возвращает созданный инстанс лабиринта
router.get('/instance/:id', async function (ctx) {
    const mazeService = new MazeService(userService);

    const instance = await mazeService.getInstance(ctx.params.id);

    // Определяем положение пользователя
    const instanceUser = await mazeService.getUsersCurrentInstance(ctx.state.user.data.id);

    ctx.body = {
        maze: instance.dataParsed,
        currentPosition: {x: instanceUser.x, y: instanceUser.y},
        visited: instanceUser.visitedParsed,
        fogEnabled: true
    };
});

// Возвращает
router.get('/current', async function (ctx) {
    const mazeService = new MazeService(userService);

    const current = await mazeService.getUsersInstance(ctx.state.user.data.id);

    console.log(current);

    ctx.body = {
        id: !current ? null : current.maze_instance_id
    };
});

// Движение
router.post('/move', async function (ctx) {
    const mazeService = new MazeService(userService);
    const {body} = ctx.request;
    if (!body || !body.direction) {
        ctx.throw(400, 'Direction is needed');
    }

    const result = await mazeService.move(ctx.state.user.data.id, body.direction, false);

    ctx.body = {
        result: 'success',
        x: result.x,
        y: result.y
    }
});

// Выход из лаба
router.post('/exit', async function (ctx) {
    const mazeService = new MazeService(userService);

    const result = await mazeService.exit(ctx.state.user.data.id);
    console.log(result);

    ctx.body = {
        result: 'success'
    };
});


// Тестовое создание лабиринта. Только для админов.
router.get('/admin/generate', require("../middleware/admin-only"), async function (ctx) {
    const mazeService = new MazeService();

    let maze = mazeService.generate();

    // Определяем положение пользователя
    const currentPosition = mazeService.getStartingPosition(maze);

    ctx.body = {
        maze,
        currentPosition,
        visited: [],
        fogEnabled: false
    };
});

// Телепортация по лабу. Только для админов.
router.post('/admin/tp', require("../middleware/admin-only"), async function (ctx) {
    const mazeService = new MazeService(userService);

    const {body} = ctx.request;

    console.log(body.x, body.y)
    if (!body || body.x === undefined || body.y === undefined) {
        ctx.throw(400, 'Coords are needed');
    }

    const result = await mazeService.teleport(ctx.state.user.data.id, {x: body.x, y: body.y});

    ctx.body = {
        result: 'success',
        x: result.x,
        y: result.y
    }
});

module.exports = router.routes();
