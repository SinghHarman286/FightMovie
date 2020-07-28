const fetchData = async (value) => {
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

const parent = document.querySelector("#autocomplete");
parent.innerHTML = `
<label><b>Search For a Movie</b></label>
<input class = "input">
    <div class = "dropdown">
        <div class = "dropdown-menu">
        <div class = "dropdown-content results"></div>
        </div>
    </div>
`

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultWrapper = document.querySelector(".results");

const onInput = async event => { 
    const movies = await fetchData(event.target.value);

    if(!movies.length) {
        dropdown.classList.remove("is-active");
        return;
    }

    resultWrapper.innerHTML = ""
    dropdown.classList.add("is-active");
    for (let movie of movies) {
        const option = document.createElement("a");
        const imageSRC = movie.Poster === "N/A"? "" : movie.Poster
        option.classList.add("dropdown-item");
        option.innerHTML = `
        <img src = "${imageSRC}">
        ${movie.Title}
        `
        option.addEventListener("click", () => {
            dropdown.classList.remove("is-active");
            input.value = movie.Title;
            onMovie(movie);
        })
        resultWrapper.appendChild(option);   
    }
}

const onMovie = async movie => {
    const response = await axios.get("https://www.omdbapi.com/", {
        params: {
            apikey: "9fad960",
            i: movie.imdbID
        }
    });
    
    document.querySelector("#summary").innerHTML = movieTemplate(response.data);
}

const movieTemplate = movieDetail => {
    console.log(movieDetail);
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
        <article class = "notification is-primary">
            <p class = "title">${movieDetail.Awards}</p>
            <p class = "subititle">Awards</p>
        </article>
        <article class = "notification is-primary">
            <p class = "title">${movieDetail.BoxOffice}</p>
            <p class = "subititle">Box Office</p>
        </article>
        <article class = "notification is-primary">
            <p class = "title">${movieDetail.Metascore}</p>
            <p class = "subititle">Metascore</p>
        </article>
        <article class = "notification is-primary">
            <p class = "title">${movieDetail.imdbVotes}</p>
            <p class = "subititle">imdb Votes</p>
        </article>
    `;
}



input.addEventListener("input", debounce(onInput, 500));

document.addEventListener("click", event => {
    if(!parent.contains(event.target)) {
        dropdown.classList.remove("is-active");
    }
})
