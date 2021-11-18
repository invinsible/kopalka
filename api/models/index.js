const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

const models = {
    User: require('./user')(sequelize, DataTypes),
    Token: require('./token')(sequelize, DataTypes),
    Item: require('./item')(sequelize, DataTypes),
    InventoryItem: require('./inventory_item')(sequelize, DataTypes),
    WorkCycle: require('./work_cycles')(sequelize, DataTypes),
    MazeInstance: require('./maze_instance')(sequelize, DataTypes),
    MazeInstanceUser: require('./maze_instance_user')(sequelize, DataTypes),
};

// Creating associations
models.Item.hasMany(models.InventoryItem, {foreignKey: 'item_id'})
models.InventoryItem.belongsTo(models.Item, {foreignKey: 'item_id'})
models.WorkCycle.belongsTo(models.User, {foreignKey: 'user_id'})
models.WorkCycle.belongsTo(models.Item, {foreignKey: 'item_id'})

module.exports = {
    sequelize,
    models
};
