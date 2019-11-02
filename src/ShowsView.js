export default class View {
    constructor() {
        this.showsContainer = document.querySelector("#shows-container");
        this.searchInput = document.querySelector("#show-name-input");
        this.searchButton = document.querySelector("#search-button");
        this.yearSelect = document.querySelector("#year-select");
        this.sortSelect = document.querySelector("#sort-select");
        this.ratingSelect = document.querySelector("#rating-select");
        this.warningContainer = document.querySelector("#warning-container")
    }

    displayShows(shows) {
        if (shows) {
            const airingYearsArray = [];
            shows.forEach((show) => {
                if (show.Year) {
                    const showReleaseYear = show.Year.substring(0, 4);
                    if (!airingYearsArray.includes(showReleaseYear)) {
                        airingYearsArray.push(showReleaseYear);
                    }
                }
                this.renderShowCard(show);
            })
            airingYearsArray.sort((a, b) => a - b).forEach(year => {
                const option = document.createElement("option");
                option.value = year;
                option.innerText = year
                this.yearSelect.appendChild(option);
            })
        }
        else if (!this.warningContainer.lastChild) {
            const h1 = document.createElement("h1");
            h1.innerText = "No more Results";
            this.warningContainer.append(h1);
        }

    }

    displayFilteredShows(shows) {
        shows.forEach(show => {
            this.renderShowCard(show)
        })
    }

    cleanShowsContainer() {
        while (this.showsContainer.firstChild) {
            this.showsContainer.removeChild(this.showsContainer.firstChild)
        }
    }

    cleanYearsSelect() {
        while (this.yearSelect.lastChild && this.yearSelect.lastChild.value) {
            this.yearSelect.removeChild(this.yearSelect.lastChild);
        }
    }


    renderShowCard(show) {
        const card = document.createElement("div");
        const title = document.createElement("h2");
        const status = document.createElement("p");
        const rating = document.createElement("p");
        const releaseYear = document.createElement("p");
        const runtime = document.createElement("p");
        const image = new Image(250, 250);
        const description = document.createElement("p");
        const imageSrc = show.Poster !== "N/A" ? show.Poster : "../src/static/assets/500x735.png";
        card.classList.add("card");
        title.classList.add("card__title");
        status.classList.add("card__details");
        rating.classList.add("card__details");
        runtime.classList.add("card__details");
        releaseYear.classList.add("card__details");
        description.classList.add("card__description");
        if (show.awards) {
            card.classList.add("card--winner")
        }
        image.src = imageSrc;
        title.innerText = show.Title;
        status.innerText = `Status: ${show.status}`;
        rating.innerText = `Rating:${show.rating}`
        releaseYear.innerText = `Released: ${show.releaseYear}`;
        runtime.innerText = `Runtime: ${show.runtime} `;
        description.innerText = show.description;
        card.append(image);
        card.appendChild(title);
        card.appendChild(status)
        card.appendChild(rating);
        card.appendChild(releaseYear)
        card.appendChild(runtime);
        card.appendChild(description);
        this.showsContainer.appendChild(card);

    }

    getShowName() {
        return this.searchInput.value
    }

    cleanNoMoreResultsWarning() {
        while (this.warningContainer.lastChild) {
            this.warningContainer.removeChild(this.warningContainer.lastChild);
        }
    }

    addFetchShowsListener(handler) {
        this.searchButton.addEventListener("click", () => {
            handler(this.getShowName());
            this.sortSelect.value = "";
            this.ratingSelect.value = "";
        }
        )
        this.searchInput.addEventListener("keypress", (event) => {
            if (event.keyCode == 13) {
                handler(this.getShowName());
                this.sortSelect.value = "";
                this.ratingSelect.value = "";
            }
        }
        )
    }
    addFilterShowsListener(handler) {
        this.yearSelect.addEventListener("change", () => handler(this.yearSelect.value, this.ratingSelect.value));
        this.ratingSelect.addEventListener("change", () => handler(this.yearSelect.value, this.ratingSelect.value))
    }
    addSortShowsListener(handler) {
        this.sortSelect.addEventListener("change", handler);
    }
    addLoadNextPageListener(handler) {
        window.addEventListener("scroll", () => {
            this.sortSelect.value = ""
            handler()
        });
    }


}