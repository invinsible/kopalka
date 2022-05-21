const UserService = require("../services/user-service");

module.exports = async function(ctx, next) {
    const isAdmin = await (new UserService()).userIsAdmin(ctx.state.user.data.id);

    if (!isAdmin) {
        ctx.throw(403, 'You need to be an admin to do this')
    }

    return next();
}
