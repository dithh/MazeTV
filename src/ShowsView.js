export default class View {
    constructor() {
        this.showsContainer = document.querySelector("#shows-container");
        this.input = document.querySelector("#show-name-input")
        this.button = document.querySelector('#search-button')

    }

    displayShows(shows) {
        console.log(shows);
        while (this.showsContainer.firstChild) {
            this.showsContainer.removeChild(this.showsContainer.firstChild)
        }
        if (shows.length !== 0) {
            shows.forEach(show => {
                const card = document.createElement("div");
                const title = document.createElement("h2");
                const status = document.createElement("p");
                const rating = document.createElement("p");
                const releaseDate = document.createElement("p");
                const description = document.createElement("p");
                card.classList.add("card");
                title.classList.add("card__title");
                status.classList.add("card__details");
                rating.classList.add("card__details");
                releaseDate.classList.add("card__details");
                description.classList.add("card__description");
                title.innerText = show.show.name;
                status.innerText = `Status: ${show.show.status}`;
                rating.innerText = `Raiting: ${show.score}`;
                releaseDate.innerText = `Aired:${show.show.premiered}`;
                description.innerHTML = show.show.summary.substring(0, 99);
                card.appendChild(title);
                card.appendChild(status)
                card.appendChild(rating);
                card.appendChild(releaseDate);
                card.appendChild(description);
                this.showsContainer.appendChild(card);
            })
        } else {
            alert("No results")
        }
    }
    _getShowName() {
        return this.input.value
    }

    addFetchShowsListener(handler) {
        this.button.addEventListener("click", () => handler(this._getShowName()))
    }

}