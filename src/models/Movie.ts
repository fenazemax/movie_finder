interface IMovie { 
    id: string;
    title: string;
    year: string;
    director: string
    genre: string[];
    poster?: string;
    plot?: string
}

export class Movie implements IMovie {
    private _id: string;
    private _title: string;
    private _year: string; 
    private _director: string
    private _genre: string[];
    private _poster?: string;
    private _plot?: string

    constructor(id: string, title: string, year: string, director: string, genre: string[], poster?: string, plot?: string) {
        this._id = id;
        this._title = title === '' ? 'Unknown Title' : title;
        this._year = year;
        this._director = director;
        this._genre = Array.isArray(genre) && genre.length > 0 ? genre : ['Unknown'];
        this._poster = poster;
        this._plot = plot;
    }

    public getDisplayTitle(): string {
        if (this.year === '' || this.year === undefined || this.year === '0') {
            return `${this.title}`
        } else return `${this.title} (${this.year})`
    }

    public toJSON(): IMovie {
        return {
            id: this.id,
            title: this.title,
            year: this.year,
            director: this.director,
            genre: this.genre,
            poster: this.poster,
            plot: this.plot
        };
    }

    public get id() : string {
        return this._id
    }
    
    public get title() : string {
        return this._title
    }

    
    public get year() : string {
        return this._year
    }
    
    public get director(): string {
        return this._director
    }
    
    
    public get genre() : string[] {
        return this._genre
    }
    
    public get poster(): string | undefined {
        return this._poster ?? 'default.jpg'
    }

    public get plot(): string {
        return this._plot ?? 'No description available.'
    }
}
