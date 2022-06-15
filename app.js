import { options } from './helpers/optionsFetch.js';
import { fetchEpisodes } from './fetchEpisodes.js';

let inputValue = "";
const inputSearch = document.querySelector("#inputSearch");
const btnSearch = document.querySelector("#btnSearch");
const historyUl = document.querySelector(".historyUl");

const lastFiveAnimes = [];

const animeFetch = async (inputValue) => {
    const response = await fetch(`https://jikan1.p.rapidapi.com/search/anime?q=${inputValue}`, options);
    const animeJSON = await response.json();
    const { results } = animeJSON;
    const { title, episodes, synopsis, image_url, mal_id } = results[3];

    drawAnimeData(title, synopsis, image_url, episodes);
    fetchEpisodes(mal_id, options);
    searchHistory(mal_id, image_url);
}

const drawAnimeData = (title, synopsis, image_url, episodes) => {
    const animeInfo = document.getElementById("anime-info");
    const animeContainer = document.createElement("div")
    animeInfo.appendChild(animeContainer)
    animeContainer.classList.add("animeContainer")
    animeContainer.innerHTML = `
            <h2 class="animeTitle"> ${title} </h2>
            <div class="img-desc-div">
                <img src="${image_url}">
                <div class="anime-desc">
                    <p> ${synopsis} </p>
                    <div class="numEpisodes">Episodes: ${episodes}</div>
                    <button class="buttonEpisodes"> Show Episodes </button>
                    <div class="episodesDiv episodeHidden"></div>
                </div>
            </div>
        `
    const buttonEpisodes = document.querySelector(".buttonEpisodes")
    const episodesDiv = document.querySelector(".episodesDiv")    
    buttonEpisodes.addEventListener('click', () => {
        episodesDiv.classList.toggle("episodeHidden");
    })
}

const eraseAnimeData = () => {
        document.querySelector(".animeContainer").remove();
}

inputSearch.addEventListener('keypress', (e) => {
    if (e.key == "Enter" && inputSearch.value != "") {
        animeFetch(inputSearch.value)
        inputSearch.value = "";
        if(document.querySelector(".animeContainer") != null) eraseAnimeData();  
    }
})

btnSearch.addEventListener('click', () => {
    if (inputSearch.value != "") {
        animeFetch(inputSearch.value)
        inputSearch.value = "";
        eraseAnimeData();
    }
})

const drawHistoryImg = (mal_id, image_url, moreThanFive) => {
    if (moreThanFive == true) {
        historyUl.firstChild.remove();
        lastFiveAnimes.shift();
    }
    lastFiveAnimes.push(mal_id);
    const animeCard = document.createElement("li");
    animeCard.innerHTML = `<img src="${image_url}"></img>`;
    historyUl.appendChild(animeCard)
}

const searchHistory = (mal_id, image_url) => {
    lastFiveAnimes.length < 5 ? drawHistoryImg(mal_id, image_url, false) : drawHistoryImg(mal_id, image_url, true)
}