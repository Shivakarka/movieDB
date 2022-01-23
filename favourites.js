
document.querySelector('.clear').addEventListener('click',handlerClick)
document.querySelector('ul').addEventListener('click',handlerClick2)



//function will loop and create all the movie elements of favourites
let id="";
for(let i =0;i<=localStorage.length-1;i++){
  id=localStorage.key(i);
  getFav(id);
}

//async function to fetch movie details
async function getFav(id) {
try{
  const URL = `http://www.omdbapi.com/?i=${id}&apikey=102bfbfd`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  // console.log(data);
  if(data.Response == "True")  addMovieDetails(data);
 
} catch (err) {
  console.log("Something went wrong: "+ err);
}
}

let ul = document.querySelector('ul');

//helper function to add movie details on page
function addMovieDetails(details){
  
  //we will be storing the imdb id of all items as localStorage has keys of this format
  let movieId=`${details.imdbID}`;
  let li = document.createElement('li');
 
  //This is template of the data which will be added. Remove button will have class of imdb Id so that when clicked , localStorage removes that particular item
  li.innerHTML = `
  <li>
  <div class="favlist">
  <div class = "movie-fav-poster">
      <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
  </div>
  <div class = "movie-info">
      <h3 class = "movie-title">${details.Title}</h3>
      <ul class = "movie-misc-info">
          <li class = "year">Year: ${details.Year}</li>
          <li class = "rating">IMDB Rating: ${details.imdbRating}</li>
          <li class = "released">Released: ${details.Released}</li>
          <li> <button class="${movieId}" id="del" name="remove"}>Remove</button> </li>

      </ul>
     
      
  </div>
  </div>
  </li>
  `;

  //adding the above template to ul list
  ul.classList.add('fav-item');
  ul.appendChild(li);
  
  
}


//function to remove movie from local storage
function removeFav(id){
   console.log(id);
  localStorage.removeItem(id);
}



//functions which clear the whole/individual list when clicked
function handlerClick(e){
  if(e.target.name=='delete'){
    document.querySelector("ul").innerHTML="";    //deletes all the favourites list items
  }
}


function removelist(e){
  
  let delitem = e.target.parentNode;
  delitem.parentNode.parentNode.parentNode.remove();
  
  let temp = e.target.classList.value;
  
  localStorage.removeItem(temp);                //removes the key value in localstorage which has class containing the imdbID of the movie clicked
}

function handlerClick2(e){
  if(e.target.name=='remove'){
    removelist(e);
  }
}

