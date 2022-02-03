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
        objects.push(this.buildNewObject(this.getRandomCell(maze), 'entry'));

        // Stairs
        objects.push(this.buildNewObject(this.getRandomCell(maze), 'stairs-down'));

        return objects;
    }

    getRandomCell(maze) {
        return {
            x: _.random(0, maze.width - 1),
            y: _.random(0, maze.height - 1),
        };
    }

    buildNewObject(coords, type) {
        return {
            coords,
            type
        };
    }

    getStartingPosition(maze) {
        const entries = [];
        for (const object of maze.objects) {
            if (object.type === 'entry') {
                entries.push(object)
            }
        }

        const randomEntry = _.shuffle(entries)[0];

        return randomEntry.coords
    }

    async getUsersCurrentInstance(userId) {
        const activeInstanceUser = await models.MazeInstanceUser.findOne({
            where: {user_id: userId, is_active: 1},
            include: ['maze_instance']
        });

        return !activeInstanceUser ? null : activeInstanceUser;
    }

    /**
     * Создаёт инстанс лабиринта и отправляет туда пользователя.
     * @param userId
     * @return {Promise<string>}
     */
    async start(userId) {
        const user = await this.userService.findInactive(userId);
        const maze = this.generate();
        const currentPosition = this.getStartingPosition(maze);

        const result = await sequelize.transaction(async (t) => {
            const updated = await models.User.update(
                {state: enums.user.states.IN_MAZE},
                {where: {id: user.id}, transaction: t}
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
                is_active: 1,
                x: currentPosition.x,
                y: currentPosition.y,
                visited: JSON.stringify([[currentPosition.x, currentPosition.y]])
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

        return await this.getUsersCurrentInstance(user.id);
    }

    /**
     * Перемещает пользователя в указанном направлении
     * @param userId
     * @param direction
     * @return {Promise<void>}
     */
    async move(userId, direction) {
        const user = await models.User.findByPk(userId);
        if (user === null) {
            throw new Error('User not found')
        }

        const current = await this.getUsersCurrentInstance(user.id),
            maze = current.maze_instance.dataParsed,
            currentPosition = {x: current.x, y: current.y};

        const newPosition = {
            x: currentPosition.x + DX[direction],
            y: currentPosition.y + DY[direction]
        };

        if (maze.cells[newPosition.y] === undefined || maze.cells[newPosition.y][newPosition.x] === undefined) {
            throw new Error('Wrong move');
        }

        const visited = current.visitedParsed;
        visited.push([newPosition.x, newPosition.y]);

        // @todo проверить, нет ли стен

        await models.MazeInstanceUser.update({
            x: newPosition.x,
            y: newPosition.y,
            visited: JSON.stringify(visited)
        }, {where: {maze_instance_id: current.maze_instance_id, user_id: current.user_id}});

        return {
            x: newPosition.x,
            y: newPosition.y
        };
    }

    /**
     * Выход из лабиринта.
     * @param userId
     * @return {Promise<boolean>}
     */
    async exit(userId) {
        const user = await models.User.findByPk(userId);
        if (user === null) {
            throw new Error('User not found')
        }

        const current = await this.getUsersCurrentInstance(user.id);
        if (!current) {
            throw new Error('No active maze instance');
        }

        // @todo проверять, что человек стоит на выходе



        await sequelize.transaction(async (t) => {
            await models.User.update(
                {state: enums.user.states.INACTIVE},
                {where: {id: user.id}, transaction: t},
            );

            return await models.MazeInstanceUser.update(
                {
                    is_active: 0,
                },
                {
                    where: {maze_instance_id: current.maze_instance_id, user_id: current.user_id},
                    transaction: t
                });
        });

        return true;
    }
}

module.exports = MazeService;