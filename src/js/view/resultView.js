import { View } from "./View";
import icons from "url:../../img/icons.svg";
import previewView from "./previewView";

class ResultView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage =
    "No recipe found for your query.Please try again with new query";
  _message = "";

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join("");
  }
  _generateMarkup() {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join("");
  }
}

export default new ResultView();
