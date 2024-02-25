import { Projection } from "ol/proj";

const pixelProjection = new Projection({
  code: "pixel",
  units: "pixels",
  extent: [-100000, -100000, 100000, 100000],
});

export default pixelProjection;
