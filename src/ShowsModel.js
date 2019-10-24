export default class ShowsModel {
    constructor() {
        this.baseUrl = "http://api.tvmaze.com/search/shows?q="
    }
    // fetchShows(showName) {
    //     return fetch(`${this.baseUrl}${showName}`).then((response) => {
    //         return response.json().then(data => {
    //             this.shows = data;
    //         })
    //     }).catch(error => {
    //         console.log(error);
    //     })
    // }

    fetchShows(showName) {
        return fetch(`${this.baseUrl}${showName}`)
    }
}