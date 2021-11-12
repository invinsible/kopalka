const {user} = require('../lib/enums')

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING(36),
        },
        state: {
            type: DataTypes.INTEGER,
            default: user.states.INACTIVE
        },
        work_exp: DataTypes.INTEGER
    }, {
        timestamps: false
    });
}