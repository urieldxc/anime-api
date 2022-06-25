import { drawAnimeData } from './app-r.js';
import { options } from './optionsFetch.js';


const searchList = document.querySelector(".search-list");

export const findAnimeList = ( searchAnime ) => {
    if(searchAnime.length > 0){
        searchList.classList.remove("hide-search-list");
        if(searchAnime.length > 2) animeListSearch(searchAnime);
    } else {
        searchList.classList.add("hide-search-list")
    }
}

export const animeListSearch = async ( searchAnime ) => {
    const res = await fetch(`https://jikan1.p.rapidapi.com/search/anime?q=${searchAnime}`, options);
    const {results, request_cached} = await res.json();
    if(request_cached) displaySearchList(results)
}

export const displaySearchList = ( animes ) =>{
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

const animeItemsLink = () =>{
    const searchListAnime = searchList.querySelectorAll(".search-list-item")

    searchListAnime.forEach(anime => {
        anime.addEventListener('click', async () =>{
            // showOnlyAnimePage();
            searchList.classList.add('hide-search-list');
            inputSearch.value = "";
            const result = await fetch(`https://api.jikan.moe/v4/anime/${anime.dataset.id}/full`);
            const {data} = await result.json();
            drawAnimeData( data.title );  
        })
    })
}