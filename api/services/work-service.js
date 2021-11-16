const dayjs = require("dayjs");
const {v4} = require("uuid");
const {models} = require("../models");
const enums = require('../lib/enums')
const InventoryService = require("./inventory-service");

/**
 * Класс для работы с добычей
 */
class WorkService {
    constructor() {
        this.inventoryService = new InventoryService();
    }

    /**
     * @return {number}
     */
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

        // Определяем добычу
        const item = await this.getCycleResult(workCycle),
            itemQuantity = 1;

        await models.WorkCycle.update({
            state: enums.workCycle.states.FINISHED,
            item_id: item ? item.id : null,
            quantity: item ? itemQuantity : null
        }, {where: {id: workCycle.id}});

        // Зачисляем предмет
        if (item !== null) {
            await this.inventoryService.changeItemQuantity(workCycle.user_id, item, itemQuantity);
        }

        // @todo Начислить опыт добычи


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
     * Возвращает предыдущий завершённый цикл
     * @param userId
     * @return {Promise<*>}
     */
    async getPrevious(userId) {
        return await models.WorkCycle.findOne({
            where: {user_id: userId, state: enums.workCycle.states.FINISHED},
            order: [['time_end', 'DESC']],
            include: ['item']
        })
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
     * @param workCycle
     * @return {Promise<null|*>}
     */
    async getCycleResult(workCycle) {
        const items = await models.Item.findAll({where: {type: enums.item.types.RESOURCE}})

        const successRate = 0.4;
        if (Math.random() > successRate) {
            return null;
        }

        const options = items.map((item) => {
            return [item, item.rate];
        });

        return await this.weightedRandom(options);
    }

    /**
     * Возвращает случайный элемент, с учётом весов.
     * Внимание - вес не может быть меньше 0.1!
     * @param options
     * @return {Promise<*>}
     */
    async weightedRandom(options) {
        // Applying rejection sampling algo
        let table = [];
        options.forEach((option, index) => {
            for (let j = 0; j < option[1] * 10; j++) {
                table.push(index)
            }
        });

        return options[table[Math.floor(Math.random() * table.length)]][0]
    }
}

module.exports = WorkService;