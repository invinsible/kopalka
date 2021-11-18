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
    const mazeService = new MazeService();
    const {body} = ctx.request;
    if (!body || !body.direction) {
        ctx.throw(400, 'Direction is needed');
    }

    const result = await mazeService.move(ctx.state.user.data.id, body.direction);

    ctx.body = {
        result: 'success',
        x: result.x,
        y: result.y
    }
});

// Тестовое создание лабиринта
// @deprecated
router.get('/generate', async function (ctx) {
    const mazeService = new MazeService();

    let maze = mazeService.generate();

    // Определяем положение пользователя
    const currentPosition = mazeService.getCurrentPosition(maze);

    ctx.body = {
        maze,
        currentPosition,
        fogEnabled: true
    };
});

module.exports = router.routes();