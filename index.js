const fs = require("fs")
const walltiles = require("./data/walltiles.json")
const backwalltiles = require("./data/backwalltiles.json")
const data = require("./data/data1.json")
const { initializeGrid, initializeAdjacencyTable, populateGrid, updateAdjacencyTable, exportAdjacencyTable } = require("./utils")

const tileWidth = 48
const tileHeight = 48

const tiles = data.fgTiles.concat(data.tiles)
const maxY = tiles.reduce((maxY, tile) => Math.max(maxY, tile.y), 0)
const gridOffset = -maxY % 48
const validTiles = tiles.filter(tile => {
    const valid = walltiles.includes(tile.name)
    const snapped = tile.x % 48 === 0 && (tile.y + gridOffset) % 48 === 0
    return valid && snapped
})
const minY = validTiles.reduce((y0, tile) => Math.min(y0, tile.y), Infinity)
const width = validTiles.reduce((maxX, tile) => Math.max(tile.x, maxX), 0) + tileWidth
validTiles.forEach(tile => {
    tile.y -= minY
})
const height = maxY + tileHeight - minY
const tileTypes = ["empty", ...walltiles]

const grid = initializeGrid(width, height, tileWidth, tileHeight)
const adjacencyTable = initializeAdjacencyTable(tileTypes)

populateGrid(grid, validTiles, tileWidth, tileHeight)
fs.writeFileSync("./grid.json", JSON.stringify(grid))
updateAdjacencyTable(grid, adjacencyTable)
exportAdjacencyTable("./adjacency.json", adjacencyTable)
