const Router = require('koa-router')
const {models} = require('../models')
const jwt = require('jsonwebtoken');
const {v4} = require("uuid");
const bcrypt = require('bcryptjs');

const router = new Router({prefix: '/auth'});

// Sign up
router.post('/signup', async function (ctx) {
    const {body} = ctx.request;

    if (!body.username || !body.password) {
        ctx.throw(400, 'Missing username or password')
    }

    const user = await models.User.findOne({
        where: {username: body.username}
    })

    if (user !== null) {
        ctx.throw(400, 'User already exists.')
    }

    const newUser = await models.User.create({
        id: v4(),
        username: body.username,
        password: await bcrypt.hash(body.password, 10)
    });

    ctx.status = 201;
    ctx.body = {
        id: newUser.id,
    };
});

// Request new request token
router.post('/login', async function (ctx) {
    const {body} = ctx.request;

    const user = await models.User.findOne({
        where: {username: body.username}
    })

    if (user === null || false === (await bcrypt.compare(body.password, user.password))) {
        ctx.throw(400, 'Wrong username or password');
    }

    // Creating refresh token
    const refreshToken = await models.Token.create({token: v4(), user_id: user.id});

    ctx.body = {
        refreshToken: refreshToken.token,
    };
});

// Creates new access token
router.post('/refresh', async function (ctx) {
    const {body} = ctx.request;

    const refreshToken = await models.Token.findByPk(body.refreshToken);
    if (refreshToken === null) {
        ctx.throw(401, 'Refresh token not found')
    }

    const user = await models.User.findByPk(refreshToken.user_id);

    const ACCESS_TOKEN_EXPIRES_IN = 10 * 60;
    const
        tokenExpiration = Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRES_IN,
        token = jwt.sign({
                exp: tokenExpiration,
                data: {
                    id: user.id,
                    refreshToken: refreshToken.token
                }
            }, process.env.JWT_HMAC,
            {algorithm: 'HS256'}
        );

    ctx.body = {
        accessToken: token,
        expiresIn: ACCESS_TOKEN_EXPIRES_IN
    };
});

module.exports = router.routes();