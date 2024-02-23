export default function generateIndexLayout() {
  const PARENT = document.body as HTMLBodyElement;

  generateMapImageDivs(PARENT);
  generateDialog(PARENT);
  generateLoadingSpinner(PARENT);
  generateExportDialog(PARENT);
}

function generateMapImageDivs(PARENT: HTMLBodyElement) {
  console.log("Generating map and image divs");
  const REF_MAP_DIV = document.createElement("div");
  REF_MAP_DIV.id = "map";
  REF_MAP_DIV.className =
    "fixed w-1/2 h-full top-0 bottom-0 cursor-crosshair right-0";
  PARENT.appendChild(REF_MAP_DIV);

  const IMAGE_MAP_DIV = document.createElement("div");
  IMAGE_MAP_DIV.id = "img";
  IMAGE_MAP_DIV.className =
    "fixed w-1/2 h-full top-0 bottom-0 cursor-crosshair left-0 border-r border-solid border-blue-500";
  PARENT.appendChild(IMAGE_MAP_DIV);
}

function generateDialog(PARENT: HTMLBodyElement) {
  const DIALOG_CONTAINER = document.createElement("div");
  DIALOG_CONTAINER.id = "dialog-container";
  DIALOG_CONTAINER.className =
    "fixed w-full h-full left-0 right-0 top-0 bottom-0 bg-black bg-opacity-50";
  PARENT.appendChild(DIALOG_CONTAINER);

  const MODAL = document.createElement("div");
  MODAL.id = "modal";
  MODAL.className = "fixed w-full h-full left-0 right-0 top-0 bottom-0";
  DIALOG_CONTAINER.appendChild(MODAL);

  const LOADER_DIV = document.createElement("div");
  LOADER_DIV.id = "loader";
  LOADER_DIV.className =
    "absolute left-1/2 top-20 transform -translate-x-1/2 w-500 bg-white border-3 border-blue-500 rounded-5 px-4 py-4 overflow-hidden transition-all duration-500";
  LOADER_DIV.innerHTML = `<h1>Choose an image</h1>
    Upload a file:
    <input type="file" name="files[]" />
    <br style="clear:both"/>
    <hr/>
    How to use the application: <br>
    <i>
      Click points on the left image and on the right map.
      <br/>
      Alt+click point on the map to remove it.
      <br/>
      Click+drag to move points.
      <hr/>
      Save the map and drag and drop the file to add the georeferenced layer on the map.
    </i>`;
  MODAL.appendChild(LOADER_DIV);
}

function generateLoadingSpinner(PARENT: HTMLBodyElement) {
  const LOADING_SPINNER = document.createElement("div");
  LOADING_SPINNER.id = "loading";
  LOADING_SPINNER.className =
    "fixed w-full h-full left-0 right-0 top-0 bottom-0 bg-black bg-opacity-50 hidden";
  LOADING_SPINNER.innerHTML = `    <div class="inner">
    <h1>
      <i class="fa fa-2x fa-spinner fa-pulse" style="vertical-align:middle; margin-right:0.5em;"></i>
      Loading...
      <img class="preview" />
    </h1>
  </div>`;
  PARENT.appendChild(LOADING_SPINNER);
}

function generateExportDialog(PARENT: HTMLBodyElement) {
  const EXPORT_DIALOG = document.createElement("div");
  EXPORT_DIALOG.id = "export-dialog";
  EXPORT_DIALOG.className =
    "fixed w-full h-full left-0 right-0 top-0 bottom-0 bg-black bg-opacity-50 hidden";
  EXPORT_DIALOG.innerHTML = `    <div class="inner">
    <i class="fa fa-close fa-2x" style="float:right; color:#369; cursor:pointer" onclick="$('#info').addClass('hidden');" ></i>
    <h1>Georef:</h1>
    <textarea style="max-width:100%; min-width:100%; box-sizing:border-box; min-height:12em;"></textarea>
    <button onclick="WAPP.exportMap()" style="float:right;">export Map...</button>
  </div>`;
  PARENT.appendChild(EXPORT_DIALOG);
}
