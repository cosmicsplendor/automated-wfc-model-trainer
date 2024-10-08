const fs = require("fs")
function initializeGrid(worldWidth, worldHeight, tileWidth, tileHeight) {
    const gridWidth = worldWidth / tileWidth
    const gridHeight = worldHeight / tileHeight
    const grid = [];
    for (let y = 0; y < gridHeight; y++) {
        const row = [];
        for (let x = 0; x < gridWidth; x++) {
            row.push("empty");
        }
        grid.push(row);
    }
    return grid;
}
function initializeAdjacencyTable(tileTypes) {
    const adjacencyTable = {};
    tileTypes.forEach(type => {
        adjacencyTable[type] = { up: {}, down: {}, left: {}, right: {} };
    });
    return adjacencyTable;
}

function uniquePush(arr, item, weight = 1) {
    if (!arr[item]) {
        arr[item] = weight; // Store weight
    } else {
        arr[item] += weight; // Increment existing weight
    }
    return arr;
}

function updateAdjacencyTable(grid, adjacencyTable) {
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const tile = grid[y][x];
            if (tile === "empty") {
                continue;
            }
            const adjacentRelation = adjacencyTable[tile];

            // Check adjacent tiles and update adjacency rules
            if (y > 0) {
                uniquePush(adjacentRelation.up, grid[y - 1][x]);
            }
            if (y < gridHeight - 1) {
                uniquePush(adjacentRelation.down, grid[y + 1][x]);
            }
            if (x > 0) {
                uniquePush(adjacentRelation.left, grid[y][x - 1]);
            }
            if (x < gridWidth - 1) {
                uniquePush(adjacentRelation.right, grid[y][x + 1]);
            }
        }
    }
}

const populateGrid = (grid, tiles, tileWidth, tileHeight) => {
    tiles.forEach(tile => {
        let gridX = tile.x / tileWidth;  // Calculate grid position based on x coordinate
        let gridY = tile.y / tileHeight;  // Calculate grid position based on y coordinate

        // Place the tile's name in the appropriate grid cell
        grid[gridY][gridX] = tile.name;
    })
}
const exportAdjacencyTable = (table, filepath) => {
    const newEntries = Object.keys(table).map(key => {
        const value = table[key]
        const newValue = {}
        for (const direction in value) {
            const weightMap = value[direction]
            newValue[direction] = Object.entries(weightMap).map(([tile, weight]) => ({ tile, weight }))
        }
        return [ key, newValue ]
    })
    const exportData = Object.fromEntries(newEntries)
    fs.writeFileSync(filepath, JSON.stringify(exportData))
}
module.exports = {
    initializeGrid,
    initializeAdjacencyTable,
    updateAdjacencyTable,
    populateGrid,
    exportAdjacencyTable
}