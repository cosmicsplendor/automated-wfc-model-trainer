const adjacencyData = require("./adjacency.json")

// Utility function to pick a random tile based on weights
function weightedRandomTile(tiles) {
    const totalWeight = tiles.reduce((sum, tile) => sum + tile.weight, 0);
    let random = Math.random() * totalWeight;

    for (const tile of tiles) {
        if (random < tile.weight) {
            return tile.tile;
        }
        random -= tile.weight;
    }

    return null; // Fallback if something goes wrong
}

// Initialize grid with all possible tiles
function initializeGrid(width, height, adjacencyData) {
    const allTiles = Object.keys(adjacencyData); // List of all available tile names
    const grid = Array.from({ length: height }, () => (
        Array.from({ length: width }, () => ({
            possibleTiles: allTiles.slice(), // Start with all possible tiles
            collapsed: false
        }))
    ));
    return grid;
}

// Function to propagate constraints to neighboring cells
function propagate(grid, x, y, adjacencyData) {
    const currentTile = grid[y][x].chosenTile;

    // Only propagate if the current tile has valid adjacency data
    if (!adjacencyData[currentTile]) {
        return;
    }

    // Get neighboring positions
    const neighbors = [
        { dx: 0, dy: -1, dir: "up" },    // Top neighbor
        { dx: 0, dy: 1, dir: "down" },   // Bottom neighbor
        { dx: -1, dy: 0, dir: "left" },  // Left neighbor
        { dx: 1, dy: 0, dir: "right" }   // Right neighbor
    ];

    // For each neighbor, update possible tiles based on adjacency rules
    neighbors.forEach(({ dx, dy, dir }) => {
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length) {
            const neighborCell = grid[ny][nx];

            if (!neighborCell.collapsed) {
                // Check if there are valid adjacencies for this direction
                const possibleAdjacents = adjacencyData[currentTile][dir] || [];
                
                const validTiles = neighborCell.possibleTiles.filter(tile => 
                    possibleAdjacents.some(adj => adj.tile === tile)
                );

                neighborCell.possibleTiles = validTiles;
            }
        }
    });
}


// Collapse the cell with the lowest entropy
function collapse(grid, adjacencyData) {
    let minEntropy = Infinity;
    let cellToCollapse = null;

    // Find the cell with the lowest entropy (fewest possible tiles)
    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (!cell.collapsed && cell.possibleTiles.length < minEntropy) {
                minEntropy = cell.possibleTiles.length;
                cellToCollapse = { x, y };
            }
        });
    });

    if (cellToCollapse) {
        const { x, y } = cellToCollapse;
        const possibleTiles = grid[y][x].possibleTiles.map(tile => {
            const totalWeight = adjacencyData[tile] ? adjacencyData[tile].weight : 1;
            return { tile, weight: totalWeight };
        });

        // Choose a tile based on weighted randomness
        const chosenTile = weightedRandomTile(possibleTiles);

        // Collapse the cell to that chosen tile
        grid[y][x].chosenTile = chosenTile;
        grid[y][x].collapsed = true;
        grid[y][x].possibleTiles = [chosenTile];

        // Propagate constraints to neighbors
        propagate(grid, x, y, adjacencyData);
    }
}

// Main WFC function to fill the grid
function waveFunctionCollapse(width, height, adjacencyData) {
    const grid = initializeGrid(width, height, adjacencyData);

    while (grid.some(row => row.some(cell => !cell.collapsed))) {
        collapse(grid, adjacencyData);
    }

    return grid;
}

// Example: Run WFC for a 5x5 grid
const resultGrid = waveFunctionCollapse(5, 5, adjacencyData);

require("fs").writeFileSync("./result.json", JSON.stringify(resultGrid))