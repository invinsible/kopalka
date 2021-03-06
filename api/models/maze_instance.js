module.exports = function (sequelize, DataTypes) {
    return sequelize.define('maze_instance', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        type: DataTypes.INTEGER,
        created_by: {
            type: DataTypes.UUID
        },
        data: DataTypes.TEXT,
        dataParsed: {
            type: DataTypes.VIRTUAL,
            get() {
                return this.data ? JSON.parse(this.data) : null;
            }
        }
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
}