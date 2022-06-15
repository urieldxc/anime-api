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
    const { title, episodes, synopsis, image_url, mal_id, score, start_date, end_date } = results[0];
    const anime = {
        mal_id,
        title,
        episodes,
        synopsis,
        image_url,
        score,
        start_date,
        end_date
    }
    drawAnimeData(anime);
    fetchEpisodes(mal_id, options);
    searchHistory(anime);
    starRating(score)
}

const starRating = (score) =>{
    const starNumber = score.toFixed()/2;
    let stars = ""
    for(let i = 0; i < starNumber; i++){
        stars = stars + "⭐";
    }
    return stars;
}

const drawAnimeData = ({ title, synopsis, image_url, episodes, score, start_date, end_date }) => {
    const animeInfo = document.getElementById("anime-info");
    const animeContainer = document.createElement("div")
    animeInfo.appendChild(animeContainer)
    animeContainer.classList.add("animeContainer")
    animeContainer.innerHTML = `
            <h2 class="animeTitle"> ${title} </h2>
            <div class="img-desc-div">
                <img src="${image_url}">
                <div class="anime-desc">
                    <div>
                        <h4>Synopsis: </h4>
                        <p> ${synopsis} </p>
                    </div>
                    <div class="info-data">
                        <h4>Rate: </h4>
                        <p> ${starRating(score)}</p>
                    </div>
                    <div class="info-data">
                        <h4>Date: </h4>
                        <p> ${start_date.slice(0,4)} - ${end_date.slice(0,4)} </p>
                    </div>
                    <div class="info-data">
                        <h4>Episodes: </h4>
                        <p>${episodes} </p>
                    </div>
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
        if(document.querySelector(".animeContainer") != null) eraseAnimeData();  
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

const searchHistory = ({mal_id, image_url}) => {
    lastFiveAnimes.length < 5 ? drawHistoryImg(mal_id, image_url, false) : drawHistoryImg(mal_id, image_url, true)
}