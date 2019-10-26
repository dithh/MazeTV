export default class ShowsController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.addFetchShowsListener(this.handleFetchShows.bind(this))
        this.view.addFilterShowsListener(this.handleFilterShows.bind(this));

    }
    handleFetchShows(showName) {
        this.model.fetchShows(showName).then(shows => {
            console.log(shows);
            if (shows) {
                this.view.displayShows(shows);
            }
        })
    }
    handleFilterShows(year, status) {
        this.view.displayFilteredShows(this.model.getFilteredShows(year, status));
    }
}