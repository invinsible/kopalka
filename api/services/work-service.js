const dayjs = require("dayjs");
const {v4} = require("uuid");
const {models} = require("../models");

/**
 * Класс для работы с добычей
 */
class WorkService {
    getDuration() {
        return 3*60;
    }

    /**
     * Начать новый цикл
     * @param userId
     * @return {Promise<*>}
     */
    async start(userId) {
        const user = await models.User.findByPk(userId);
        if (user === null) {
            throw new Error('User not found')
        }

        if (user.state !== user.states.INACTIVE) {
            throw new Error('User is not inactive')
        }

        const newCycle = await models.WorkCycle.create({
            id: v4(),
            user_id: user.id,
            time_start: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            time_end: dayjs().add(this.getDuration(), 's').format('YYYY-MM-DD HH:mm:ss'),
        });

        await models.User.update({state: user.states.WORKING}, {where: {id: user.id}})

        return newCycle;
    }

    /**
     * Вернуть текущий цикл
     * @param userId
     * @return {Promise<*|null>}
     */
    async getCurrent(userId) {
        const user = await models.User.findByPk(userId);
        if (user === null) {
            throw new Error('User not found')
        }

        const cycle = await models.WorkCycle.findOne({
            where: {
                user_id: user.id,
                state: 1
            }
        })

        if (cycle === null) {
            return null;
        }

        return cycle;
    }
}

module.exports = WorkService;