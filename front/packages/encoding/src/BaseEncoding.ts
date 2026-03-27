/* eslint-disable @typescript-eslint/no-unused-vars */
import {Exclude} from 'class-transformer'
import {Encoding} from './Encoding'

export abstract class BaseEncoding<T> implements Encoding {
  @Exclude()
  createdTimestamp: Date

  @Exclude()
  updatedTimestamp: Date

  constructor() {
    this.createdTimestamp = new Date()
  }

  getCreatedTimestamp(): number {
    return this.createdTimestamp.getTime()
  }

  getUpdatedTimestamp() : number {
    return this.updatedTimestamp?.getTime() ?? 0
  }

  resetUpdatedTimestamp() {
    this.updatedTimestamp = new Date()
  }

  abstract isRenderable(): boolean;
}
