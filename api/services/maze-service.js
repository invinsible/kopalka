const {v4} = require("uuid");
const _ = require('lodash');

const DIRECTIONS = {N: 1, S: 2, E: 4, W: 8};
const DX = {N: 0, S: 0, E: 1, W: -1};
const DY = {N: -1, S: 1, E: 0, W: 0};
const OPPOSITE = {N: DIRECTIONS.S, S: DIRECTIONS.N, E: DIRECTIONS.W, W: DIRECTIONS.E};

// Сервис для лабиринтов
class MazeService {
    constructor() {
    }

    generate() {
        const maze = {
            id: v4(),
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
            x: _.random(0, maze.width),
            y: _.random(0, maze.height),
        }
    }

    buildNewObject(coords, type) {
        return {
            coords,
            type
        };
    }
}

module.exports = MazeService;