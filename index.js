const fetchData = async (value) => {
    const response = await axios.get("https://www.omdbapi.com/", {
        params: {
            apikey: "9fad960",
            s: value
        }
    });

    console.log(response.data);
}

let timeOutId;

const debounce = (func, delay = 1000) => {
    let timeOutId;

    return (...args) => {
        if (timeOutId) {
            clearTimeout(timeOutId);
        }
        timeOutId = setTimeout(() => {
            func.apply(null, args)
        }, delay);
    };
};

const onInput = event => { 
    fetchData(event.target.value);
}

const input = document.querySelector("input");
input.addEventListener("input", debounce(onInput, 500));
