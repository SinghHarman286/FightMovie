const createAutoComplete = ({parent, renderOption, onOptionSelect, inputValue, fetchData}) => {
    parent.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class = "input">
        <div class = "dropdown">
            <div class = "dropdown-menu">
            <div class = "dropdown-content results"></div>
            </div>
        </div>
    `
    
    const input = parent.querySelector("input");
    const dropdown = parent.querySelector(".dropdown");
    const resultWrapper = parent.querySelector(".results");
    
    const onInput = async event => { 
        const items = await fetchData(event.target.value);
    
        if(!items.length) {
            dropdown.classList.remove("is-active");
            return;
        }
    
        resultWrapper.innerHTML = ""
        dropdown.classList.add("is-active");
        for (let movie of items ) {
            const option = document.createElement("a");
            option.classList.add("dropdown-item");
            option.innerHTML = renderOption(movie);
            option.addEventListener("click", () => {
                dropdown.classList.remove("is-active");
                input.value = inputValue(movie);
                onOptionSelect(movie);
            })
            resultWrapper.appendChild(option);   
        }
    }
    
    input.addEventListener("input", debounce(onInput, 500));
    
    document.addEventListener("click", event => {
        if(!parent.contains(event.target)) {
            dropdown.classList.remove("is-active");
        }
    })
}
