//Import external modules
import LayerGroup from "ol/layer/Group";
import GeoImage from "ol-ext/source/GeoImage";
import ImageSource from "ol/source/Image";

//Import local modules

class ExtendedLayerGroup extends LayerGroup {
  name?: string;
  constructor(options: any) {
    super(options);
    this.name = options.name;
  }
}

export { ExtendedLayerGroup };

class ExtendedGeoImage extends GeoImage {
  name?: string;
  constructor(options: any) {
    super(options);
    this.name = options.name;
  }
}

export { ExtendedGeoImage };
