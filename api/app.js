require('dotenv').config();

const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const koajwt = require('koa-jwt');
const errorHandlerMiddleware = require('./middleware/error-handler.js')

const routes = require('./routes')
const {sequelize} = require('./models')


// App
const app = new Koa();

async function main() {
    // Connecting to DB
    try {
        await sequelize.authenticate();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    // Starting app
    app.use(koajwt({secret: process.env.JWT_HMAC, passthrough: true}));
    app.use(errorHandlerMiddleware)
    app.use(cors({origin: '*'}));
    app.use(bodyParser());

    app.use(routes.routes())
    app.use(routes.allowedMethods());

    app.listen(3000);
}

main().then(() => {
    console.log('App started')
});