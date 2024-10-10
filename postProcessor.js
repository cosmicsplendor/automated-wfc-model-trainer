const postProcessor = Object.freeze({
    empty: {
        default: tilesData => {
            return tilesData.filter(d => d.tile !== "empty")
        }
    }
})

module.exports = postProcessor