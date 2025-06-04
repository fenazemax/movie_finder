import { Movie } from "./Movie";
import type { IFilter } from "./Filter";

export class MovieCatalog {
    private _movies: Movie[] = [];

    constructor(movies: Movie[] = []) {
        this._movies = movies;
    }

    public setMovies(movies: Movie[]): void {
        this._movies = movies;
    }
    
    public getAll(): Movie[] {
        return [...this._movies];
    }

    public getById(id: string | number): Movie | undefined {
        return this._movies.find(movie => movie.id === id);
    }

    public getFilteredMovies(filters: IFilter[], sourceMovies?: Movie[]): Movie[] {
        const source = sourceMovies || this._movies 
        return filters.reduce((result, filter) => filter.apply(result), source);
    }
}