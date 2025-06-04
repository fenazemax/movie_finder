
import { MovieService } from "../services/MovieService";
import { MovieList } from "./MovieList";
import { MovieCatalog } from "../models/MovieCatalog";
import { GenreFilter, YearFilter } from "../models/Filter";
import { Movie } from "../models/Movie";
import type { IFilter } from "../models/Filter";
import { debounce } from "../utils/debounce";

export class SearchBar {
  private _searchInput: HTMLInputElement
  private _searchBtn: HTMLButtonElement 
  private _movieListContainer: HTMLElement 
  private _sortBtn: HTMLButtonElement | null = null;
  private _catalog: MovieCatalog;
  private _sortAsc = true;
  private _controlsDiv: HTMLDivElement;
  private _debouncedSearch: () => void;

  constructor() {
    this._catalog = new MovieCatalog();
    this.render();
    this._searchInput = document.getElementById("search-input") as HTMLInputElement;
    this._searchBtn = document.getElementById("search-btn") as HTMLButtonElement;
    this._movieListContainer = document.getElementById("movie-list") as HTMLElement;
    this._controlsDiv = this.createControlContainer();
    this._debouncedSearch = debounce(this.handleDebouncedSearch.bind(this), 500);
    this.setupEvents();
  }

  private render(): void {
      const app = document.getElementById('app');
      if (!app) return
      app.innerHTML = `
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
      `;
  }

  public createControlContainer(): HTMLDivElement {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'mb-3 text-center';
    controlsDiv.id = 'controls-container';
    return controlsDiv;
  }

  public createSortButton(): HTMLButtonElement {
    const sortBtn = document.createElement('button');
    sortBtn.id = 'sort-year-btn';
    sortBtn.className = 'btn btn-outline-secondary me-2';
    sortBtn.textContent = this._sortAsc ? 'Год ↑' : 'Год ↓';
    sortBtn.addEventListener('click', () => this.toggleSort());
    return sortBtn;
  }

  
  private createFilterInputs(): {
    genreInput: HTMLInputElement,
    yearInput: HTMLInputElement,
    applyBtn: HTMLButtonElement
  } {
    const genreInput = document.createElement('input');
    genreInput.id = 'genre-filter';
    genreInput.placeholder = 'Жанр';
    genreInput.className = 'form-control me-2 mb-2'
    genreInput.style.width = '300px';

    const yearInput = document.createElement('input');
    yearInput.id = 'year-filter';
    yearInput.placeholder = 'Год';
    yearInput.className = 'form-control me-2';
    yearInput.style.width = '300px';

    const applyBtn = document.createElement('button');
    applyBtn.id = 'apply-filters';
    applyBtn.className = 'btn btn-primary';
    applyBtn.textContent = 'Применить';

    return { genreInput, yearInput, applyBtn };
  }

  public showFilters(): void {
    const existingControls = document.getElementById('controls-container');
    if (existingControls) existingControls.remove();
    this._controlsDiv.innerHTML = '';
    this._sortBtn = this.createSortButton(); 
    this._controlsDiv.appendChild(this._sortBtn);
    
    const { genreInput, yearInput, applyBtn } = this.createFilterInputs();
    this._controlsDiv.appendChild(genreInput);
    this._controlsDiv.appendChild(yearInput);
    this._controlsDiv.appendChild(applyBtn);
    
    if (!document.getElementById('controls-container')) {
        this._movieListContainer.before(this._controlsDiv);
    }

    applyBtn.addEventListener('click', () => this.applyFilters());
  }

  private applyFilters(): void {
    const genre = (document.getElementById('genre-filter') as HTMLInputElement).value;
    const year = (document.getElementById('year-filter') as HTMLInputElement).value;

    const filters: IFilter[] = [];
    if (genre) filters.push(new GenreFilter(genre));
    if (year) filters.push(new YearFilter(year));

    const filteredMovies = this._catalog.getFilteredMovies(filters);
    MovieList.render(filteredMovies);
  }
  
  private setupEvents(): void {
    this._searchBtn.addEventListener("click", this.handleSearch.bind(this));
    this._searchInput.addEventListener("input", () => this._debouncedSearch());
    this._searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleSearch();
    });
  }

  private async handleSearch(): Promise<void> {
    const query = this._searchInput.value.trim();
    if (!query || query.length < 3) return;

    this.toggleLoading(true);
    try {
      const movies = await new MovieService().searchMovies(query);
      this._catalog.setMovies(movies);
      this.showFilters();
      this.applyCurrentSort(movies);
    } catch (error) {
      this._movieListContainer.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger">Ошибка при загрузке данных. Проверьте интернет-соединение.</div>
        </div>
      `;
      console.error(error);
    } finally {
      this.toggleLoading(false);
    }
  }
  
   private handleDebouncedSearch(): void {
    const query = this._searchInput.value.trim();
    if (query.length >= 3) {
      this.handleSearch();
    }
  }

  private toggleSort(): void {
    this._sortAsc = !this._sortAsc;
    this._sortBtn!.textContent = this._sortAsc ? 'Год ↑' : 'Год ↓';
    this.applyCurrentSort(this._catalog.getAll());
  }

  private applyCurrentSort(movies: Movie[]): void {
    const genre = (document.getElementById('genre-filter') as HTMLInputElement)?.value;
    const year = (document.getElementById('year-filter') as HTMLInputElement)?.value;
    const filters: IFilter[] = [];
    if (genre) filters.push(new GenreFilter(genre));
    if (year) filters.push(new YearFilter(year));
    
    const sorted = [...movies].sort((a, b) => 
        this._sortAsc 
            ? Number(a.year) - Number(b.year) 
            : Number(b.year) - Number(a.year)
    );

    const result = filters.length > 0 ? this._catalog.getFilteredMovies(filters, sorted) : sorted;
    MovieList.render(result);
  }

  private toggleLoading(isLoading: boolean): void {
    const spinner = this._searchBtn.querySelector("#spinner") as HTMLElement;
    const text = this._searchBtn.querySelector("#search-text") as HTMLElement;

    if (isLoading) {
      spinner.classList.remove("d-none");
      text.textContent = "Загрузка...";
      this._searchBtn.disabled = true;
    } else {
      spinner.classList.add("d-none");
      text.textContent = "Поиск";
      this._searchBtn.disabled = false;
    }
  }
}
