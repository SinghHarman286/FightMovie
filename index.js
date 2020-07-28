const fetchData = async (value) => {
    const response = await axios.get("https://www.omdbapi.com/", {
        params: {
            apikey: "9fad960",
            s: value
        }
    });

    console.log(response.data);
}

const onInput = event => { 
    fetchData(event.target.value);
}

const input = document.querySelector("input");
input.addEventListener("input", debounce(onInput, 500));
