export const createAnimeDom = (anime, animeInfo) =>{
    const animeContainer = document.createElement("div");
    animeContainer.classList.add("animeContainer")
    animeInfo.append(animeContainer);

    const animeTitle = document.createElement("h2")
    animeTitle.classList.add("animeTitle");
    animeTitle.textContent = anime.title;
    animeContainer.append(animeTitle);

    const animeInfoWrapper = document.createElement("div");
    animeInfoWrapper.classList.add("anime-info-wrapper");
    animeContainer.append(animeInfoWrapper);

    const imageGenresDiv = document.createElement("div");
    imageGenresDiv.classList.add("img-genre-div");
    animeInfoWrapper.append(imageGenresDiv);

    const animeImage = document.createElement("img");
    animeImage.src = (anime.image_url);
    imageGenresDiv.append(animeImage);

    const genresUl = document.createElement("ul");
    genresUl.innerHTML = drawGenres(anime.genres);
    imageGenresDiv.append(genresUl);

    const animeDescDiv = document.createElement("div");
    animeDescDiv.classList.add("anime-desc");
    animeInfoWrapper.append(animeDescDiv);

    const synopsisDiv = document.createElement("div");
    animeDescDiv.append(synopsisDiv);
    const synopsisH4 = document.createElement("h4");
    synopsisH4.textContent = "Synopsis:";
    synopsisDiv.append(synopsisH4);
    const synopsisText = document.createElement("p");
    synopsisText.textContent = anime.synopsis;
    synopsisDiv.append(synopsisText);

    const ratingDiv = document.createElement("div");
    animeDescDiv.append(ratingDiv);
    ratingDiv.classList.add("info-data");
    const rateH4 = document.createElement("h4");
    rateH4.textContent = "Rate:"
    ratingDiv.append(rateH4);
    const rateStars = document.createElement("p");
    rateStars.textContent = starRating(anime.score);
    ratingDiv.append(rateStars);

    const dateDiv = document.createElement("div");
    animeDescDiv.append(dateDiv);
    dateDiv.classList.add("info-data");
    const dateH4 = document.createElement("h4");
    dateH4.textContent = "Date:"
    dateDiv.append(dateH4);
    const dateText = document.createElement("p");
    dateText.textContent = anime.year;
    dateDiv.append(dateText);

    const episodesDiv = document.createElement("div")
    animeDescDiv.append(episodesDiv);
    episodesDiv.classList.add("info-data");
    const episodesH4 = document.createElement("h4");
    episodesH4.textContent = "Episodes:";
    episodesDiv.append(episodesH4);
    const episodesText = document.createElement("p");
    episodesText.textContent = anime.episodes;
    episodesDiv.append(episodesText);

    const buttonEpisodes = document.createElement("button");
    buttonEpisodes.classList.add("buttonEpisodes");
    buttonEpisodes.textContent = "Show Episodes";
    animeDescDiv.append(buttonEpisodes);

    const episodesListDiv = document.createElement("div");
    episodesListDiv.classList.add("episodesListDiv", "episodeHidden");
    animeDescDiv.append(episodesListDiv);
}

const drawGenres = ( genres ) =>{
    return (genres.map( e => `<li class="genre">${e.name}</li>` ).join(''))
}
const starRating = (score) =>{
    const starNumber = score.toFixed()/2;
    let stars = ""
    for(let i = 0; i < starNumber; i++){
        stars = stars + "⭐";
    }
    return stars;
}