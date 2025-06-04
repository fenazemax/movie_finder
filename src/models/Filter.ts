import { Movie } from "./Movie";

export interface IFilter {
    apply(movies: Movie[]): Movie[];
}

export class TitleFilter implements IFilter{
    private readonly _query: string;

    constructor(query: string) {
        this._query = query;
    }

    apply(movies: Movie[]): Movie[] {
        return movies.filter(movie => movie.title.toLowerCase().includes(this._query.toLowerCase()));
    }
}

export class GenreFilter implements IFilter {
    private readonly _genre: string;

    constructor(genre: string) {
        this._genre = genre;
    }

    apply(movies: Movie[]): Movie[] {
        return movies.filter(movie => movie.genre.some(g => g.toLowerCase().includes(this._genre.toLowerCase())));
    }
}

export class YearFilter implements IFilter {
    private readonly _year: string;

    constructor(year: string) {
        this._year = year;
    }

    apply(movies: Movie[]): Movie[] {
        return movies.filter(movie => movie.year.toString().includes(this._year));
    }
}

