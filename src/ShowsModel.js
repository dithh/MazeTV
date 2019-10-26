export default class ShowsModel {
    constructor() {
        this.baseUrl = `http://omdbapi.com/?apikey=2e06cfa&type=series&s=`
    }

    fetchShows(showName) {
        return fetch(`${this.baseUrl}${showName}`).then(response => response.json().then(data => {
            ///Check if the search was successful - sadly Response  is string not a Boolean 
            if (data.Response === "True") {
                this.shows = data.Search;
                this.shows.forEach(show => {
                    show.releaseYear = show.Year ? show.Year.substring(0, 4) : "Unknown";
                    show.status = show.Year[4] === "–" && show.Year.length === 5 ? "Running" : "Finished";
                })
                console.log(this.shows);
                return this.shows;
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
        return filteredShows;
    }
}