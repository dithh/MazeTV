export default class ShowsModel {
    constructor() {
        this.baseUrl = `http://omdbapi.com/?apikey=2e06cfa&type=series&s=`
    }

    fetchShows(showName) {
        return fetch(`${this.baseUrl}${showName}`).then(response => response.json().then(data => {
            ///Check if the search was successful - sadly Response  is string not a Boolean 
            if (data.Response === "True") {
                this.shows = data.Search;
                this.showsToDisplay = [...this.shows]
                this.shows.forEach(show => {
                    show.releaseYear = show.Year ? show.Year.substring(0, 4) : "Unknown";
                    show.status = show.Year[4] === "–" && show.Year.length === 5 ? "Running" : "Finished";
                })
                return this.showsToDisplay;
            }
            else {
                alert(data.Error);
            }
        }))
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
            default:
                break;
        }
        return sortedShows;
    }
}