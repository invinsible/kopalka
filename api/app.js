const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const {Sequelize, DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

    // Request new token
    router.post('/auth/login', async function (ctx) {
        const {body} = ctx.request;

        const user = await User.findOne({
            where: {username: body.username}
        })

        if (user === null || false === (await bcrypt.compare(body.password, user.password))) {
            ctx.throw(400, 'Wrong username or password');
        }

        const
            tokenExpiration = Math.floor(Date.now() / 1000) + (60 * 60),
            token = jwt.sign({
                exp: tokenExpiration,
                data: {
                    id: user.id
                }
            }, process.env.JWT_HMAC,
            {algorithm: 'HS256'}
        );

        ctx.body = {
            accessToken: token,
            expiresAt: tokenExpiration
        };
    });


    // Starting app
    app.use(cors({origin: '*'}));
    app.use(bodyParser());
    app.use(router.routes());
    app.use(router.allowedMethods())
    app.listen(3000);
}

main().then(() => {
    console.log('App started')
});