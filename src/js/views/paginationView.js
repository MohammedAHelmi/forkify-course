import icons from 'url:../../img/icons.svg';
import View from './View.js'
class PaginationView extends View{
    _parentEl = document.querySelector('.pagination');
    addHandlerClick(handler){
        this._parentEl.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;
            handler(+btn.dataset.goto);
        });
    }
    _generateMarkup(state){
        const currentPage = state.search.currentPage;
        const pageCnt = Math.ceil(state.search.results.length / state.search.resultsPerPage);
        let markup = '';
        // 1) there are previous pages
        if(currentPage > 1)
           markup += this._generateBtnMarkup(currentPage - 1, false);
        // 2) there are next pages
        if(currentPage < pageCnt)
            markup += this._generateBtnMarkup(currentPage + 1, true);
        return markup;
    }
    _generateBtnMarkup(page, next){
        const arrow = `<svg class="search__icon">
                        <use href="${icons}#icon-arrow-${next? 'right': 'left'}"></use>
                        </svg>`;
        const pg = `<span>Page ${page}</span>`;
        return `<button data-goto = ${page} class="btn--inline pagination__btn--${next? 'next': 'prev'}">
                 ${next ? pg.concat(arrow) : arrow.concat(pg)} 
                </button>`
    }
}
export default new PaginationView();