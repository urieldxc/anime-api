import { options } from './helpers/optionsFetch.js';
import { fetchEpisodes } from './fetchEpisodes.js';

let inputValue = "";
const inputSearch = document.querySelector("#inputSearch");
const historyUl = document.querySelector(".historyUl");
const searchList = document.querySelector(".search-list")

const lastFiveAnimes = [];

const animeFetch = async (inputValue) => {
        const nameResponse = await fetch(`https://jikan1.p.rapidapi.com/search/anime?q=${inputValue}`, options);
        const animeJSON = await nameResponse.json();
    
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
                        <p> ${start_date} - ${end_date} </p>
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

inputSearch.addEventListener('keyup', (e) => {
    findAnimeList();
    if (e.key == "Enter" && inputSearch.value != "") {
        animeFetch(inputSearch.value)
        xFetch(inputSearch.value);
        inputSearch.value = "";
        searchList.classList.add("hide-search-list")
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

const findAnimeList = () => {
    let searchAnime = (inputSearch.value)
    if(searchAnime.length > 0){
        searchList.classList.remove("hide-search-list");
        if(searchAnime.length > 2) animeListSearch(searchAnime);
        
    } else {
        searchList.classList.add("hide-search-list")
    }
}

const animeListSearch = async ( searchAnime ) => {
    const res = await fetch(`https://jikan1.p.rapidapi.com/search/anime?q=${searchAnime}`, options);
    const {results, request_cached} = await res.json();
    if(request_cached) displayAnimeList(results)
}

const displayAnimeList = ( animes ) =>{
    searchList.innerHTML = "";
    let maxAnimes = 25;
    for(let i = 0; i <  maxAnimes; i++){
        let animeListItem = document.createElement("div")
        animeListItem.dataset.id = animes[i].mal_id
        animeListItem.classList.add('search-list-item')
        let endDate, startDate;
        if (animes[i].end_date != null) { endDate = animes[i].end_date.slice(0,4)}
        if (animes[i].start_date != null) { startDate = animes[i].start_date.slice(0,4)}
    
        animeListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${animes[i].image_url}">
            </div>
            <div class="search-item-info">
                <h4>${animes[i].title}</h4>
                <p>${startDate || "???"} 
                - ${endDate || "??"}</p>
            </div>
        `
        searchList.appendChild(animeListItem)
    }
    animeItemsLink();
}

const animeItemsLink = () =>{
    const searchListAnime = searchList.querySelectorAll(".search-list-item")
    searchListAnime.forEach(anime => {
        anime.addEventListener('click', async () =>{
            if(document.querySelector(".animeContainer") != null) eraseAnimeData();
            searchList.classList.add('hide-search-list');
            inputSearch.value = "";
            const result = await fetch(`https://api.jikan.moe/v4/anime/${anime.dataset.id}/full`);
            const {data} = await result.json();
            const {image_url} = data.images.jpg
            const { title, synopsis, episodes, score, start_date, end_date, mal_id } = data;
            const selectedAnime = {
                mal_id,
                title,
                episodes,
                synopsis,
                image_url,
                score,
                start_date,
                end_date
            }
            console.log(data)
            drawAnimeData(selectedAnime)
            fetchEpisodes(mal_id, options);
            searchHistory(selectedAnime);
        })
    })
}

const xFetch = async( inputValue) => {
    const nameResponse = await fetch(`https://jikan1.p.rapidapi.com/search/anime?q=${inputValue}`, options);
    const animeNameJSON = await nameResponse.json();
    const {results} = animeNameJSON;
    const name = encodeURI(results[0].title)
    console.log(name)

}