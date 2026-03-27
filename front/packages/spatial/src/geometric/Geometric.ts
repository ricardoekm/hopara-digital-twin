import {Feature, FeatureCollection, LineString, Point, Polygon} from '@turf/helpers'

export interface Geometric {
  getRotatedBBox(geometry: FeatureCollection): Feature<LineString>;

  getCentroid(geometry: FeatureCollection): Feature<Point>;

  getScaleFactor(centroid: Point, startDragPoint: Point, currentPoint: Point): number;

  polygonRotate(geometry: Feature<Polygon>, angle: number, centroid: Feature<Point>): Feature;

  getMidPoint(point1: Point, point2: Point): Feature<Point>;

  getLineBearing(point1: Point, point2: Point): number;

  getBearing(coordinate: Feature<Polygon>): number;

  getDistance(point1: Feature<Point>, point2: Feature<Point>): number;

  lineRotate(line: Feature<LineString>, angle: number, pivot: Feature<Point>): Feature<LineString>;

  scalePolygon(polygon: Feature<Polygon>, scaleFactor: number, origin: Feature<Point>, originIndex: number): Feature<Polygon>;

  translate(geometry: Feature<Polygon>, distance: number, angle: number): Feature;

  translateToCoordinates(geometry: Feature<Polygon>, coordinates: number[]): number[];
}

