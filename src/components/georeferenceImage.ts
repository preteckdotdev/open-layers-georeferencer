//Import external modules
import Image from "ol/layer/Image";
import GeoImage from "ol-ext/source/GeoImage";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Collection, Feature } from "ol";
import Draw from "ol/interaction/Draw";
import Toggle from "ol-ext/control/Toggle";
import { Modify } from "ol/interaction";
import { shiftKeyOnly, singleClick } from "ol/events/condition";

//Import local modules
import { referenceMap, imageMap } from "./createMaps";
import imageTransform from "../config/transformations/helmertTransform";
import {
  transformPoint,
  reverseTransformPoint,
  setSimilarity,
  getSimilarity,
} from "../utils/transformationUtility";

import pixelProjection from "../utils/pixelProjection";
import getStyle from "../utils/layerStyles";
import Point from "ol/geom/Point";

//Import Extended Class

//Global Variables
let IMAGE: any = {} as any;
let id = 0;

export default function startGeoReferencing(
  IMAGE_URL: string,
  IMAGE_NAME: string
) {
  initialiseImageObject(IMAGE_URL, IMAGE_NAME);
}

function initialiseImageObject(IMAGE_URL: string, IMAGE_NAME: string) {
  IMAGE.transformation = new imageTransform.Helmert();
  IMAGE.controlPoints = [];
  IMAGE.lastPoint = [];
  IMAGE.lastID_ = 0 as number;

  IMAGE.sourceLayer = addSource(IMAGE_NAME, IMAGE_URL, imageMap);

  imageMap.getView().setZoom(7);
  imageMap.getView().setCenter([0, 0]);

  IMAGE.destLayer = addDest(referenceMap);
}

function addSource(IMAGE_NAME: string, IMAGE_URL: string, imageMap: any) {
  //Creates the Georeferenced Image Layer
  //Need to create/update the Types/Interfaces/Class for the below.
  let layers = {} as any;
  layers.image = new Image({
    //@ts-ignore
    name: IMAGE_NAME.replace(/\.jpg$|\.png$|\.jpeg$/i, ""),
    opacity: 0,
    source: new GeoImage({
      url: IMAGE_URL,
      imageCenter: [0, 0],
      imageScale: [1, 1],
      //@ts-ignore
      projection: pixelProjection,
    }),
  });

  //Loads the image into the map, after the image is loaded, the Loader will be removed after 1 second.
  layers.image.getSource().on("change", function () {
    setTimeout(function () {
      const LOADING = document.getElementById("loading") as HTMLDivElement;
      LOADING.classList.add("hidden");

      imageMap.getLayers().forEach(function (layer: any) {
        if (layer.get("name") === IMAGE_NAME) {
          layer.setOpacity(1);
        }
      });
    }, 1000);
  });
  imageMap.getLayers().insertAt(0, layers.image);

  //Create and add Image Control Points to the map.
  layers.imageControlPoints = new VectorLayer({
    name: "Image Control Points",
    //@ts-ignore
    source: new VectorSource({
      //@ts-ignore
      features: new Collection(),
    }),
    style: getStyle,
  });

  //Call the addControlPoint function when a control point is added to the map.
  //@ts-ignore
  layers.imageControlPoints.getSource().on("addfeature", function (event: any) {
    if (event.feature.getGeometry().getType() === "Point") {
      addControlPoint(event.feature, true);
    }
  });
  imageMap.addLayer(layers.imageControlPoints);

  //Create the interaction for adding image control points to the map.
  layers.clickInteraction = new Draw({
    type: "Point",
    //@ts-ignore
    source: layers.imageControlPoints.getSource(),
    style: getStyle,
  });
  imageMap.addInteraction(layers.clickInteraction);

  return layers;
}

