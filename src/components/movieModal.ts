import { Movie } from "../models/Movie";

export class MovieModal {
  private static modalId = "movie-modal";

  public static render(movie: Movie): void {
    this.remove();

    const modalHtml = `
      <div class="modal fade show" id="${this.modalId}" tabindex="-1" style="display: block;" aria-modal="true" role="dialog">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content shadow">
            <div class="modal-header">
              <h5 class="modal-title">${movie.getDisplayTitle()}</h5>
              <button type="button" class="btn-close" aria-label="Закрыть" id="${this.modalId}-close"></button>
            </div>
            <div class="modal-body d-flex flex-column flex-md-row">
              <img 
                src="${movie.poster}" 
                alt="${movie.title}" 
                class="img-fluid rounded me-md-4 mb-3 mb-md-0" 
                style="max-width: 300px;">
              <div>
                <p><strong>Режиссёр:</strong> ${movie.director}</p>
                <p><strong>Жанры:</strong> ${movie.genre.join(', ')}</p>
                <p><strong>Описание:</strong><br>${movie.plot}</p>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" id="${this.modalId}-close-footer">Закрыть</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    `;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = modalHtml;
    document.body.appendChild(wrapper);

    const closeButtons = [
      document.getElementById(`${this.modalId}-close`),
      document.getElementById(`${this.modalId}-close-footer`)
    ];

    for (const btn of closeButtons) {
      if (btn) btn.addEventListener("click", () => this.remove());
    }
  }

  private static remove(): void {
    const modal = document.getElementById(this.modalId)?.parentElement;
    const backdrop = document.querySelector(".modal-backdrop");

    modal?.remove();
    backdrop?.remove();
  }
}