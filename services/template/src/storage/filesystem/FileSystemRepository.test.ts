import {promises as fs} from 'fs'
import os from 'os'
import path from 'path'
import {FileSystemRepository} from './FileSystemRepository'

describe('FileSystemRepository', () => {
  let tempDir:string
  let repository:FileSystemRepository

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fs-repo-'))
    repository = new FileSystemRepository({basePath: tempDir})
  })

  afterEach(async () => {
    await fs.rm(tempDir, {recursive: true, force: true})
  })

  it('checks if a path exists', async () => {
    await fs.mkdir(path.join(tempDir, 'listed/template-1'), {recursive: true})
    await fs.writeFile(path.join(tempDir, 'listed/template-1/file.txt'), 'content')

    await expect(repository.pathExists('listed')).resolves.toBe(true)
    await expect(repository.pathExists('listed/template-1')).resolves.toBe(true)
    await expect(repository.pathExists('listed/template-1/file.txt')).resolves.toBe(true)
    await expect(repository.pathExists('listed/template-2')).resolves.toBe(false)
  })

  it('lists files inside a directory', async () => {
    await fs.mkdir(path.join(tempDir, 'listed/template-1'), {recursive: true})
    await fs.writeFile(path.join(tempDir, 'listed/template-1/a.sql'), 'SELECT 1;')
    await fs.writeFile(path.join(tempDir, 'listed/template-1/b.sql'), 'SELECT 2;')
    await fs.mkdir(path.join(tempDir, 'listed/template-1/nested'))

    await expect(repository.listFiles('listed/template-1')).resolves.toEqual(expect.arrayContaining(['a.sql', 'b.sql']))
    await expect(repository.listFiles('listed/template-1')).resolves.not.toContain('nested')
    await expect(repository.listFiles('unknown')).resolves.toEqual([])
  })

  it('lists folders inside a directory', async () => {
    await fs.mkdir(path.join(tempDir, 'listed/a'), {recursive: true})
    await fs.mkdir(path.join(tempDir, 'listed/b'), {recursive: true})
    await fs.writeFile(path.join(tempDir, 'listed/file.txt'), 'content')

    const folders = await repository.listFolders('listed')
    expect(folders.sort()).toEqual(['a', 'b'])

    await expect(repository.listFolders('unknown')).resolves.toEqual([])
  })

  it('reads a text file', async () => {
    const filePath = path.join(tempDir, 'listed/file.txt')
    await fs.mkdir(path.dirname(filePath), {recursive: true})
    await fs.writeFile(filePath, 'plain text')

    const file = await repository.getTextFile('listed/file.txt')
    expect(file.Data).toBe('plain text')
    expect(file.ContentType).toBe('text/plain')
  })

  it('reads a binary file with detected content type', async () => {
    const binPath = path.join(tempDir, 'listed/image.bin')
    const pngPath = path.join(tempDir, 'listed/image.png')
    await fs.mkdir(path.dirname(binPath), {recursive: true})
    const buffer = Buffer.from([0, 1, 2, 3])
    await fs.writeFile(binPath, buffer)

    const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47])
    await fs.writeFile(pngPath, pngBuffer)

    const file = await repository.getBinaryFile('listed/image.bin')
    expect(file.Data).toEqual(buffer)
    expect(file.ContentType).toBe('application/octet-stream')

    const pngFile = await repository.getBinaryFile('listed/image.png')
    expect(pngFile.Data).toEqual(pngBuffer)
    expect(pngFile.ContentType).toBe('image/png')
  })

  it('reads and parses a JSON file', async () => {
    const filePath = path.join(tempDir, 'listed/data.json')
    await fs.mkdir(path.dirname(filePath), {recursive: true})
    await fs.writeFile(filePath, JSON.stringify({id: 1}))

    const data = await repository.getJSONFile('listed/data.json')
    expect(data).toEqual({id: 1})
  })

  it('detects content type for json and sql files', async () => {
    const jsonPath = path.join(tempDir, 'listed/data.json')
    const sqlPath = path.join(tempDir, 'listed/query.sql')
    await fs.mkdir(path.dirname(jsonPath), {recursive: true})

    await fs.writeFile(jsonPath, JSON.stringify({foo: 'bar'}))
    await fs.writeFile(sqlPath, 'SELECT 1;')

    const jsonFile = await repository.getBinaryFile('listed/data.json')
    const sqlFile = await repository.getBinaryFile('listed/query.sql')

    expect(jsonFile.ContentType).toBe('application/json')
    expect(sqlFile.ContentType).toBe('application/x-sql')
  })

  it('returns null when JSON file does not exist or is invalid', async () => {
    await expect(repository.getJSONFile('unknown.json')).resolves.toBeNull()

    const filePath = path.join(tempDir, 'listed/bad.json')
    await fs.mkdir(path.dirname(filePath), {recursive: true})
    await fs.writeFile(filePath, '{invalid json}')

    await expect(repository.getJSONFile('listed/bad.json')).resolves.toBeNull()
  })
})
