module.exports = function (sequelize, DataTypes) {
    return sequelize.define('maze_instance_user', {
        maze_instance_id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        is_active: {
            type: DataTypes.INTEGER,
            default: 1
        },
        x: DataTypes.INTEGER,
        y: DataTypes.INTEGER,
    }, {
        timestamps: false,
    });
}