import icons from 'url:../../img/icons.svg';
import { numberToFraction } from '../helpers.js';
import View from './View.js';
class RecipeView extends View{
    _parentEl = document.querySelector('.recipe');
    _data;
    _errorMessage = 'Failed to get receipe. Please try another one!';
    _message = '';
    render(data){
        if(!data)
          return this.renderError();
        super.render(data)
      }
    addHandlerRender(handler){
        ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
    }
    addHandlerServings(handler){
        this._parentEl.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--update-servings');
            if(!btn) return;
            handler(+btn.dataset.updateTo);
        });
    }
    addHandlerBookmarks(handler){
        this._parentEl.addEventListener('click', function(e){
            if(!e.target.closest('.btn--round'))
                return;
            handler();
        });
    }
    _generateMarkup(data){
        const markup = `
        <figure class="recipe__fig">
        <img src="${data.image}" alt="${data.title}" class="recipe__img" />
        <h1 class="recipe__title">
            <span>${data.title}</span>
        </h1>
        </figure>

        <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${data.cookingTime}</span>
            <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${data.servings}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
            <button data-update-to = ${data.servings - 1} class="btn--tiny btn--update-servings">
                <svg>
                <use href="${icons}#icon-minus-circle"></use>
                </svg>
            </button>
            <button  data-update-to = ${data.servings + 1}  class="btn--tiny btn--update-servings">
                <svg>
                <use href="${icons}#icon-plus-circle"></use>
                </svg>
            </button>
            </div>
        </div>

        <div class="recipe__user-generated ${data.key? '':'hidden'}">
            <svg>
                <use href="${icons}#icon-user"></use>
            </svg>
        </div>
        <button class="btn--round">
            <svg class="">
            <use href="${icons}#icon-bookmark${data.bookmarked?'-fill':''}"></use>
            </svg>
        </button>
        </div>

        <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
            ${data.ingredients.map(ing => this._generateMarkupIngredient(ing)).join('')}
        </ul>
        </div>

        <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${data.publisher}</span>. Please check out
            directions at their website.
        </p>
        <a
            class="btn--small recipe__btn"
            href="${data.sourceUrl}"
            target="_blank"
        >
            <span>Directions</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </a>
        </div>`;
        return markup;
    }
    _generateMarkupIngredient(ing){
        return `<li class="recipe__ingredient">
                    <svg class="recipe__icon">
                    <use href="${icons}#icon-check"></use>
                    </svg>
                    <div class="recipe__quantity">${ing.quantity ? numberToFraction(ing.quantity) : ''}</div>
                    <div class="recipe__description">
                    <span class="recipe__unit">${ing.unit}</span>
                    ${ing.description}
                    </div>
                </li>`;
    }
}
export default new RecipeView();