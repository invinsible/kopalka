module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        const { statusCode, message } = err;
        ctx.type = 'json';
        ctx.status = statusCode || 500;
        ctx.body = {
            error: message
        };
    }
};