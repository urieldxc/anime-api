import { options } from './helpers/optionsFetch.js';
import { fetchEpisodes } from './fetchEpisodes.js';

const inputSearch = document.querySelector("#inputSearch");
const historyUl = document.querySelector(".historyUl");
const searchList = document.querySelector(".search-list");
const animeContainer = document.querySelector(".animeContainer")
const lastFiveAnimes = [];

// SOLO DEBERÍA HACER EL FETCH POR NOMBRE
const fetchByName = async ( inputValue ) => {
    const nameResponse = await fetch(`https://jikan1.p.rapidapi.com/search/anime?q=${inputValue}`, options);
    const animeJSON = await nameResponse.json();
    const { mal_id } = animeJSON.results[0];
    fetchById( mal_id )
}

// Hacer fetch por ID,  gracias a haber hecho un fetch por nombre anteriormente.
const fetchById = async( mal_id ) => {
    const result = await fetch(`https://api.jikan.moe/v4/anime/${mal_id}/full`);
    const { data } = await result.json();
    console.log(data)
    const { image_url } = data.images.jpg
    const genres = data.genres
    const animeGenres = []
    genres.map( e => {
        animeGenres.push(e.name)
    })
    console.log(animeGenres)
    const { title, synopsis, episodes, score, year } = data;
    const selectedAnime = {
        mal_id,
        title,
        episodes,
        synopsis,
        image_url,
        score,
        year,
        name,
    }
    fetchEpisodes(mal_id, options);
    drawAnimeData( selectedAnime );
    searchHistory( selectedAnime );
}

const drawAnimeData = ({ title, synopsis, image_url, episodes, score, year, name }) => {
    const animeInfo = document.getElementById("anime-info");
    if(animeInfo.firstChild)eraseAnimeData();
    const animeContainer = document.createElement("div")
    animeInfo.appendChild(animeContainer)
    animeContainer.classList.add("animeContainer")
    animeContainer.innerHTML = `
            <h2 class="animeTitle"> ${title} </h2>
            <div class="img-genre">
                <img src="${image_url}">
                <p> ${name} </p>
            </div>    
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
                        <p> ${year}</p>
                    </div>
                    <div class="info-data">
                        <h4>Episodes: </h4>
                        <p>${episodes} </p>
                    </div>
                    <button class="buttonEpisodes"> Show Episodes </button>
                    <div class="episodesDiv episodeHidden"></div>
                </div>
        `
        const buttonEpisodes = document.querySelector(".buttonEpisodes")
        const episodesDiv = document.querySelector(".episodesDiv")    
        buttonEpisodes.addEventListener('click', () => {
            episodesDiv.classList.toggle("episodeHidden");
        })
}

// HISTORIAL DE BÚSQUEDAS
const drawHistoryImages = (mal_id, image_url, moreThanFive) => {

    if (moreThanFive == true) {
        historyUl.firstChild.remove();
        lastFiveAnimes.shift();
    }
    lastFiveAnimes.push(mal_id);
    const animeCard = document.createElement("li");
    animeCard.innerHTML = `<img class="history-img" data-id="${mal_id}" src="${image_url}"></img>`;
    historyUl.appendChild(animeCard)
    animeHistoryLinks( animeCard.firstChild )
}

// Si el historial tiene mas de cinco, le pasa true por tercer parámetro a drawHistoryImages eliminando el primero y añadiendo otro al final.
const searchHistory = ({mal_id, image_url}) => {
    lastFiveAnimes.length < 5 ? 
    drawHistoryImages(mal_id, image_url, false) : 
    drawHistoryImages(mal_id, image_url, true)
}
const findAnimeList = ( searchAnime ) => {
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
    if(request_cached) displaySearchList(results)
}

const displaySearchList = ( animes ) =>{
    searchList.innerHTML = "";
    animes.forEach( anime => {
        let animeListItem = document.createElement("div")
        animeListItem.dataset.id = anime.mal_id
        animeListItem.classList.add('search-list-item')
        let year = "";
        if(anime.start_date) year = anime.start_date.slice(0,4)
        animeListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${anime.image_url}">
            </div>
            <div class="search-item-info">
                <h4>${anime.title}</h4>
                <p>${year}</p>
            </div>
        `
        searchList.appendChild(animeListItem)
    })
    animeItemsLink();
}

inputSearch.addEventListener('keyup', (e) => {
    
    if (e.key == "Enter" && inputSearch.value != "") {
        fetchByName(encodeURI(inputSearch.value).trim())
        if(animeContainer) eraseAnimeData();
        inputSearch.blur();
        inputSearch.value = "";
    } else {
        findAnimeList( inputSearch.value );
    }
})
inputSearch.addEventListener('focus', () =>{
    searchList.classList.toggle('hide-search-list');
})
searchList.addEventListener('focusout', () =>{
    searchList.classList.toggle('hide-search-list');
})

const animeItemsLink = () =>{
    const searchListAnime = searchList.querySelectorAll(".search-list-item")
    
    searchListAnime.forEach(anime => {
        anime.addEventListener('click', async () =>{
            searchList.classList.add('hide-search-list');
            inputSearch.value = "";
            const result = await fetch(`https://api.jikan.moe/v4/anime/${anime.dataset.id}/full`);
            const {data} = await result.json();
            fetchById( data.mal_id );  
        })
    })
}
const eraseAnimeData = () => {
    document.querySelector(".animeContainer").remove();
}
const starRating = (score) =>{
    const starNumber = score.toFixed()/2;
    let stars = ""
    for(let i = 0; i < starNumber; i++){
        stars = stars + "⭐";
    }
    return stars;
}

const animeHistoryLinks = ( historyItem ) =>{
    historyItem.addEventListener('click', ()=>{
        fetchById(historyItem.dataset.id)
    })
}