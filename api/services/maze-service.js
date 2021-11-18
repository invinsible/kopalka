const {v4} = require("uuid");
const _ = require('lodash');
const {models, sequelize} = require('../models');
const enums = require('../lib/enums')

const DIRECTIONS = {N: 1, S: 2, E: 4, W: 8};
const DX = {N: 0, S: 0, E: 1, W: -1};
const DY = {N: -1, S: 1, E: 0, W: 0};
const OPPOSITE = {N: DIRECTIONS.S, S: DIRECTIONS.N, E: DIRECTIONS.W, W: DIRECTIONS.E};

// Сервис для лабиринтов
class MazeService {
    /**
     * @type {UserService}
     */
    userService = null

    /**
     *
     * @param userService
     */
    constructor(userService) {
        this.userService = userService;
    }

    generate() {
        const maze = {
            width: 30,
            height: 20,
            cells: [],
            objects: [],
        };

        maze.cells = this.generateMaze(maze.width, maze.height);
        maze.objects = this.generateObjects(maze);

        return maze;
    }

    generateMaze(width, height) {
        let grid = [];

        for (let y = 0; y < height; y++) {
            grid[y] = [];
            for (let x = 0; x < width; x++) {
                grid[y][x] = 0b1111;
            }
        }

        return this.carvePassagesFrom(0, 0, grid);
    }

    carvePassagesFrom(x, y, grid) {
        const directionKeys = _.shuffle(Object.keys(DIRECTIONS));

        for (let direction of directionKeys) {
            const newX = x + DX[direction],
                newY = y + DY[direction];

            // Check existence
            if (!grid[newY] || !grid[newY][newX]) {
                continue;
            }

            // Already changed
            if (grid[newY][newX] !== 0b1111) {
                continue;
            }

            // Creating passages
            grid[y][x] = grid[y][x] ^ DIRECTIONS[direction];
            grid[newY][newX] = grid[newY][newX] ^ OPPOSITE[direction];
            this.carvePassagesFrom(newX, newY, grid);
        }

        return grid;
    }

    generateObjects(maze) {
        let objects = [];

        // Entries
        objects.push(this.buildNewObject(this.getRandomCell(maze), 'entry'))

        // Exits
        objects.push(this.buildNewObject(this.getRandomCell(maze), 'stairs-down'))

        return objects;
    }

    getRandomCell(maze) {
        return {
            x: _.random(0, maze.width - 1),
            y: _.random(0, maze.height - 1),
        }
    }

    buildNewObject(coords, type) {
        return {
            coords,
            type
        };
    }

    getCurrentPosition(maze) {
        const entries = [];
        for (const object of maze.objects) {
            if (object.type === 'entry') {
                entries.push(object)
            }
        }

        const randomEntry = _.shuffle(entries)[0];

        return randomEntry.coords
    }

    /**
     * Создаёт инстанс лабиринта и отправляет туда пользователя.
     * @param userId
     * @return {Promise<string>}
     */
    async start(userId) {
        const user = await this.userService.findInactive(userId);
        const maze = this.generate();

        const result = await sequelize.transaction(async (t) => {
            const updated = await models.User.update(
                {state: enums.user.states.IN_MAZE},
                {where: {id: user.id}},
                {transaction: t}
            );

            const instance = await models.MazeInstance.create({
                id: v4(),
                type: 1,
                created_by: user.id,
                data: JSON.stringify(maze)
            }, {transaction: t});

            const instanceUser = await models.MazeInstanceUser.create({
                maze_instance_id: instance.id,
                user_id: user.id,
                is_active: 1
            }, {transaction: t});


            return instanceUser.maze_instance_id;
        });

        console.log(`Created maze instance ${result}.`)

        return result;
    }

    /**
     * Находит инстанс лабиринта по айди и возвращает данные для фронта.
     * @param id
     * @return {Promise<*|null>}
     */
    async getInstance(id) {
        // @todo проверять, что пользователь есть в этом инсте
        const maze = await models.MazeInstance.findByPk(id);
        if (!maze) {
            return null;
        }

        maze.dataParsed = JSON.parse(maze.data);

        return maze;
    }

    /**
     * Находит активный инстанс пользователя.
     * @param userId
     * @return {Promise<void>}
     */
    async getUsersInstance(userId) {
        const user = await models.User.findByPk(userId);
        if (user === null) {
            throw new Error('User not found')
        }

        const activeInstanceUser = await models.MazeInstanceUser.findOne({
            where: {user_id: user.id, is_active: 1}
        });

        if (!activeInstanceUser) {
            return null;
        }

        return activeInstanceUser;
    }
}

module.exports = MazeService;