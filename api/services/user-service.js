const {models} = require("../models");
const enums = require('../lib/enums')

class UserService {
    /**
     * Находит пользователя по айди и возвращает его, если он существует и неактивен.
     * @param userId
     * @return {Promise<*>}
     */
    async findInactive(userId) {
        const user = await models.User.findByPk(userId);
        if (user === null) {
            throw new Error('User not found')
        }

        if (user.state !== enums.user.states.INACTIVE) {
            throw new Error('User is not inactive')
        }

        return user;
    }
}

module.exports = UserService;