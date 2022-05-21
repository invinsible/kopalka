const Router = require('koa-router');
const api = new Router();

api.use(require('./auth-router'));
api.use(require('./debug-router'));
api.use(require('./healtchcheck-router'));
api.use(require('./inventory-router'));
api.use(require('./notifications-router'));
api.use(require('./work-router'));
api.use(require('./maze-router'));
api.use(require('./temp-router'));
api.use(require('./user-router'));

module.exports = api;
