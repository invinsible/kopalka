const dayjs = require("dayjs");
const {v4} = require("uuid");
const {models} = require("../models");
const enums = require('../lib/enums')

/**
 * Класс для работы с добычей
 */
class WorkService {
    getDuration() {
        // return 3 * 60; @todo
        return 10;
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

        const currentCycle = await this.getCurrent(userId);

        if (currentCycle !== null || user.state !== enums.user.states.INACTIVE) {
            throw new Error('User is not inactive')
        }

        const newCycle = await models.WorkCycle.create({
            id: v4(),
            user_id: user.id,
            time_start: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            time_end: dayjs().add(this.getDuration(), 's').format('YYYY-MM-DD HH:mm:ss'),
        });

        await models.User.update({state: enums.user.states.WORKING}, {where: {id: user.id}})

        return newCycle;
    }

    /**
     * Корректное завершение цикла
     * @return {Promise<void>}
     */
    async end(workCycle) {
        if (workCycle.state !== 1) {
            throw new Error('Work cycle is not in progress');
        }

        // @todo определять приз

        await models.WorkCycle.update(
            {
                state: enums.workCycle.states.FINISHED,
            },
            {
                where: {id: workCycle.id}
            }
        );

        await models.User.update({state: enums.user.states.INACTIVE}, {where: {id: workCycle.user_id}});
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

    /**
     * Возвращает true, если цикл должен быть завершён
     * @param workCycle
     * @return boolean
     */
    hasEnded(workCycle) {
        if ((new Date).getTime() < dayjs(workCycle.time_end).valueOf()) {
            return false;
        }

        return workCycle.state === enums.workCycle.states.IN_PROGRESS;
    }

    /**
     * Возвращает сгенерированный результат копки
     * @return {Promise<void>}
     */
    async getCycleResult(workCycle) {

    }
}

module.exports = WorkService;