//Import external modules

//Import local modules
import startGeoReferencing from "./georeferenceImage";

export default function watchForDataLoad() {
  console.log("Watching for data load.");
  const FILE_INPUT = document.querySelector(
    "input[type=file]"
  ) as HTMLInputElement;
  FILE_INPUT.addEventListener("change", function (event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files) {
      for (let i = 0, file; (file = target.files[i]); i++) {
        //Only process image files.
        if (!file.type.match("image.*")) {
          continue;
        }

        if (FILE_INPUT.files) {
          const IMAGE = FILE_INPUT.files[0];
          const IMAGE_URL = URL.createObjectURL(IMAGE);

          const READER = new FileReader();
          //Onload, capture file information
          loadData(IMAGE, IMAGE_URL);
          // Read in the image file as a data URL.
          READER.readAsDataURL(file);
        }
      }
    }
  });
}

function loadData(IMAGE: File, IMAGE_URL: string) {
  console.log("Loading data.");
  let IMAGE_NAME: string = IMAGE.name.split(`\\`).pop() as string;
  if (IMAGE_NAME) {
    IMAGE_NAME =
      IMAGE_NAME.substring(0, IMAGE_NAME.lastIndexOf(".")) || IMAGE_NAME;
  }
  const DIALOG = document.getElementById("dialog") as HTMLDivElement;
  DIALOG.classList.add("hidden");
  const LOADING = document.getElementById("loading") as HTMLDivElement;
  LOADING.classList.remove("hidden");
  const LOADING_IMG = document.querySelector(
    "#loading img"
  ) as HTMLImageElement;
  LOADING_IMG.src = IMAGE_URL;

  startGeoReferencing(IMAGE_URL, IMAGE_NAME);
}
