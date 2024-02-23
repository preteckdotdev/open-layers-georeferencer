//Import styles
import "./style.css";

//Import external modules

//Import local modules
import generateLayout from "./layout/layout";
import watchForDataLoad from "./components/loadData";

function startApplication() {
  console.log("Application initiated");
  generateLayout();
  watchForDataLoad();
}

startApplication();
