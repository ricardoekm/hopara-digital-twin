export enum WorldStatus {
  NONE = 'NONE',
  UPDATING = 'UPDATING',
  UPDATED = 'UPDATED',
}

export enum ProjectionType {
  NONE = 'NONE',
  WEBMERCATOR = 'WEBMERCATOR',
  CARTESIAN = 'CARTESIAN',
}

export enum CameraType {
  ORTHOGRAPHIC = 'ORTHOGRAPHIC',
  ORBIT = 'ORBIT'
}

export class World {
  status: WorldStatus
  projection: ProjectionType
  camera: CameraType

  constructor(partialWorld?: Partial<World>) {
    Object.assign(this, partialWorld)
    if (!this.status) this.status = WorldStatus.NONE
  }

  clone(): World {
    return new World(this)
  }

  isProjection(type:ProjectionType) {
    return this.projection === type
  }

  isCamera(type:CameraType) {
    return this.camera === type
  }

  isWebmercatorProjection(): boolean {
    return this.isProjection(ProjectionType.WEBMERCATOR)
  }

  isCartesianProjection(): boolean {
    return this.isProjection(ProjectionType.CARTESIAN)
  }

  isOrbitCamera(): boolean {
    return this.isCamera(CameraType.ORBIT)
  }
}
