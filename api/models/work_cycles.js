const {workCycle} = require('../lib/enums')

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('work_cycle', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        user_id: DataTypes.UUID,
        state: {
            type: DataTypes.INTEGER,
            default: workCycle.states.IN_PROGRESS
        },
        time_start: DataTypes.DATE,
        time_end: DataTypes.DATE,
        item_id: DataTypes.UUID,
        quantity: DataTypes.INTEGER
    }, {
        timestamps: false
    });
}