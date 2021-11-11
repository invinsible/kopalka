const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const {Sequelize, DataTypes} = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const koajwt = require('koa-jwt');
const errorHandlerMiddleware = require('.//middleware/error-handler.js')
const {v4} = require('uuid')

require('dotenv').config();

const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});


// Models
const User = sequelize.define('user', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING(36),
    }
}, {
    timestamps: false
});

const Token = sequelize.define('token', {
    token: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID
    },

}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});


// App
const app = new Koa();

async function main() {
    // Connecting to DB
    try {
        await sequelize.authenticate();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    // Creating router
    const router = new Router();

    // Basic healthcheck
    router.get('/healthcheck', (ctx) => {
        ctx.body = 'ok';
    });

    // Request new request token
    router.post('/auth/login', async function (ctx) {
        const {body} = ctx.request;

        const user = await User.findOne({
            where: {username: body.username}
        })

        if (user === null || false === (await bcrypt.compare(body.password, user.password))) {
            ctx.throw(400, 'Wrong username or password');
        }

        // Creating refresh token
        const refreshToken = await Token.create({token: v4(), user_id: user.id});

        ctx.body = {
            refreshToken: refreshToken.token,
        };
    });

    // Creates new access token
    router.post('/auth/refresh', async function (ctx) {
        const {body} = ctx.request;

        const refreshToken = await Token.findByPk(body.refresh_token);
        if (refreshToken === null) {
            ctx.throw(401, 'Refresh token not found')
        }

        const user = await User.findByPk(refreshToken.user_id);

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

    // Private endpoints
    router.use(koajwt({secret: process.env.JWT_HMAC}))

    // Enpoint with auth
    router.get('/debug/me', async function (ctx) {
        const user = await User.findByPk(ctx.state.user.data.id);

        ctx.body = {
            id: user.id,
            username: user.username
        }
    });


    // Starting app
    app.use(errorHandlerMiddleware)
    app.use(cors({origin: '*'}));
    app.use(bodyParser());
    app.use(router.routes());
    app.use(router.allowedMethods())
    app.listen(3000);
}

main().then(() => {
    console.log('App started')
});