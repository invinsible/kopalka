module.exports = function(ctx, next) {
    if (!ctx.state.user) {
        ctx.throw(401, 'Authentication Error (auth-required)')
    }

    return next();
}