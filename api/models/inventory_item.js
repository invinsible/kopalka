module.exports = function (sequelize, DataTypes) {
    return sequelize.define('inventory_item', {
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        item_id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        type: DataTypes.INTEGER.UNSIGNED,
        quantity: {
            type: DataTypes.INTEGER.UNSIGNED
        },
    }, {
        timestamps: false
    });
}
