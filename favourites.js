const moviesBox = document.getElementById('movies-box');
const defaultMoviePoster = "https://m.media-amazon.com/images/M/MV5BNDUyMTkwNzQtODE3NS00YTQ0LTlmMGItYjY0MTgyODMzMWQ3XkEyXkFqcGdeQXVyMjY2NzUwOTk@._V1_SX300.jpg";
let movies = [];


function renderMovies() {
    movies = localStorage.getItem('favourites');
    movies = movies ? JSON.parse(movies) : [];
    if (!movies.length) {
        moviesBox.innerHTML = '';
        let heading = document.createElement('h2');
        heading.classList.add('mt-5', 'text-center');
        heading.innerHTML = 'No Favourites... <a style="background: darkorchid; color: white" href="index.html" class="btn btn-sm">Add Movies</a>'
        moviesBox.appendChild(heading);
    } else {
        moviesBox.innerHTML = '';
        movies.forEach((movie) => {
            movie.Poster = movie.Poster === 'N/A' ? defaultMoviePoster : movie.Poster;
            const movieCard = `
        <div class="col-12 col-md-3">
            <div class="card" style="width: 300px; margin: 10px auto">
                <img class="card-img-top" src="${movie.Poster}" alt="Card image cap">
                <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <b>${movie.Year} </b><br/>
                <a style="background: darkorchid; color: white" href="movie.html?imdb=${movie.imdbID}" class="btn btn-sm">Details</a>
                <button class="favourite-btn btn btn-sm" onclick="removeFromFavourites('${movie.imdbID}')" data-movie-id="${movie.imdbID}" class="btn btn-sm">Added to Favourites <i class="fas fa-regular fa-heart text-danger"></i></button>
                </div>
            </div>
        </div>
        `
            moviesBox.innerHTML += movieCard;
        });
    }
}

function removeFromFavourites(imdbID) {
    movies = movies.filter((movie) => movie.imdbID !== imdbID);
    localStorage.setItem('favourites', JSON.stringify(movies));
    renderMovies();
}

renderMovies();