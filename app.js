import { options } from './helpers/optionsFetch.js';
import { fetchEpisodes } from './fetchEpisodes.js';

let inputValue = "";
const inputSearch = document.querySelector("#inputSearch");
const btnSearch = document.querySelector("#btnSearch");
const historyUl = document.querySelector(".historyUl");
const animeSection = document.getElementById("anime-info");

const animeHistory = [];

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
    const buttonEpisodes = document.createElement("button")
    const episodesDiv = document.createElement("div")
    const animeContainer = document.createElement("div")
    const imgAndDesc = document.createElement("div");
    const descDiv = document.createElement("div");
    const animeDesc = document.createElement("p");
    const animeImg = document.createElement("img")
    const container2 = document.createElement("div");
    const animeTitle = document.createElement("h2")

    animeSection.appendChild(animeContainer)

    animeContainer.appendChild(animeTitle)
    animeContainer.appendChild(imgAndDesc);
    
    imgAndDesc.appendChild(animeImg)
    
    imgAndDesc.appendChild(descDiv)
    descDiv.appendChild(animeDesc);
    descDiv.appendChild(container2);
    descDiv.appendChild(buttonEpisodes)
    descDiv.appendChild(episodesDiv)

    episodesDiv.classList.add("episodesDiv", "episodeHidden")
    descDiv.classList.add("anime-desc")
    imgAndDesc.classList.add("img-desc-div")
    buttonEpisodes.classList.add("buttonEpisodes")
    animeContainer.classList.add("animeContainer")
    buttonEpisodes.innerHTML = ("Show Episodes")

    animeTitle.innerHTML = title;
    animeDesc.innerHTML = synopsis;
    animeImg.src = image_url

    animeTitle.classList.add("animeTitle")
    container2.classList.add("numEpisodes");
    container2.innerHTML = `Episodes: ${episodes}`;
    container2.style.fontWeight = "bold";

    buttonEpisodes.addEventListener('click', () => {
        episodesDiv.classList.toggle("episodeHidden");
    })
}

const eraseAnimeData = () => {
    document.querySelector(".animeContainer").remove();
}

inputSearch.addEventListener('keypress', (e) => {
    if (inputSearch.value != ""){     
        if (e.key == "Enter") {
            if (inputSearch.value != ""){
                if (document.querySelector(".animeContainer") != null) {
                    eraseAnimeData();
                }
                inputValue = inputSearch.value
                animeFetch(inputValue)
                inputSearch.value = "";
            }
        }
    }
})

btnSearch.addEventListener('click', () => {
    if (inputSearch.value != ""){
        if (document.querySelector(".animeContainer") != null) {
            eraseAnimeData();
        }
        inputValue = inputSearch.value
        animeFetch(inputValue)
        inputSearch.value = "";
    }
})

const createDomImg = (mal_id, image_url, historyCount) => {
    if (historyCount == true) {
        historyUl.firstChild.remove();
        animeHistory.shift();
    }

    animeHistory.push(mal_id);
    const animeCard = document.createElement("li");
    const animeImg = document.createElement("img");
    historyUl.appendChild(animeCard);
    animeCard.appendChild(animeImg);
    animeImg.src = image_url;
}

const searchHistory = (mal_id, image_url) => {
    animeHistory.length < 5 ? createDomImg(mal_id, image_url, false) : createDomImg(mal_id, image_url, true)
}

