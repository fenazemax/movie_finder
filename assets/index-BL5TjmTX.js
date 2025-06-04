var v=Object.defineProperty;var f=(o,t,e)=>t in o?v(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var n=(o,t,e)=>f(o,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function e(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=e(r);fetch(r.href,i)}})();class _{constructor(t,e,s,r,i,l,c){n(this,"_id");n(this,"_title");n(this,"_year");n(this,"_director");n(this,"_genre");n(this,"_poster");n(this,"_plot");this._id=t,this._title=e===""?"Unknown Title":e,this._year=s,this._director=r,this._genre=Array.isArray(i)&&i.length>0?i:["Unknown"],this._poster=l,this._plot=c}getDisplayTitle(){return this.year===""||this.year===void 0||this.year==="0"?`${this.title}`:`${this.title} (${this.year})`}toJSON(){return{id:this.id,title:this.title,year:this.year,director:this.director,genre:this.genre,poster:this.poster,plot:this.plot}}get id(){return this._id}get title(){return this._title}get year(){return this._year}get director(){return this._director}get genre(){return this._genre}get poster(){return this._poster??"default.jpg"}get plot(){return this._plot??"No description available."}}class b{constructor(){n(this,"API_KEY","74ede743");n(this,"BASE_URL","https://www.omdbapi.com/")}async searchMovies(t){const e=`${this.BASE_URL}?apikey=${this.API_KEY}&s=${encodeURIComponent(t)}&type=movie`,r=await(await fetch(e)).json();if(r.Response==="False")return[];const i=r.Search.map(async l=>{const c=`${this.BASE_URL}?apikey=${this.API_KEY}&i=${l.imdbID}`,a=await(await fetch(c)).json();return new _(a.imdbID,a.Title,a.Year,a.Director,a.Genre.split(",").map(h=>h.trim()),a.Poster,a.Plot)});return Promise.all(i)}}class g{constructor(t=[]){n(this,"_movies",[]);this._movies=t}setMovies(t){this._movies=t}getAll(){return[...this._movies]}getById(t){return this._movies.find(e=>e.id===t)}getFilteredMovies(t,e){const s=e||this._movies;return t.reduce((r,i)=>i.apply(r),s)}}class y{static render(t){this.remove();const e=`
      <div class="modal fade show" id="${this.modalId}" tabindex="-1" style="display: block;" aria-modal="true" role="dialog">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content shadow">
            <div class="modal-header">
              <h5 class="modal-title">${t.getDisplayTitle()}</h5>
              <button type="button" class="btn-close" aria-label="Закрыть" id="${this.modalId}-close"></button>
            </div>
            <div class="modal-body d-flex flex-column flex-md-row">
              <img 
                src="${t.poster}" 
                alt="${t.title}" 
                class="img-fluid rounded me-md-4 mb-3 mb-md-0" 
                style="max-width: 300px;">
              <div>
                <p><strong>Режиссёр:</strong> ${t.director}</p>
                <p><strong>Жанры:</strong> ${t.genre.join(", ")}</p>
                <p><strong>Описание:</strong><br>${t.plot}</p>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" id="${this.modalId}-close-footer">Закрыть</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    `,s=document.createElement("div");s.innerHTML=e,document.body.appendChild(s);const r=[document.getElementById(`${this.modalId}-close`),document.getElementById(`${this.modalId}-close-footer`)];for(const i of r)i&&i.addEventListener("click",()=>this.remove())}static remove(){var s;const t=(s=document.getElementById(this.modalId))==null?void 0:s.parentElement,e=document.querySelector(".modal-backdrop");t==null||t.remove(),e==null||e.remove()}}n(y,"modalId","movie-modal");class u{static render(t,e="movie-list"){const s=document.getElementById(e);if(!s)return;if(t.length===0){s.innerHTML='<div class="alert alert-info">Фильмы не найдены</div>';return}const r=new g(t);s.innerHTML=t.map(i=>`
      <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="card h-100 shadow-sm">
          <img 
            src="${i.poster||"https://via.placeholder.com/300x450?text=No+Poster"}" 
            class="card-img-top img-fluid" 
            alt="${i.title}"
            style="height: 400px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${i.getDisplayTitle()}</h5>
            <p class="card-text text-muted">${i.director}</p>
            <div class="mt-auto">
              <span class="badge bg-secondary me-1">${i.genre[0]}</span>
              <button class="btn btn-outline-primary btn-sm mt-2 details-btn" data-id="${i.id}">
                  Подробнее
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join(""),s.addEventListener("click",i=>{const c=i.target.closest(".details-btn");if(!c)return;const d=c.dataset.id;if(!d)return;const a=r.getById(d);a&&y.render(a)})}}class m{constructor(t){n(this,"_genre");this._genre=t}apply(t){return t.filter(e=>e.genre.some(s=>s.toLowerCase().includes(this._genre.toLowerCase())))}}class p{constructor(t){n(this,"_year");this._year=t}apply(t){return t.filter(e=>e.year.toString().includes(this._year))}}function I(o,t){let e;return function(...s){clearTimeout(e),e=setTimeout(()=>o.apply(this,s),t)}}class E{constructor(){n(this,"_searchInput");n(this,"_searchBtn");n(this,"_movieListContainer");n(this,"_sortBtn",null);n(this,"_catalog");n(this,"_sortAsc",!0);n(this,"_controlsDiv");n(this,"_debouncedSearch");this._catalog=new g,this.render(),this._searchInput=document.getElementById("search-input"),this._searchBtn=document.getElementById("search-btn"),this._movieListContainer=document.getElementById("movie-list"),this._controlsDiv=this.createControlContainer(),this._debouncedSearch=I(this.handleDebouncedSearch.bind(this),500),this.setupEvents()}render(){const t=document.getElementById("app");t&&(t.innerHTML=`
          <div class="container py-4">
              <h1 class="text-center mb-4">🍿 Movie Finder</h1>
              <div class="row justify-content-center">
                  <div class="col-md-8">
                      <div class="input-group mb-3">
                          <input 
                          type="text" 
                          id="search-input" 
                          class="form-control" 
                          placeholder="Например: Matrix, Titanic...">
                          <button id="search-btn" class="btn btn-primary">
                              <span id="search-text">Поиск</span>
                              <div id="spinner" class="spinner-border spinner-border-sm d-none"></div>
                          </button>
                      </div>
                  </div>
              </div>
              <div id="movie-list" class="row mt-4"></div>
          </div>
      `)}createControlContainer(){const t=document.createElement("div");return t.className="mb-3 text-center",t.id="controls-container",t}createSortButton(){const t=document.createElement("button");return t.id="sort-year-btn",t.className="btn btn-outline-secondary me-2",t.textContent=this._sortAsc?"Год ↑":"Год ↓",t.addEventListener("click",()=>this.toggleSort()),t}createFilterInputs(){const t=document.createElement("input");t.id="genre-filter",t.placeholder="Жанр",t.className="form-control me-2 mb-2",t.style.width="300px";const e=document.createElement("input");e.id="year-filter",e.placeholder="Год",e.className="form-control me-2",e.style.width="300px";const s=document.createElement("button");return s.id="apply-filters",s.className="btn btn-primary",s.textContent="Применить",{genreInput:t,yearInput:e,applyBtn:s}}showFilters(){const t=document.getElementById("controls-container");t&&t.remove(),this._controlsDiv.innerHTML="",this._sortBtn=this.createSortButton(),this._controlsDiv.appendChild(this._sortBtn);const{genreInput:e,yearInput:s,applyBtn:r}=this.createFilterInputs();this._controlsDiv.appendChild(e),this._controlsDiv.appendChild(s),this._controlsDiv.appendChild(r),document.getElementById("controls-container")||this._movieListContainer.before(this._controlsDiv),r.addEventListener("click",()=>this.applyFilters())}applyFilters(){const t=document.getElementById("genre-filter").value,e=document.getElementById("year-filter").value,s=[];t&&s.push(new m(t)),e&&s.push(new p(e));const r=this._catalog.getFilteredMovies(s);u.render(r)}setupEvents(){this._searchBtn.addEventListener("click",this.handleSearch.bind(this)),this._searchInput.addEventListener("input",()=>this._debouncedSearch()),this._searchInput.addEventListener("keypress",t=>{t.key==="Enter"&&this.handleSearch()})}async handleSearch(){const t=this._searchInput.value.trim();if(!(!t||t.length<3)){this.toggleLoading(!0);try{const e=await new b().searchMovies(t);this._catalog.setMovies(e),this.showFilters(),this.applyCurrentSort(e)}catch(e){this._movieListContainer.innerHTML=`
        <div class="col-12">
          <div class="alert alert-danger">Ошибка при загрузке данных. Проверьте интернет-соединение.</div>
        </div>
      `,console.error(e)}finally{this.toggleLoading(!1)}}}handleDebouncedSearch(){this._searchInput.value.trim().length>=3&&this.handleSearch()}toggleSort(){this._sortAsc=!this._sortAsc,this._sortBtn.textContent=this._sortAsc?"Год ↑":"Год ↓",this.applyCurrentSort(this._catalog.getAll())}applyCurrentSort(t){var c,d;const e=(c=document.getElementById("genre-filter"))==null?void 0:c.value,s=(d=document.getElementById("year-filter"))==null?void 0:d.value,r=[];e&&r.push(new m(e)),s&&r.push(new p(s));const i=[...t].sort((a,h)=>this._sortAsc?Number(a.year)-Number(h.year):Number(h.year)-Number(a.year)),l=r.length>0?this._catalog.getFilteredMovies(r,i):i;u.render(l)}toggleLoading(t){const e=this._searchBtn.querySelector("#spinner"),s=this._searchBtn.querySelector("#search-text");t?(e.classList.remove("d-none"),s.textContent="Загрузка...",this._searchBtn.disabled=!0):(e.classList.add("d-none"),s.textContent="Поиск",this._searchBtn.disabled=!1)}}document.addEventListener("DOMContentLoaded",()=>{new E});
