module.exports = {
    user: {
        states: {
            INACTIVE: 0,
            WORKING: 1,
            IN_MAZE: 2
        }
    },
    workCycle: {
        states: {
            IN_PROGRESS: 1,
            FINISHED: 2,
            CANCELED: 3
        }
    },
    item: {
        types: {
            RESOURCE: 1
        }
    },
    inventory: {
        types: {
            MAIN: 1,
            MAZE: 2
        }
    }
};
