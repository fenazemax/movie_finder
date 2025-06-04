import { Movie } from "../models/Movie";

export class MovieService {
    private readonly API_KEY = '74ede743';
    private readonly BASE_URL = 'https://www.omdbapi.com/';

    public async searchMovies(query: string): Promise<Movie[]> {
        const url = `${this.BASE_URL}?apikey=${this.API_KEY}&s=${encodeURIComponent(query)}&type=movie`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.Response === 'False') {
            return [];
        };

        const moviePromises = data.Search.map(async (item: any) => {
            const detailedUrl = `${this.BASE_URL}?apikey=${this.API_KEY}&i=${item.imdbID}`;
            const detailedRes = await fetch(detailedUrl);
            const detailedData = await detailedRes.json();
            return new Movie(
                detailedData.imdbID,
                detailedData.Title,
                detailedData.Year,
                detailedData.Director,
                detailedData.Genre.split(',').map((g: string) => g.trim()),
                detailedData.Poster,
                detailedData.Plot
            )
        })
        return Promise.all(moviePromises);
    }
}