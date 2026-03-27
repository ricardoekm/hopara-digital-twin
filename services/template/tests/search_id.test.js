const fs = require('fs')
const pathModule = require('path')

function getVisualizationFiles(path) {
    const files = fs.readdirSync(path)
    const fileNames = []

    files.forEach((file) => {
        const filePath = pathModule.join(path, file)
        const stats = fs.statSync(filePath)

        if (!stats.isDirectory()) return

        fileNames.push(...getVisualizationFiles(filePath))

        if (file === 'visualizations') {
            const jsonFiles = fs.readdirSync(filePath).filter((file) => pathModule.extname(file).toLowerCase() === '.json')
            fileNames.push(...jsonFiles.map((file) => pathModule.join(filePath, file)))
        }
    })
    return fileNames
}

function verifyForForbiddenIds(path) {
    const vizFiles = getVisualizationFiles(path)

    const jsonsWithId = []

    for (let i = 0; i < vizFiles.length; i++) {
        const content = fs.readFileSync(vizFiles[i], 'utf-8')
        const visualization = JSON.parse(content)

        if (visualization.id !== undefined) {
            jsonsWithId.push(vizFiles[i])
        }
    }

    if (jsonsWithId.length > 0) {
        return `Visualizations with Id to remove: ${JSON.stringify(jsonsWithId)}`
    }
    return 'not found'
}

test('Verify for forbidden Ids', () => {
    expect(verifyForForbiddenIds('templates/listed')).toEqual('not found')
})
