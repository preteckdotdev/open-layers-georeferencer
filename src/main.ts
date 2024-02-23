//Import styles
import "./style.css";

//Import external modules

//Import local modules
import generateLayout from "./layout/layout";
import watchForDataLoad from "./components/loadData";
import createMaps from "./components/createMaps";

function startApplication() {
  console.log("Application initiated");
  generateLayout();
  watchForDataLoad();
  createMaps();
}

startApplication();
