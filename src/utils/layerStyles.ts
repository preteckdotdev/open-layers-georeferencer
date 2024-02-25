//Import external modules
import Style from "ol/style/Style";
import Circle from "ol/style/Circle";
import Stroke from "ol/style/Stroke";
import RegularShape from "ol/style/RegularShape";

//Import local modules

//Import Extended Class

//Global Variables

function getStyle(feature: any) {
  if (!feature)
    return [
      new Style({
        image: new Circle({
          radius: 8,
          stroke: new Stroke({
            color: "#fff",
            width: 3,
          }),
        }),
      }),
      new Style({
        image: new Circle({
          radius: 8,
          stroke: new Stroke({
            color: "#000",
            width: 1,
          }),
        }),
      }),
    ];
  if (feature.get("isimg")) {
    return [
      new Style({
        image: new RegularShape({
          radius: 10,
          points: 4,
          stroke: new Stroke({
            color: "orange",
            width: 2,
          }),
        }),
      }),
    ];
  }
  return [
    new Style({
      image: new Circle({
        radius: 8,
        stroke: new Stroke({
          color: "red",
          width: 2,
        }),
      }),
      stroke: new Stroke({
        color: "red",
        width: 2,
      }),
    }),
  ];
}

export default getStyle;
