module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        const { statusCode, message } = err;
        ctx.type = 'json';
        ctx.status = statusCode;
        ctx.body = {
            error: message
        };
    }
};