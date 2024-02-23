//Import external modules
import Map from "ol/Map";
import View from "ol/View";
import * as Control from "ol/control";
import { defaults as defaultControls } from "ol/control";
import LayerSwitcher from "ol-ext/control/LayerSwitcher";
import { createStringXY } from "ol/coordinate";
import { altKeyOnly } from "ol/events/condition";
import { Projection } from "ol/proj";
import { defaults } from "ol/interaction/defaults";

//Import local modules

//Global Variables
let referenceMap = {} as Map;
let imageMap = {};
let mapSynchro = true;

export default function createMaps() {
  const REF_MAP_DIV = document.getElementById("map") as HTMLElement;
  const IMAGE_MAP_DIV = document.getElementById("img") as HTMLElement;

  createReferenceMap(REF_MAP_DIV);
  createImageMap(IMAGE_MAP_DIV);
}

function createReferenceMap(REF_MAP_DIV: HTMLElement) {
  referenceMap = new Map({
    target: REF_MAP_DIV,
    view: new View({
      zoom: 12,
      center: [259694, 6251211],
    }),
    controls: defaultControls().extend([new LayerSwitcher()]),
    layers: [],
  });

  referenceMap.getView().on("change:center", function () {
    if (mapSynchro) return;
    mapSynchro = true;
    let centerPoint = referenceMap.getView().getCenter(); // This needs to be converted.
    if (centerPoint) {
      //   imageMap.getView().setCenter(centerPoint); //This needs creating.
    }
    mapSynchro = false;
  });

  const MOUSE_POSITION_CONTROL = new Control.MousePosition({
    coordinateFormat: createStringXY(4),
  });
  referenceMap.addControl(MOUSE_POSITION_CONTROL);

  referenceMap.on("click", function (events) {
    if (altKeyOnly(events)) {
      console.log("Alt key pressed");
      let features = referenceMap.getFeaturesAtPixel(events.pixel);
      for (var i = 0, feature; (feature = features[i]); i++) {
        feature = feature.get("features")[0];
        if (feature && feature.get("id")) {
          // delControlPoint(feature.get("id"));
          break;
        }
      }
    }
  });
}

function createImageMap(IMAGE_MAP_DIV: HTMLElement) {
  imageMap = new Map({
    target: IMAGE_MAP_DIV,
    view: new View({
      zoom: 7,
      center: [0, 0],
      projection: pixelProjection,
    }),
    controls: defaultControls(),
    interactions: defaults({
      altShiftDragRotate: false,
      pinchRotate: false,
    }),
    layers: [],
  });
}

const pixelProjection = new Projection({
  code: "pixel",
  units: "pixels",
  extent: [-100000, -100000, 100000, 100000],
});
