import * as model from './model.js'
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js';
import {resultsView, bookMarksView} from './views/previewView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// if(module.hot){
//   module.hot.accept();
// }
const controlRecipes = async function(){
  try{
    //get recipe id from url
    const id = window.location.hash.slice(1);
    if(!id) return;
    //shade the recipe from results (if no results no thing happens)
    resultsView.update(model.loadSearchResultsPage());
    //loading spinner
    recipeView.renderSpinner();
    // get the pizza
    await model.loadRecipe(id);
    //building html and adding it to page
    recipeView.render(model.state.recipe);
    //updateing bookmarks
    bookMarksView.update([...model.state.bookmarks.values()]);
  }catch(err){
    if(err.message === 'Update unequal DOMs')
      bookMarksView.render([...model.state.bookmarks.values()]);
    else{
      recipeView.renderError();
    }
  }
};
const renderNewPage = function(page){
  resultsView.render(model.loadSearchResultsPage(page));
  paginationView.render(model.state);
}
const controlSearchResults = async function(){
  try{
    // 1) Get search query
    const query = searchView.getQuery();
    if(!query) return;
    
    // 2) Load search results
    resultsView.renderSpinner();
    await model.loadSearchResults(query);

    // 3) Render results
    renderNewPage(1);
  }catch(err){
    console.error(err.message);
  }
}
const controlServings = function(newServings){
  if(newServings < 1) return;
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
}
const controlBookmarks = function(){
  if(model.state.recipe.bookmarked)
    model.removeBookmark(model.state.recipe.id);
  else  model.addBookmark(model.state.recipe); 
  recipeView.update(model.state.recipe);
  bookMarksView.render([...model.state.bookmarks.values()]);
}
const controlAddRecipe = async function(data){
  try{
    await model.uploadRecipe(data);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    recipeView.render(model.state.recipe);
    bookMarksView.render([...model.state.bookmarks.values()]);
    addRecipeView.renderMessage();
  }catch(err){
    addRecipeView.renderError(err.message);
  }
  finally{
    setTimeout(function(){
      addRecipeView.toggleWindow();
      addRecipeView.render(undefined, true);
    }, MODAL_CLOSE_SEC * 1000);
  }
}
const init = function(){
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmarks(controlBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(renderNewPage);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  bookMarksView.render([...model.state.bookmarks.values()]);
}
init();