const Router = require('koa-router');

const router = new Router({prefix: '/temp'});

router.get('/posts', async function (ctx) {
    ctx.body = {
        posts: [
            {id: 1, title: "Первый пост"},
            {id: 2, title: "Второй пост"},
            {id: 3, title: "Третий пост"},
            {id: 4, title: "Четвёртый пост"},
            {id: 5, title: "Пятый пост"},
        ]
    }
});

module.exports = router.routes();
