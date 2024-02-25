//Import external modules

//Import local modules
import { IMAGE, runCalculation } from "../components/georeferenceImage";

//Import Extended Class

//Global Variables

function transformPoint(xy: any) {
  return IMAGE.transformation.hasControlPoints
    ? IMAGE.transformation.transform(xy)
    : false;
}

function reverseTransformPoint(xy: any) {
  return IMAGE.transformation.hasControlPoints
    ? IMAGE.transformation.revers(xy)
    : false;
}

function setSimilarity(b: any) {
  IMAGE.transformation.similarity = b !== false;
  runCalculation();
}

function getSimilarity() {
  return IMAGE.transformation.similarity;
}

export { transformPoint, reverseTransformPoint, setSimilarity, getSimilarity };
