export default class View {
    constructor() {
        this.showsContainer = document.querySelector("#shows-container");
        this.input = document.querySelector("#show-name-input");
        this.searchButton = document.querySelector("#search-button");
        this.statusSelect = document.querySelector("#status-select");
        this.yearSelect = document.querySelector("#year-select");
        this.sortSelect = document.querySelector("#sort-select");
    }

    displayShows(shows) {
        const airingYearsArray = [];

        if (this.sortSelect.value) {
            shows.sort((a, b) => {
                if (this.sortSelect.value === "releaseYear") {
                    return a[this.sortSelect.value] - b[this.sortSelect.value];
                }
                else {
                    return a.Title.localeCompare(b[this.sortSelect.value])
                }
            })
        }
        shows.forEach(show => {
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

    displayFilteredShows(shows) {
        this.cleanShowsContainer();
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
        const runtimeText = show.Year ? show.Year : 'Airing date unkown'
        card.classList.add("card");
        title.classList.add("card__title");
        status.classList.add("card__details");
        rating.classList.add("card__details");
        runtime.classList.add("card__details");
        releaseYear.classList.add("card__details");
        description.classList.add("card__description");
        image.src = imageSrc;
        title.innerText = show.Title;
        status.innerText = `Status: ${show.status}`;
        rating.innerText = show.Rating ? show.rating.average : "Average rating unknown";
        releaseYear.innerText = `Released: ${show.releaseYear}`;
        runtime.innerText = `Runtime: ${runtimeText} `;
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
        return this.input.value
    }

    addFetchShowsListener(handler) {
        this.searchButton.addEventListener("click", () => handler(this.getShowName())
        )
    }
    addFilterShowsListener(handler) {
        this.yearSelect.addEventListener("change", () => handler(this.yearSelect.value, this.statusSelect.value));
        this.statusSelect.addEventListener("change", () => handler(this.yearSelect.value, this.statusSelect.value));
    }
    addSortShowsListener(handler) {
        this.sortSelect.addEventListener("change", handler);
    }

}