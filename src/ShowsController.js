export default class ShowsController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.addFetchShowsListener(this.handleFetchShows.bind(this))
        this.view.addFilterShowsListener(this.handleFilterShows.bind(this));
        this.view.addSortShowsListener(this.handleSortShows.bind(this))
        this.view.addLoadNextPageListener(this.handleLoadNextPage.bind(this))


    }
    handleFetchShows(showName) {
        this.model.fetchShows(showName).then(shows => {
            console.log(shows);
            this.view.cleanShowsContainer();
            this.view.cleanYearsSelect();
            this.view.displayShows(shows);
        })
    }
    handleFilterShows(year, rating) {
        this.view.cleanShowsContainer();
        this.view.displayFilteredShows(this.model.getFilteredShows(year, rating));
    }
    handleSortShows(event) {
        this.view.cleanShowsContainer();
        this.view.displayFilteredShows(this.model.getSortedShows(event.target.value))
    }
    async handleLoadNextPage() {
        if (window.pageYOffset + window.innerHeight > document.body.offsetHeight) {
            if (!this.isLoading) {
                this.isLoading = true;
                const shows = await this.model.fetchNextPage();
                this.view.displayShows(shows)
                this.isLoading = false;
            }
        }
    }
}