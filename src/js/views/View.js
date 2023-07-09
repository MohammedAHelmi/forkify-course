import icons from 'url:../../img/icons.svg';
export default class View{
    render(data){
        this._data = data;
        const markup = this._generateMarkup(this._data);
        this._clear();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }
    update(data){
      this._data = data;
      const newMarkup = this._generateMarkup(this._data);
      const newDOM = document.createRange().createContextualFragment(newMarkup);
      
      const newElements = Array.from(newDOM.querySelectorAll('*'));;
      const curElements = Array.from(this._parentEl.querySelectorAll('*'));
      if(newElements.length !== curElements.length) throw new Error('Update unequal DOMs');
      newElements.forEach((newEl, i)=>{
        const curEl = curElements[i];
        //different nodes and the old node contains no empty string
        if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ''){
          curEl.textContent = newEl.textContent;
        }
        if(!newEl.isEqualNode(curEl)){
          Array.from(newEl.attributes).forEach(attr=>{
            curEl.setAttribute(attr.name, attr.value);
          })
        }
      })
    }
    renderSpinner(){
        const markup = `
        <div class="spinner">
            <svg>
            <use href="${icons}#icon-loader"></use>
            </svg>
        </div>`;
        this._clear();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }
    renderError(message = this._errorMessage){
        const markup = `
        <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
      this._clear();
      this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }
    renderMessage(message = this._message){
        const markup = `
        <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
      this._clear();
      this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }
    _clear(){
        this._parentEl.innerHTML = '';
    }
}