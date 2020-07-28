const autocompleteObj = {
    renderOption(movie) {
        const imageSRC = movie.Poster === "N/A"? "" : movie.Poster
        return `
        <img src = "${imageSRC}">
        ${movie.Title} ${movie.Year}
        `
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(value) {
        const response = await axios.get("https://www.omdbapi.com/", {
        params: {
            apikey: "9fad960",
            s: value
        }
    });
    if (response.data.Error) {
        return []
    }
    return response.data.Search
    }
}
createAutoComplete({
    ...autocompleteObj,
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovie(movie, document.querySelector(".left-summary"), "left");
    },
    parent: document.querySelector("#left-autocomplete"),
})
createAutoComplete({
    ...autocompleteObj,
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovie(movie, document.querySelector(".right-summary"), "right");
    },
    parent: document.querySelector("#right-autocomplete"),
})

let leftSide;
let rightSide;

const onMovie = async (movie, summary, side) => {
    const response = await axios.get("https://www.omdbapi.com/", {
        params: {
            apikey: "9fad960",
            i: movie.imdbID
        }
    });
    
    summary.innerHTML = movieTemplate(response.data);

    if (side == "left") {
        leftSide = response.data;
    } else {
        rightSide = response.data;
    }

    if (leftSide && rightSide) {
        runComparision();
    }
}

const runComparision = () => {
    const leftSideStats = document.querySelectorAll(".left-summary .notification");
    const rightSideStats = document.querySelectorAll(".right-summary .notification");

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = leftStat.dataset.value;
        const rightSideValue = rightStat.dataset.value;

        if(leftSideValue > rightSideValue) {
            rightStat.classList.remove("is-primary");
            rightStat.classList.add("is-warning");
        }
        else {
            leftStat.classList.remove("is-primary");
            leftStat.classList.add("is-warning");
        }
    })
}

const movieTemplate = movieDetail => {
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, ""));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
    let count = 0;
    const awards = movieDetail.Awards.split(' ').reduce(function(prev, word) {
        const value = parseInt(word);

        if(isNaN(value)) {
            return prev;
        } else {
            return prev + value; 

        }
    }, 0)

    console.log(dollars, metascore, imdbRating, imdbVotes);
    return `
        <article class = "media">
            <figure class = "media-left">
                <p class = "image">
                    <img src = "${movieDetail.Poster}">
                </p>
            </figure>
            <div class = "media-content">
                <div class = "content">
                    <h1> ${movieDetail.Title}</h1>
                    <h4> ${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class = "notification is-primary">
            <p class = "title">${movieDetail.Awards}</p>
            <p class = "subititle">Awards</p>
        </article>
        <article data-value=${dollars} class = "notification is-primary">
            <p class = "title">${movieDetail.BoxOffice}</p>
            <p class = "subititle">Box Office</p>
        </article>
        <article data-value=${metascore} class = "notification is-primary">
            <p class = "title">${movieDetail.Metascore}</p>
            <p class = "subititle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class = "notification is-primary">
            <p class = "title">${movieDetail.imdbRating}</p>
            <p class = "subititle">imdb Rating</p>
        </article>
        <article data-value=${imdbVotes} class = "notification is-primary">
            <p class = "title">${movieDetail.imdbVotes}</p>
            <p class = "subititle">imdb Votes</p>
        </article>
    `;
}