function addDest(referenceMap: any) {
  let layers = {} as any;

  //Create a control to toggle the Helmert transform on and off.
  let helmertControl = new Toggle({
    //@ts-ignore
    on: getSimilarity(),
    html: "H",
    className:
      "top-2 right-2 bg-green-600 bg-opacity-50 hover:bg-opacity-90 focus:bg-opacity-90", //Add Tailwind CSS that matches ol-helmert
    //set focus to the control rgba(0, 136, 60, 0.9);
    onToggle: function (element: any) {
      setSimilarity(!element);
    },
  });
  referenceMap.addControl(helmertControl);

  //Show / Hide the Georeferenced Image in the Reference Map.
  let georeferencedImageVisiblityControl = new Toggle({
    html: "<i class='fa fa-eye fa-eye-slash'></i>",
    className: "top-2 right-10", //Add Tailwind CSS that matches overview
    onToggle: function () {
      if (IMAGE.destLayer.image) {
        IMAGE.destLayer.image.setVisible(!IMAGE.destLayer.image.getVisible());
      }
    },
  });
  referenceMap.addControl(georeferencedImageVisiblityControl);

  referenceMap.getLayerGroup().on("change", function () {
    if (!IMAGE.sourceLayer.image) return;
    if (IMAGE.sourceLayer.image.getVisible()) {
      //@ts-ignore
      georeferencedImageVisiblityControl.element
        .querySelector("i")
        .classList.remove("fa-eye-slash");
    } else {
      //@ts-ignore
      georeferencedImageVisiblityControl.element
        .querySelector("i")
        .classList.add("fa-eye-slash");
    }
  });

  //Create the Control Points for the Reference Map
  layers.referenceControlPoints = new VectorLayer({
    name: "Reference Control Points",
    //@ts-ignore
    source: new VectorSource({
      //@ts-ignore
      features: new Collection(),
    }),
    style: getStyle,

    //@ts-ignore
    renderOrder: function (f1) {
      if (f1.get("isimg")) return false;
      else return true;
    },
    displayInLayerSwitcher: false,
  });
  referenceMap.addLayer(layers.referenceControlPoints);

  //Draw Links - What does this actually do?
  //@ts-ignore
  layers.referenceControlPoints.on("precompose", function (event: any) {
    if (!IMAGE.transformation.hasControlPoints) return;
    const CONTEXT = event.context;
    CONTEXT.beginPath();
    CONTEXT.strokeStyle = "blue";
    CONTEXT.lineWidth = 2;
    const ratio = event.frameState.pixelRatio;

    for (let i = 0; i < IMAGE.controlPoints.length; i++) {
      const POINT = referenceMap.getPixelFromCoordinate(
        IMAGE.controlPoints[i].refMap.getGeometry().getCoordinates()
      );
      const POINT2 = imageMap.getPixelFromCoordinate(
        IMAGE.controlPoints[i].imgMap.getGeometry().getCoordinates()
      );

      CONTEXT.moveTo(POINT[0] * ratio, POINT[1] * ratio);
      CONTEXT.lineTo(POINT2[0] * ratio, POINT2[1] * ratio);
      CONTEXT.stroke();
    }
  });

  //@ts-ignore
  layers.referenceControlPoints
    .getSource()
    .on("addfeature", function (event: any) {
      if (!event.feature.get("isimg")) {
        addControlPoint(event.feature, false);
      }
    });

  //Add Click Interaction
  layers.clickInteraction = new Draw({
    type: "Point",
    //@ts-ignore
    source: layers.referenceControlPoints.getSource(),
    style: getStyle,
  });
  referenceMap.addInteraction(layers.clickInteraction);

  //Modification Interaction
  let modify = new Modify({
    //@ts-ignore
    features: layers.referenceControlPoints.getSource().getFeaturesCollection(),
    deleteCondition: function (event: any) {
      return shiftKeyOnly(event) && singleClick(event);
    },
  });
  referenceMap.addInteraction(modify);

  modify.on("modifystart", function () {
    if ((IMAGE.lastChanged_ = null)) {
      //Nothing - work out what this does.
    }
  });
  modify.on("modifyend", function () {
    if (IMAGE.lastChanged_) {
      for (let i = 0; i < IMAGE.controlPoints.length; i++) {
        if (IMAGE.controlPoints[i].img2 === IMAGE.lastChanged_) {
          const POINT = IMAGE.controlPoints[i].img2
            .getGeometry()
            .getCoordinates();
          IMAGE.sourceLayer.imageControlPoints
            .getSource()
            .removeFeature(IMAGE.controlPoints[i].img);
          IMAGE.controlPoints[i].img.setGeometry(
            new Point(reverseTransformPoint(POINT))
          );
        }
      }
    }
    runCalculation();
  });

  return layers;
}

