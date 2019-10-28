export default class ShowsModel {
    constructor() {
        this.baseUrl = `http://omdbapi.com/?apikey=2e06cfa&type=series&s=`;
    }

    async fetchShows(showName) {
        const data = await fetch(`${this.baseUrl}${showName}`);
        const response = await data.json();
        console.log(response)
        if (response.Response === "True") {
            this.shows = response.Search;
            const promises = this.shows.map(async show => {
                const detailsUrl = "http://omdbapi.com/?apikey=2e06cfa&i=";
                const data = await fetch(`${detailsUrl}${show.imdbID}`);
                return await data.json();
            })
            const details = await Promise.all(promises);
            this.shows.forEach((show, index) => {
                show.releaseYear = details[index].Year ? details[index].Year.substring(0, 4) : "No data";
                show.status = details[index].Year[4] === "–" && details[index].Year.length === 5 ? "Running" : "Finished";
                show.runtime = details[index].Runtime ? details[index].Runtime : "No data";
                show.rating = details[index].imdbRating ? details[index].imdbRating : "No data";
                show.description = details[index].Plot ? details[index].Plot.substring(0, 100) : "No data";
                show.awards = details[index].Awards != "N/A" ? true : false;
            })
            this.showsToDisplay = [...this.shows];
            return this.showsToDisplay;
        }
        else {
            alert(response.Error);
        }
    }
    getFilteredShows(year, status) {
        let filteredShows = [...this.shows];
        if (year) {
            filteredShows = filteredShows.filter(show => show.releaseYear === year);
        }
        if (status) {
            filteredShows = filteredShows.filter(show => show.status === status)
        }
        this.showsToDisplay = filteredShows;
        return this.showsToDisplay;
    }
    getSortedShows(sortBy) {
        const sortedShows = this.showsToDisplay ? this.showsToDisplay : this.shows;
        console.log(sortBy);
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
            default:
                break;
        }
        return sortedShows;
    }
}