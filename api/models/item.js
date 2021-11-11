module.exports = function (sequelize, DataTypes) {
    return sequelize.define('item', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        rate: DataTypes.INTEGER.UNSIGNED
    }, {
        timestamps: false
    });
}