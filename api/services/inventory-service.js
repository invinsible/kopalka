const {models} = require("../models");
const enums = require('../lib/enums')

class InventoryService {
    /**
     * Изменить количество предметов.
     * @param userId
     * @param item
     * @param diff
     */
    async changeItemQuantity(userId, item, diff) {
        const rowIdentifier = {user_id: userId, item_id: item.id},
            invItem = await models.InventoryItem.findOne({where: rowIdentifier}),
            qty = invItem ? invItem.quantity : 0,
            currentQty = qty + diff;

        if (currentQty < 0) {
            throw new Error('Not enough items in inventory')
        }

        if (invItem && currentQty === 0) {
            await models.InventoryItem.destroy({where: rowIdentifier});
            return true;
        }

        if (!invItem && currentQty > 0) {
            await models.InventoryItem.create({
                user_id: userId,
                item_id: item.id,
                quantity: currentQty
            });
            return true;
        }

        await models.InventoryItem.update({quantity: currentQty}, {where: rowIdentifier});
        return true;
    }

    async getItems(userId, type) {
        type = type ?? enums.inventory.types.MAIN

        return await models.InventoryItem.findAll({where: {user_id: userId, type: type}, include: models.Item})
    }
}

module.exports = InventoryService;
