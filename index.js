const OMDB_API_URL = "https://www.omdbapi.com/?apikey=bcc3ca35";

const searchInput = document.getElementById('search');

const moviesBox = document.getElementById('movies-box');
// if in search results movies dont have poster then this will be used 
const defaultMoviePoster = "https://m.media-amazon.com/images/M/MV5BNDUyMTkwNzQtODE3NS00YTQ0LTlmMGItYjY0MTgyODMzMWQ3XkEyXkFqcGdeQXVyMjY2NzUwOTk@._V1_SX300.jpg";

// attaching event listener on input search movies
searchInput.addEventListener('keyup', fetchMovies);
let favourites = [];
// fetch fav movies added by user
favourites = localStorage.getItem('favourites');
favourites = favourites ? JSON.parse(favourites) : [];

let movies;
function fetchMovies(){
    let name = searchInput.value;
    if (name.length < 2) return;

    fetch(`${OMDB_API_URL}&s=${name}`)
    .then(res=>res.json())
    .then((res) =>{
        if(res.Response === "True"){
            movies = res.Search;
            if(movies.length){
                renderMovies();
                // check if fetched movies have user favourites movies
                checkMoviesAddedToFavourites();
            } 
        } else {
            // if no results found then shown no movies found
            let noResultEl = document.querySelector('#movies-box h2');
           if(!noResultEl){
            noResultEl = document.createElement('h2');
            noResultEl.classList.add('mt-5', 'text-center');
            moviesBox.innerHTML = '';
            moviesBox.appendChild(noResultEl);
           }
           noResultEl.innerHTML = 'Movies Not Found!!'
        }
    })
}

fetchMovies();
function renderMovies(){
    moviesBox.innerHTML = '';
    movies.forEach((movie)=>{
        movie.Poster = movie.Poster === 'N/A' ? defaultMoviePoster : movie.Poster;
        const movieCard = `
        <div class="col-12 col-md-3">
            <div class="card" style="width: 300px; margin: 10px auto">
                <img class="card-img-top" src="${movie.Poster}" alt="Card image cap">
                <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <b>${movie.Year} </b><br/>
                <a style="background: darkorchid; color: white" href="movie.html?imdb=${movie.imdbID}" class="btn btn-sm">Details</a>
                <button class="favourite-btn btn btn-sm" onclick="addToFavourites('${movie.imdbID}')" data-movie-id="${movie.imdbID}" class="btn btn-sm">Add to Favourites <i class="fas fa-regular fa-heart"></i></button>
                </div>
            </div>
        </div>
        `
        moviesBox.innerHTML += movieCard;
    });
}

function addToFavourites(imdbID){
    let movieToAdd = movies.filter((movie)=> movie.imdbID === imdbID)[0];
    // check movie is already added in favourites if yes then remove it from favourites
    let movieExists = favourites.some((movie) => movie.imdbID === imdbID);
    if (movieExists) {
        favourites = favourites.filter((movie)=> movie.imdbID !== imdbID);
    } else {
        favourites.push(movieToAdd);
    }
    // update button content showing favourites status
    checkMoviesAddedToFavourites();
    // update favourites movies in local storage 
    localStorage.setItem('favourites', JSON.stringify(favourites));
}

function checkMoviesAddedToFavourites(){
    let buttonEls = document.querySelectorAll('.favourite-btn');
    buttonEls.forEach(button => {
        let movieId = button.dataset.movieId;
        if(favourites.some(movie=> movie.imdbID === movieId)){
            button.innerHTML = `Added to Favourites <i style="color:red;" class="fas fa-regular fa-heart"></i>`
        } else {
            button.innerHTML = `Add to Favourites <i class="fas fa-regular fa-heart"></i>`
        }
    })
}