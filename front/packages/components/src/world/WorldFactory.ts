import Visualization from '../visualization/Visualization'
import { CameraType, ProjectionType, World, WorldStatus } from './World'

export class WorldFactory {
  private static getProjectionType(visualization: Visualization): ProjectionType {
    if (visualization.isGeo()) return ProjectionType.WEBMERCATOR
    if (visualization.isChart()) return ProjectionType.CARTESIAN

    return ProjectionType.NONE
  }

  private static getCameraType(visualization: Visualization): CameraType {
    if (visualization.is3D()) return CameraType.ORBIT
    return CameraType.ORTHOGRAPHIC
  }

  private static getInitialStatus(visualization: Visualization): WorldStatus {
    if (visualization.isGeo() || visualization.is3D() || visualization.isWhiteboard()) return WorldStatus.UPDATED
    return WorldStatus.NONE
  }

  static createFromVisualization(visualization: Visualization): World {
    return new World({
      projection: this.getProjectionType(visualization),
      camera: this.getCameraType(visualization),
      status: this.getInitialStatus(visualization),
    })
  }
}
