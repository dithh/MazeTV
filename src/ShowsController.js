export default class ShowsController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.addFetchShowsListener(this.handleFetchShows.bind(this))
        this.view.addFilterShowsListener(this.handleFilterShows.bind(this));
        this.view.addSortShowsListener(this.handleSortShows.bind(this))

    }
    handleFetchShows(showName) {
        this.model.fetchShows(showName).then(shows => {
            console.log(shows);
            if (shows) {
                this.view.cleanShowsContainer();
                this.view.cleanYearsSelect();
                this.view.displayShows(shows);
            }
        })
    }
    handleFilterShows(year, status) {
        this.view.cleanShowsContainer();
        this.view.displayFilteredShows(this.model.getFilteredShows(year, status));
    }
    handleSortShows(event) {
        this.view.displayFilteredShows(this.model.getSortedShows(event.target.value))
    }
}