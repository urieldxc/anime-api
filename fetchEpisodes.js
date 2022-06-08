export const fetchEpisodes = async( id, options ) => {
    const response = await fetch(`https://jikan1.p.rapidapi.com/anime/${id}/episodes`, options)
    const animeJSON = await response.json();
    console.log(animeJSON)
    const { episodes } = animeJSON;
    
    episodes.forEach((e, indice) => {

       const { title, episode_id } = episodes[indice]
    
       const episodesDiv = document.querySelector(".episodesDiv");
       const paragraph = document.createElement("p");
       episodesDiv.appendChild(paragraph)
       paragraph.innerHTML = episode_id + '. ' + title
    });
}