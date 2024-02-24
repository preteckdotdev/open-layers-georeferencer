//Import external modules
import LayerGroup from "ol/layer/Group";

//Import local modules

class ExtendedLayerGroup extends LayerGroup {
  name?: string;
  constructor(options: any) {
    super(options);
    this.name = options.name;
  }
}

export { ExtendedLayerGroup };
