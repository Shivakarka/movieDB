// Movie Titles: https://omdbapi.com/?s=thor&page=1&apikey=102bfbfd
// Movie details: http://www.omdbapi.com/?i=tt3896198&apikey=102bfbfd

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');


//this function trims any spaces for the search input and calls loadMovies function if input is non zero and toggles classes
function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

// function to load the movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=102bfbfd`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
}

//this functions generates the movie search list items
function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let index = 0; index < movies.length; index++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[index].imdbID; // setting movie id
        movieListItem.classList.add('search-list-item'); //adds class for css
        if(movies[index].Poster != "N/A")       
            moviePoster = movies[index].Poster;
        else 
            moviePoster = "image_not_found.png";

        //the below code generates the search list items
        movieListItem.innerHTML = `             
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[index].Title}</h3>
            <p>${movies[index].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
      
    }
    loadMovieDetails();
}

//this function displays the full movie details when search item is clicked
async function loadMovieDetails(){
    try{
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');   //hides the search bar
            movieSearchBox.value = "";                       //changes the search input to empty again
            let loader =   `<div class="loader" id="loader"></div>`;    // loading animation
            resultGrid.innerHTML = loader;                        
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=102bfbfd`); 
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);

            //the below code is regarding the add to favourites button
            let favButton = document.querySelector("#favid");
            favButton.addEventListener('click', () => {
             localStorage.setItem(`${movieDetails.imdbID}`,JSON.stringify(movieDetails.imdbID));  //stores the movie ids in localStorage
            favButton.innerHTML="Added to Fav";
            alert("Movie added to Favourites List");                               
           })    
        });
    });
} catch (err) {
   console.log("Something went wrong: " +err);
}
}

//this is a helper function for the above which adds the template of the movie details that will be displayed
function displayMovieDetails(movieDetails){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(movieDetails.Poster != "N/A") ? movieDetails.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${movieDetails.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${movieDetails.Year}</li>
            <li class = "rating">IMDB Rating: ${movieDetails.imdbRating}</li>
            <li class = "released">Released: ${movieDetails.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${movieDetails.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${movieDetails.Writer}</p>
        <p class = "actors"><b>Actors: </b>${movieDetails.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${movieDetails.Plot}</p>
        <p class = "language"><b>Language:</b> ${movieDetails.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${movieDetails.Awards}</p>
        <button class="fav-btn" id="favid"> Add to Fav </button>
    </div>
    `;    
}

//this event listener hides the search list when clicked outside the searchbar
window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});

