import path from 'path'

export class Resource {
    name: string
    file: string
  
    constructor({name, file}:{name:string, file:string}) {
      this.name = name
      this.file = file
    }
  
    static fromFiles(files:string[]): Resource[] {
      return files.map((file) => {
        return Resource.fromFile(file)
      })
    }
  
    static fromFile(file:string): Resource {
      return new Resource({
        file,
        name: path.basename(file, path.extname(file)),
      })
    }
  }
