import { Movie } from "../models/Movie";
import { MovieCatalog } from "../models/MovieCatalog";
import { MovieModal } from "./movieModal";

export class MovieList {
    static render(movies: Movie[], containerId: string = 'movie-list'): void {
      const container = document.getElementById(containerId);
      if (!container) return

      if (movies.length === 0) {
          container.innerHTML = `<div class="alert alert-info">Фильмы не найдены</div>`;
          return
      }

      const catalog = new MovieCatalog(movies);

      container.innerHTML = movies.map(movie => `
      <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="card h-100 shadow-sm">
          <img 
            src="${movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster'}" 
            class="card-img-top img-fluid" 
            alt="${movie.title}"
            style="height: 400px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${movie.getDisplayTitle()}</h5>
            <p class="card-text text-muted">${movie.director}</p>
            <div class="mt-auto">
              <span class="badge bg-secondary me-1">${movie.genre[0]}</span>
              <button class="btn btn-outline-primary btn-sm mt-2 details-btn" data-id="${movie.id}">
                  Подробнее
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join("");

    container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const button = target.closest<HTMLButtonElement>('.details-btn');
      if (!button) return;
      const movieId = button.dataset.id;
      if (!movieId) return
      const movie = catalog.getById(movieId);
      if (!movie) return
      MovieModal.render(movie)
    })
  }
}