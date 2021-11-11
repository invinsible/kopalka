const states = {
    INACTIVE: 0,
    WORKING: 1
};

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
            default: states.INACTIVE
        },
        states: {
            type: DataTypes.VIRTUAL,
            get() {
                return states;
            }
        }
    }, {
        timestamps: false
    });
}