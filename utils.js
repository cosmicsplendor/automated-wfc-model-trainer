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

module.exports = {
    initializeGrid,
    initializeAdjacencyTable
}