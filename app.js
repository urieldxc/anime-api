import { options } from './helpers/optionsFetch.js';
import { fetchEpisodes } from './fetchEpisodes.js';

let inputValue = "";
const container = document.querySelector(".container");
const animeTitle = document.querySelector(".animeTitle");
const episodesDiv = document.querySelector(".episodesDiv");
const inputSearch = document.querySelector("#inputSearch");
const btnSearch = document.querySelector("#btnSearch");
const destroySearches = document.querySelectorAll(".container p img .numEpisodes") /* para eliminar todo lo que hay en ese div*/
const historyDiv = document.querySelector(".historyDiv")
const historyUl = document.querySelector(".historyUl")

const animeHistory = [];


const animeFetch = async (inputValue) => {
    const response = await fetch(`https://jikan1.p.rapidapi.com/search/anime?q=${inputValue}`, options);
    const animeJSON = await response.json();
    const { results } = animeJSON;
    console.log(results)
    const { title, episodes, synopsis, image_url, mal_id } = results[3];

    const animeDesc = document.createElement("p");
    const animeImg = document.createElement("img")
    const container2 = document.createElement("div");
    container2.classList.add("numEpisodes");

    animeImg.src = image_url

    container.appendChild(animeImg)
    container.appendChild(animeDesc);
    container.appendChild(container2);

    animeTitle.innerHTML = title;
    animeDesc.innerHTML = synopsis;
    container2.innerHTML = `Episodes: ${episodes}`;
    container2.style.fontWeight = "bold";

    fetchEpisodes(mal_id, options);
    searchHistory(mal_id, image_url);
}



const buttonEpisodes = document.querySelector(".episodesButton")
buttonEpisodes.addEventListener('click', () => {
    episodesDiv.classList.toggle("episodeHidden");
})

inputSearch.addEventListener('keypress', (e) => {
    if (e.key == "Enter") {
        inputValue = inputSearch.value
        animeFetch(inputValue)
    }
})

btnSearch.addEventListener('click', () => {
    inputValue = inputSearch.value
    animeFetch(inputValue)
})


// WIP: destruir la búsqueda y sustituirla con la nueva
for (let destroySearch of destroySearches) {
    container.removeChild(destroySearch);
};

// Hay que factorizar si o si y reducir tanto codigo repetido
const addLastAnime = (mal_id, image_url) => {
    animeHistory.push(mal_id);
    const animeCard = document.createElement("li");
    const animeImg = document.createElement("img");
    historyUl.appendChild(animeCard);
    animeCard.appendChild(animeImg)
    animeImg.src = image_url
}

const historyLastFive = (mal_id, image_url) => {
    historyUl.firstChild.remove()
    animeHistory.shift();
    animeHistory.push(mal_id);
    const animeCard = document.createElement("li");
    const animeImg = document.createElement("img");
    historyUl.appendChild(animeCard);
    animeCard.appendChild(animeImg)
    animeImg.src = image_url
}

const searchHistory = (mal_id, image_url) => {
    animeHistory.length < 5 ? addLastAnime(mal_id, image_url) : historyLastFive(mal_id, image_url)
}

