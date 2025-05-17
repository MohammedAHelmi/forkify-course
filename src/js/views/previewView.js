import icons from 'url:../../img/icons.svg';
import View from './View.js';
class PreviewView extends View{
  _message = '';
  constructor(parentEl, errMsg){
    super();
    this._parentEl = parentEl;
    this._errorMessage = errMsg;
  }
  render(data){
    if(!Array.isArray(data) || data.length === 0)
      return this.renderError();
    super.render(data)
  }
  _generateMarkup(recipes){
    return recipes.map(recipe => this._generateMarkupPreview(recipe)).join('');
  }
  _generateMarkupPreview(recipe){
    const id = window.location.hash.slice(1);
    return `<li class="preview ${id === recipe.id ? 'preview__link--active' : ''}">
      <a class="preview__link" href="#${recipe.id}">
        <figure class="preview__fig">
          <img src="${recipe.image}" alt="${recipe.title}"/>
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${recipe.title}</h4>
          <p class="preview__publisher">${recipe.publisher}</p>
          <div class="preview__user-generated ${recipe.key? '':'hidden'}">
            <svg>
            <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
    </li>`
  }
}
export const resultsView = new PreviewView(document.querySelector('.results'), 'No recipies found for your query! Please try Again :)');
export const bookMarksView = new PreviewView(document.querySelector('.bookmarks__list'), 'No bookmarks yet. Find a nice recipe and bookmark it :)');