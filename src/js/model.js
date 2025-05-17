import { async } from "regenerator-runtime"
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { getJSON, sendJSON } from "./helpers.js";
export const state = {
    recipe: {},
    search:{
        query: '',
        results: [],
        resultsPerPage : RES_PER_PAGE,
        currentPage: 1,
    },
    bookmarks: new Map()
}
const createRecipeObject = function(recipe){
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        bookmarked: state.bookmarks.has(recipe.id),
        ...(recipe.key && {key: recipe.key})
    }
}
export const loadRecipe = async function(id){
    try{
        //fetch recipe
        const {recipe} = (await getJSON(`${API_URL}${id}?key=${KEY}`)).data;
        //reform recipe
        state.recipe = createRecipeObject(recipe);
    }catch(err){
        throw err;
    }
}
export const loadSearchResults = async function(query){
    try{
        state.search.query = query;
        state.search.currentPage = 1;
        const {recipes} = (await getJSON(`${API_URL}?search=${query}&key=${KEY}`)).data;
        state.search.results = recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && {key: recipe.key})
            };
        });
        state.search.page = 1;
    }catch(err){
        throw err;
    }
}
export const loadSearchResultsPage = function(page = state.search.currentPage){
    state.search.currentPage = page;
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    return state.search.results.slice(start, end);
}
export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ing => {
       if(!ing.quantity) return;
       ing.quantity = ing.quantity * newServings / state.recipe.servings;
    });
    state.recipe.servings = newServings;
}
const saveBookmarks = function(){
    localStorage.setItem('bookmarks', JSON.stringify([...state.bookmarks.values()]))
}
export const addBookmark = function(recipe){
    state.bookmarks.set(recipe.id, recipe);
    if(state.recipe.id === recipe.id)
        state.recipe.bookmarked = true;
    saveBookmarks();
}
export const removeBookmark = function(id){
    if(state.bookmarks.has(id))
        state.bookmarks.delete(id);
    if(state.recipe.id === id)
        state.recipe.bookmarked = false;
    saveBookmarks();
}
const retriveBookmarks = function(){
    const bookmarks = localStorage.getItem('bookmarks');
    if(!bookmarks) return;

    Array.from(JSON.parse(bookmarks)).forEach(recipe => state.bookmarks.set(recipe.id, recipe));
}
export const uploadRecipe = async function(newRecipe){
    const ingredients = Object.entries(newRecipe)
    .filter(entry => entry[0].startsWith('ingredient'))
    .map(ing => {
        const content = ing[1]
        .split(',')
        .map(el => el.trim());
        if(content.length !== 3) return;
        const [quantity, unit, description] = content;
        return {quantity:quantity ?+quantity:null, unit, description};
    })
    .filter(ing => ing !== undefined);
    const recipe = {
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings: +newRecipe.servings,
        ingredients
    }
    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data.data.recipe);
    addBookmark(state.recipe);
}
const init = function(){
    retriveBookmarks();
}
init();