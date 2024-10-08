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
        adjacencyTable[type] = { up: [], down: [], left: [], right: [] };
    });
    return adjacencyTable;
}
function updateAdjacencyTable(grid, adjacencyTable) {
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const tile = grid[y][x];
            if (tile === "empty") {
                return
            }
            // Check adjacent tiles and update adjacency rules
            if (y > 0) {
                adjacencyTable[tile].up.push(grid[y - 1][x]);
            }
            if (y < gridHeight - 1) {
                adjacencyTable[tile].down.push(grid[y + 1][x]);
            }
            if (x > 0) {
                adjacencyTable[tile].left.push(grid[y][x - 1]);
            }
            if (x < gridWidth - 1) {
                adjacencyTable[tile].right.push(grid[y][x + 1]);
            }
        }
    }
}
module.exports = {
    initializeGrid,
    initializeAdjacencyTable,
    updateAdjacencyTable
}