function addControlPoint(feature: any, isImage: boolean) {
  console.log("Adding Control Point");
  if (feature.get("id")) return;
  id = IMAGE.lastID_ || 1;

  if (isImage) {
    console.log("isImage");
    IMAGE.sourceLayer.clickInteraction.setActive(false);
    IMAGE.lastPoint.img = feature;
    feature.set("id", id);
    let POINT = transformPoint(feature.getGeometry().getCoordinates());
    if (POINT) {
      referenceMap.getView().setCenter(POINT);
      IMAGE.lastPoint.refMap = new Feature({
        id: id,
        geometry: new Point(POINT),
      });
      IMAGE.destLayer.referenceControlPoints
        .getSource()
        .addFeature(IMAGE.lastPoint.refMap);
    }
  } else {
    console.log("isNOTImage");
    IMAGE.destLayer.clickInteraction.setActive(false);
    IMAGE.lastPoint.refMap = feature;
    feature.set("id", id);

    let POINT = reverseTransformPoint(feature.getGeometry().getCoordinates());
    if (POINT) {
      imageMap.getView().setCenter(POINT);
      IMAGE.lastPoint.img = new Feature({
        id: id,
        geometry: new Point(POINT),
      });
      IMAGE.sourceLayer.imageControlPoints
        .getSource()
        .addFeature(IMAGE.lastPoint.img);
    }
  }
  if (IMAGE.lastPoint.refMap && IMAGE.lastPoint.img) {
    console.log("refMap and img are both true");
    IMAGE.lastPoint.img2 = new Feature({
      isimg: true,
      id: id,
      geometry: new Point([0, 0]),
    });
    IMAGE.destLayer.referenceControlPoints
      .getSource()
      .addFeature(IMAGE.lastPoint.img2);

    IMAGE.lastPoint.img2.on("change", function (e: any) {
      IMAGE.lastChanged_ = e.target;
    });

    IMAGE.lastPoint.id = id;
    IMAGE.controlPoints.push(IMAGE.lastPoint);
    IMAGE.lastID_ = id + 1;

    IMAGE.lastPoint = {};
    IMAGE.transformation.hasControlPoints = IMAGE.controlPoints.length > 1;
    runCalculation();
    IMAGE.sourceLayer.clickInteraction.setActive(true);
    IMAGE.destLayer.clickInteraction.setActive(true);
  }
}

function runCalculation() {
  console.log("Running Calculation");
  if (!IMAGE.controlPoints) return;

  if (IMAGE.controlPoints.length > 1) {
    let xy = [];
    let XY = [];
    for (let i = 0; i < IMAGE.controlPoints.length; i++) {
      xy.push(IMAGE.controlPoints[i].img.getGeometry().getCoordinates());
      XY.push(IMAGE.controlPoints[i].refMap.getGeometry().getCoordinates());
    }

    IMAGE.transformation.setControlPoints(xy, XY);

    let scale = IMAGE.transformation.getScale();
    let rotation = IMAGE.transformation.getRotation();
    let translation = IMAGE.transformation.getTranslation();

    if (!IMAGE.destLayer.image) {
      IMAGE.destLayer.image = new Image({
        //@ts-ignore
        name: IMAGE.sourceLayer.image.get("name"),
        opacity: 1,
        //@ts-ignore
        source: new GeoImage({
          image: IMAGE.sourceLayer.image.getSource().getGeoImage(),
          imageCenter: translation,
          //@ts-ignore
          imageScale: scale,
          //@ts-ignore
          imageRotate: rotation,
        }),
      });

      //Add the Georeferenced Image to the Reference Map
      referenceMap
        .getLayers()
        .insertAt(
          referenceMap.getLayers().getLength() - 1,
          IMAGE.destLayer.image
        );

      referenceMap.getLayers().forEach(function (layer) {
        console.log(layer.get("name"));
        if (layer.get("name") == IMAGE.sourceLayer.image.get("name")) {
          layer.setOpacity(1);
        }
      });
    } else {
      IMAGE.destLayer.image.getSource().setCenter(translation);
      IMAGE.destLayer.image.getSource().setScale(scale);
      IMAGE.destLayer.image.getSource().setRotation(rotation);
    }
    imageMap.getView().setRotation(rotation);

    if (IMAGE.transformation.hasControlPoints) {
      for (let i = 0; i < IMAGE.controlPoints.length; i++) {
        let point = IMAGE.controlPoints[i].img.getGeometry().getCoordinates();
        IMAGE.destLayer.referenceControlPoints
          .getSource()
          .removeFeature(IMAGE.controlPoints[i].img2);
        IMAGE.controlPoints[i].img2
          .getGeometry()
          .setCoordinates(transformPoint(point));
        IMAGE.destLayer.referenceControlPoints
          .getSource()
          .addFeature(IMAGE.controlPoints[i].img2);
        IMAGE.destLayer.image.setVisible(true);
      }
    }
  } else {
    if (IMAGE.destLayer.image) {
      IMAGE.destLayer.image.setVisible(false);
    }
  }
}

function deleteControlPoint(id: number) {
  let i;
  let point;

  for (i = 0; (point = IMAGE.controlPoints[i]); i++) {
    if (point.id === id) break;
  }
  if (point) {
    IMAGE.sourceLayer.imageControlPoints.getSource().removeFeature(point.img);
    IMAGE.destLayer.referenceControlPoints
      .getSource()
      .removeFeature(point.refMap);
    IMAGE.destLayer.referenceControlPoints
      .getSource()
      .removeFeature(point.img2);
    IMAGE.controlPoints.splice(i, 1);
    IMAGE.lastPoint = {};
    runCalculation();
    IMAGE.transformation.hasControlPoints = IMAGE.controlPoints.length > 1;
  }
}

export { IMAGE, runCalculation, deleteControlPoint };
