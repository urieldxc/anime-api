import { options } from './optionsFetch.js';

export const fetchAnimeByName = async ( inputValue ) => {
    const nameResponse = await fetch(`https://jikan1.p.rapidapi.com/search/anime?q=${inputValue}`, options);
    const animeJSON = await nameResponse.json();
    const { mal_id } = animeJSON.results[0];
    return mal_id;
}
export const fetchAnimeById = async( mal_id ) => {
    const result = await fetch(`https://api.jikan.moe/v4/anime/${mal_id}/full`);
    const { data } = await result.json();
    const { image_url } = data.images.jpg;
    const genres = data.genres;
    const { title, synopsis, episodes, score, year } = data;
    const selectedAnime = {
        mal_id,
        title,
        episodes,
        synopsis,
        image_url,
        score,
        year,
        genres,
    }
    return selectedAnime;
}