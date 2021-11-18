const Router = require('koa-router')
const MazeService = require('../services/maze-service')

const router = new Router({prefix: '/maze'});
router.use(require('../middleware/auth-required'))



// Тестовое создание лабиринта
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