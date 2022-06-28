import { fetchAnimeByName, fetchAnimeById } from './fetchAnime.js';
import {createAnimeDom} from './animeDomElements.js'

import { findAnimeList} from './searchList.js';

// Eventos
const inputSearch = document.querySelector("#inputSearch");
const searchList = document.querySelector(".search-list");

inputSearch.addEventListener('keyup', (e) =>{
    if(e.key == "Enter" && inputSearch.value != ""){
        drawAnimeData(inputSearch.value);
        inputSearch.value = "";
        inputSearch.blur();
        searchList.classList.add("hide-search-list")
    } else {
        findAnimeList( inputSearch.value );
    }
})

// Fetch
const fetchAnime = async(inputValue) =>{
    const animeByName = await fetchAnimeByName(inputValue);
    const animeById = await fetchAnimeById(animeByName);
    return animeById;
}

export const drawAnimeData = async(animeName) => {
    const anime = await fetchAnime(animeName);
    const animeInfo = document.getElementById("anime-container__anime-info");
    if(animeInfo.firstChild)eraseAnimeData();
    createAnimeDom(anime, animeInfo);
    searchHistory(anime);
}

const eraseAnimeData = () => {
    document.querySelector(".animeContainer").remove();
}

// Historial
const historyUl = document.querySelector(".historyDiv__historyUl");
const lastFiveAnimes = [];
const searchHistory = (anime) => {
    lastFiveAnimes.length < 5 ? drawHistoryImages(anime, false) : drawHistoryImages(anime, true);
}

const drawHistoryImages = (anime, moreThanFive) => {
    if (moreThanFive == true) {
        historyUl.firstChild.remove();
        lastFiveAnimes.shift();
    }
    lastFiveAnimes.push(anime.title);
    const animeCard = document.createElement("li");
    animeCard.innerHTML = `<img class="history-img" data-name="${anime.title}" src="${anime.image_url}"></img>`;
    historyUl.appendChild(animeCard);
    animeHistoryLinks( animeCard.firstChild )
}


const animeHistoryLinks = ( historyItem ) =>{
    historyItem.addEventListener('click', ()=>{
        drawAnimeData(historyItem.dataset.name);
    })
}