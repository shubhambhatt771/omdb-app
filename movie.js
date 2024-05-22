const params = new URLSearchParams(window.location.search);
const imdbId = params.get('imdb');
if (!imdbId){
    // if imdbId query parameters not exist redirect to home
    window.location.href = '/index.html';
}
const OMDB_API_URL = "https://www.omdbapi.com/?apikey=bcc3ca35";
const movieCard = document.getElementById('movie-info-card');
// default movie poster if no poster exists
let Poster = "https://m.media-amazon.com/images/M/MV5BNDUyMTkwNzQtODE3NS00YTQ0LTlmMGItYjY0MTgyODMzMWQ3XkEyXkFqcGdeQXVyMjY2NzUwOTk@._V1_SX300.jpg";
let favourites = localStorage.getItem('favourites');
favourites = favourites ? JSON.parse(favourites) : [];
let movie;
async function fetchMovieDetails(){
movie = await fetch(`${OMDB_API_URL}&i=${imdbId}`);
movie = await movie.json();
Poster = movie.Poster === 'N/A' ? Poster : movie.Poster ;
renderMovie(movie);
}
function renderMovie(movie){
    let favouriteBtnContent;
    // check if movie already added to favourites or not
    if (favourites.some((movieOj)=> movieOj.imdbID === movie.imdbID)){
        favouriteBtnContent = `Added to Favourites <i style="color:red;" class="fas fa-regular fa-heart"></i>`
    } else {
        favouriteBtnContent = `Add to Favourites <i class="fas fa-regular fa-heart"></i>`
    }
    movieCard.innerHTML = `
    <div class="row">
        <div class="col col-md-4">
            <img src="${Poster}" >
        </div>
        <div id='movie-info' class="col col-md-8">
            <div id="info-wrapper">
            <h2>${movie.Title}</h2>
            <h4>${movie.Year} <b>${movie.Runtime}</b></h4>
            <b>${movie.Type}</b><br>
            <img width="40" height="15" src="imgs/imdb.jpeg"> ${movie.imdbRating} <br />

            <h5 class="my-2">
                Cast: ${movie.Actors}
            </h5>

            <p>${movie.Plot}
            </p>
            <button id="favourite-btn" onclick="addToFavourites('${movie.imdbID}')" class="btn btn-light">${favouriteBtnContent}</button> 
        </div>
    </div>
`
}

function addToFavourites(imdbID){
    // add or remove from favourites if movie exists
    let movieExists = favourites.some((movie) => movie.imdbID === imdbID);
    if (movieExists) {
        favourites = favourites.filter((movie)=> movie.imdbID !== imdbID);
    } else {
        favourites.push(movie);
    }
    localStorage.setItem('favourites', JSON.stringify(favourites));
    renderMovie(movie);
}

fetchMovieDetails();