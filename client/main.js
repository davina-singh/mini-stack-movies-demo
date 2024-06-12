const form = document.getElementById("form"); // get the form by it id - we care about the inputs with the name attribute
const movieContainer = document.getElementById("movie-container"); // container where movies will be put
// add a variable for the url so that you do not need to write it everytime and can easily change it if needed
const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://your-render-app-url";
// listen for submit on the form
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // do not do the default setting of reloading the page
  // it will look in the form and get the values of the inputs and create and object which has a movie and year properties that are equal to the values of the inputs
  const formData = new FormData(form);
  const movieData = Object.fromEntries(formData);
  // send the url and the options object (extra things to tell the server)
  const response = await fetch(`${baseURL}/movies`, {
    method: "POST", // post method being used
    headers: {
      "Content-type": "application/json", // which is json
    },
    body: JSON.stringify(movieData), // stringify the data you send
  });
  // ok is a boolean value that is true or false so if the response is ok then display the movies by calling the function
  if (response.ok) {
    // redisplay movies with the new movies included (could cause optimisation problems if lots of movies)
    displayMovies();
  } else {
    console.error("Failed to add movie", response.status);
  }
});
// fetches all movies and returns them
async function fetchMovies() {
  const movies = await fetch(`${baseURL}/movies`);
  // parsed into an array instead of beinfg json
  let result = await movies.json(); // turn the result back into an object of movies
  return result;
}

async function displayMovies() {
  // movies is an array of all movies in the db
  let movies = await fetchMovies();
  // reset the movie container in the html to be nothing so that you do not create duplicates
  movieContainer.innerHTML = " ";
  // loop through the movies and create a new h3 and p tag for them
  movies.forEach((movie) => {
    let h4Tag = document.createElement("h4");
    let pTag = document.createElement("p");
    let imgTag = document.createElement("img");
    let delButton = document.createElement("p");
    // creates some divs for the update info to go in
    let infoDiv = document.createElement(`div`);
    let movieCard = document.createElement("div");

    h4Tag.textContent = movie.movie;
    pTag.textContent = movie.year;
    imgTag.src = movie.imgURL;
    delButton.textContent = "X";
    // update inputs
    const updateDiv = document.createElement("div");
    const updateYear = document.createElement("input");
    updateYear.setAttribute("name", "year");
    updateYear.value = movie.year;

    const updateMovie = document.createElement("input");
    updateMovie.setAttribute("name", "movie");
    updateMovie.value = movie.movie;

    const updateImgUrl = document.createElement("input");
    updateImgUrl.setAttribute("name", "imgURL");
    updateImgUrl.value = movie.imgURL;

    const updateButton = document.createElement("button");
    updateButton.textContent = "update";
    updateButton.setAttribute("type", "submit");

    const updateForm = document.createElement("form");
    // listen to changes on form
    updateForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(updateForm);
      const info = Object.fromEntries(formData);
      handleUpdate(movie.id, info);
    });
    // append inputs to form
    updateForm.appendChild(updateMovie);
    updateForm.appendChild(updateYear);
    updateForm.appendChild(updateImgUrl);
    updateForm.appendChild(updateButton);
    updateDiv.appendChild(updateForm);

    delButton.addEventListener("click", (e) => {
      e.preventDefault();
      handleDelete(movie.id);
    });
    // display the movies on the page
    infoDiv.appendChild(h4Tag);
    infoDiv.appendChild(pTag);
    movieCard.appendChild(delButton);
    movieCard.appendChild(imgTag);
    movieCard.appendChild(infoDiv);
    movieCard.appendChild(updateDiv);
    movieContainer.appendChild(movieCard);
  });
}

displayMovies();

async function handleDelete(id) {
  const result = await fetch(`${baseURL}/movies/${id}`, {
    method: "DELETE",
  });
  if (result.ok) {
    displayMovies();
  }
}

async function handleUpdate(id, updatedInfo) {
  const result = await fetch(`${baseURL}/movies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedInfo),
  });
  if (result.ok) {
    displayMovies();
  }
}
// for each of the movies

// create an inout for the movie title, imgUrl year
// set the values of each of the inputs to be what the current value of the movie is
// add a button to submit
// when submited make a put request
