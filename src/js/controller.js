import * as model from "./model";
import "core-js/stable";
// import { async } from 'regenerator-runtime';
import "regenerator-runtime/runtime";

import recipeView from "./view/recipeView";
import searchView from "./view/searchView";
import resultView from "./view/resultView";
import paginationView from "./view/paginationView";
import bookmarksView from "./view/bookmarksView";
import addRecipeView from "./view/addRecipeView";
import { MODAL_CLOSE_SEC } from "./config";

if (module.hot) {
  module.hot.accept();
}

const recipeContainer = document.querySelector(".recipe");

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    //0 update the search element
    resultView.update(model.getSearchResultsPage());

    // 1 updating the bookmark
    bookmarksView.update(model.state.bookmarks);
    recipeView.renderSpinner();
    //  load recipe
    await model.loadRecipe(id);
    // const { recipe } = modal.state;
    // 2 render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(error);
    // alert(error);
    // recipeView.renderError(error);
    // recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //1 get query
    resultView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    //2 load data
    await model.loadSearchResults(query);
    //3 render result
    // console.log(model.state.search);
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultsPage());

    // 4 render initial page
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  //1 render new result
  resultView.render(model.getSearchResultsPage(goToPage));

  //2 render new pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe serving
  model.updateServings(newServings);

  //update the recipe section
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1 add bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // model.addBookmark(model.state.recipe);
  // console.log(model.state.recipe);
  // 2 update recipe view
  recipeView.update(model.state.recipe);

  // 3 render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// const controlAddRecipe = async function (newRecipe) {
//   try {
//     //show loading
//     addRecipeView.renderSpinner();

//     //upload the new recipe
//     await model.uploadRecipe(newRecipe);
//     console.log(model.state.recipe);

//     // Render recipe
//     recipeView.render(model.state.recipe);

//     // Success message
//     addRecipeView.renderMessage();

//     // render bookmark view
//     bookmarksView.render(model.state.bookmarks);

//     //change ID in url
//     window.history.pushState(null, "", `#${model.state.recipe.id}`);

//     // Close form window
//     setTimeout(function () {
//       addRecipeView.toggleWindow();
//     }, MODAL_CLOSE_SEC * 1000);
//   } catch (error) {
//     console.log("🙁  💣", error);
//     addRecipeView.renderError(error.message);
//   }
//   // console.log(newRecipe);
// };

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error("💥", err);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
