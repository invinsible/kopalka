module.exports = function (sequelize, DataTypes) {
    return sequelize.define('notification', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
        },
        force: {
            type: DataTypes.INTEGER
        },
        title: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING
        },
    }, {
        timestamps: false
    });
}
