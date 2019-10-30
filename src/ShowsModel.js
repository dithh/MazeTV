export default class ShowsModel {
    constructor() {
        this.pageToFetch = 1;
        this.baseUrl = `http://omdbapi.com/?apikey=2e06cfa&type=series&s=`;
    }

    async fetchShows(showName) {
        this.pageToFetch = 1;
        this.showName = showName;
        const data = await fetch(`${this.baseUrl}${showName}&page=${this.pageToFetch}`);
        const response = await data.json();
        if (response.Response === "True") {
            this.shows = response.Search;
            this.totalResults = response.totalResults;
            if (this.shows.length < this.totalResults) {
                this.pageToFetch = 2;
                const data = await fetch(`${this.baseUrl}${this.showName}&page=${this.pageToFetch}`);
                const response = await data.json();
                this.shows = this.shows.concat(response.Search);
            }
            const promises = this.shows.map(async show => {
                const detailsUrl = "http://omdbapi.com/?apikey=2e06cfa&i=";
                const data = await fetch(`${detailsUrl}${show.imdbID}`);
                return await data.json();
            })
            const details = await Promise.all(promises);
            this.shows.forEach((show, index) => {
                this.fetchShowDetails(show, index, details);
            })
            return this.shows.slice(0, 12);
        }
        else {
            alert(response.Error);
        }
    }

    async fetchNextPage() {
        const firstIndexToReturn = 12;

        if (this.shows.length >= this.totalResults - 1) {
            let showsToDisplay;
            showsToDisplay = [...this.shows];
            if (this.yearFilter) {
                showsToDisplay = showsToDisplay.filter(show => show.year === this.yearFilter);
            }
            if (this.ratingFilter) {
                showsToDisplay = this.filterShowsByRating(showsToDisplay, this.ratingFilter);
            }
            return showsToDisplay.slice(firstIndexToReturn);
        }
        this.pageToFetch += 1;
        const data = await fetch(`${this.baseUrl}${this.showName}&page=${this.pageToFetch}`);
        const response = await data.json();
        if (response.Response === "True") {
            const shows = response.Search;
            let showsToDisplay = [...this.shows];
            const promises = shows.map(async show => {
                const detailsUrl = "http://omdbapi.com/?apikey=2e06cfa&i=";
                const data = await fetch(`${detailsUrl}${show.imdbID}`);
                return await data.json();
            })
            const details = await Promise.all(promises);
            shows.forEach((show, index) => {
                this.fetchShowDetails(show, index, details);
            })
            this.shows = this.shows.concat(shows);
            if (this.yearFilter) {
                showsToDisplay = showsToDisplay.filter(show => show.year === this.yearFilter);
            }
            if (this.ratingFilter) {
                showsToDisplay = this.filterShowsByRating(showsToDisplay, this.ratingFilter);
            }
            return showsToDisplay.slice(firstIndexToReturn, firstIndexToReturn + 12);

        }
    }

    fetchShowDetails(show, index, details) {
        show.releaseYear = details[index].Year ? details[index].Year.substring(0, 4) : "No data";
        show.status = details[index].Year[4] === "–" && details[index].Year.length === 5 ? "Running" : "Finished";
        show.runtime = details[index].Runtime ? details[index].Runtime : "No data";
        show.rating = details[index].imdbRating ? details[index].imdbRating : "No data";
        if (details[index].Plot) {
            show.description = details[index].Plot.length > 100 ? details[index].Plot.substring(0, 97).padEnd(100, ".") : details[index].Plot;
        }
        else {
            show.description = "No data";
        }
        show.awards = details[index].Awards != "N/A" ? true : false;
    }

    getFilteredShows(year, rating) {
        let filteredShows = [...this.shows];
        if (year) {
            this.yearFilter = year;
            filteredShows = this.filterShowsByYear(filteredShows, year);
        }
        if (rating) {
            this.ratingFilter = rating;
            filteredShows = this.filterShowsByRating(filteredShows, rating);
        }
        const showsToDisplay = [...filteredShows];
        return showsToDisplay;
    }

    filterShowsByYear(shows, year) {
        return shows.filter(show => show.releaseYear === year)
    }

    filterShowsByRating(shows, rating) {
        let filteredShows = [...shows];
        this.ratingFilter = rating;
        switch (rating) {
            case "1":
                filteredShows = filteredShows.filter(show => parseFloat(show.rating) <= 3.9)
                break;
            case "2":
                filteredShows = filteredShows.filter(show => (4 <= parseFloat(show.rating)) && (parseFloat(show.rating) <= 6.9))
                break;
            case "3":
                filteredShows = filteredShows.filter(show => (7 <= parseFloat(show.rating)) && (parseFloat(show.rating) <= 8.9))
                break;
            case "4":
                filteredShows = filteredShows.filter(show => parseFloat(show.rating) > 8.9)
                break;
        }
        return filteredShows;
    }

    getSortedShows(sortBy) {
        let sortedShows = [...this.shows]
        if (this.yearFilter) {
            sortedShows = sortedShows.filter(show => show.year === this.yearFilter);
        }
        if (this.ratingFilter) {
            sortedShows = this.filterShowsByRating(sortedShows, this.ratingFilter);
        }
        this.sortBy = sortBy;
        switch (sortBy) {
            case "releaseYearAscending":
                sortedShows.sort((a, b) => {
                    return a.releaseYear - b.releaseYear;
                })
                break;
            case "releaseYearDescending":
                sortedShows.sort((a, b) => {
                    return b.releaseYear - a.releaseYear;
                })
                break;
            case "titleAscending":
                sortedShows.sort((a, b) => a.Title.localeCompare(b.Title))
                break;
            case "titleDescending":
                sortedShows.sort((a, b) => b.Title.localeCompare(a.Title))
                break;
            case "ratingAscending":
                sortedShows.sort((a, b) => a.rating - b.rating)
                break;
            case "ratingDescending":
                sortedShows.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }
        return sortedShows;
    }
}