module.exports = function (sequelize, DataTypes) {
    return sequelize.define('token', {
        token: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID
        },

    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
}