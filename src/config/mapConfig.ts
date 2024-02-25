//Import external modules
import { OSM } from "ol/source";

//Import local modules
import { ExtendedLayerGroup } from "./newClasses";
import TileLayer from "ol/layer/Tile";

const referenceMapBaseMapGroup = new ExtendedLayerGroup({
  name: "Base Layers",
  layers: [
    new TileLayer({
      source: new OSM(),
      visible: true,
    }),
  ],
}) as ExtendedLayerGroup;

const referenceMapReferenceLayersGroup = new ExtendedLayerGroup({
  name: "Reference Layers",
  layers: [],
}) as ExtendedLayerGroup;

const referenceMapGeoreferencingLayersGroup = new ExtendedLayerGroup({
  name: "Georeferencing Layers",
  layers: [],
}) as ExtendedLayerGroup;

const referenceMapLayers = [
  referenceMapBaseMapGroup,
  referenceMapReferenceLayersGroup,
  referenceMapGeoreferencingLayersGroup,
];

export { referenceMapLayers };
