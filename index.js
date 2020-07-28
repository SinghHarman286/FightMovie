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

const parent = document.querySelector(".autocomplete");
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
        resultWrapper.appendChild(option);   
    }


}

input.addEventListener("input", debounce(onInput, 500));

document.addEventListener("click", event => {
    if(!parent.contains(event.target)) {
        dropdown.classList.remove("is-active");
    }
})
