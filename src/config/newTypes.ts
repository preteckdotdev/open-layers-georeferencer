interface Coordinate {
  x: number;
  y: number;
}

interface HelmertOptions {
  similarity?: boolean;
}

interface HelmertTransform {
  setControlPoints(xy: Coordinate[], XY: Coordinate[]): boolean;
  getRotation(): number;
  getScale(): Coordinate;
  getTranslation(): Coordinate;
  transform(xy: Coordinate): Coordinate;
  revers(xy: Coordinate): Coordinate;
}

interface HelmertClass {
  new (options?: HelmertOptions): HelmertTransform;
}

interface ImageTransform {
  Helmert: HelmertClass;
}

export type {
  Coordinate,
  HelmertOptions,
  HelmertTransform,
  HelmertClass,
  ImageTransform,
};
