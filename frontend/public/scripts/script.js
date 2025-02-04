const BASE_URL = "/api"; 
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";
let currentLanguage = "en-US";
let currentMovieId = null;
let genres = [];
let selectedGenres = [];

const translations = {
  "en-US": {
    searchPlaceholder: "Discover new movies...",
    surpriseMe: "Surprise Me",
    loading: "Loading...",
    mainCast: "Main Cast",
    similarMovies: "Similar Movies",
    trailer: "Trailer",
    birthdate: "Born:",
    deathdate: "Died:",
    knownFor: "Known For:",
    filmography: "Filmography",
    whereToWatch: "Where to Watch",
    mostViewedMovies: "Most Viewed Movies in",
    boxOfficeHits: "Box Office Hits",
    topRatedMovies: "Top Rated Movies",
    allGenres: "All Genres",
    moodTitle: "How are you feeling today?",
    moodSubtitle: "Select your mood for personalized movie recommendations",
    happy: "😊 Happy",
    sad: "😢 Sad",
    anxious: "😰 Anxious",
    bored: "😑 Bored",
    motivated: "💪 Motivated",
    recommendedForMood: "Recommended for your {mood} mood",
    searchResults: "Search Results",
  },
  "pt-BR": {
    searchPlaceholder: "Descubra novos filmes...",
    surpriseMe: "Surpreenda-me",
    loading: "Carregando...",
    mainCast: "Elenco Principal",
    similarMovies: "Filmes Similares",
    trailer: "Trailer",
    birthdate: "Nascimento:",
    deathdate: "Falecimento:",
    knownFor: "Conhecido por:",
    filmography: "Filmografia",
    whereToWatch: "Onde Assistir",
    mostViewedMovies: "Filmes mais vistos em",
    boxOfficeHits: "Sucessos de bilheteira",
    topRatedMovies: "Melhores avaliados",
    allGenres: "Todos os Gêneros",
    moodTitle: "Como você está se sentindo hoje?",
    moodSubtitle:
      "Selecione seu humor para recomendações personalizadas de filmes",
    happy: "😊 Feliz",
    sad: "😢 Triste",
    anxious: "😰 Ansioso",
    bored: "😑 Entediado",
    motivated: "💪 Motivado",
    recommendedForMood: "Recomendado para seu humor {mood}",
    searchResults: "Resultados da Busca",
  },
  "es-ES": {
    searchPlaceholder: "Descubre nuevas películas...",
    surpriseMe: "Sorpréndeme",
    loading: "Cargando...",
    mainCast: "Reparto Principal",
    similarMovies: "Películas Similares",
    trailer: "Tráiler",
    birthdate: "Nacimiento:",
    deathdate: "Fallecimiento:",
    knownFor: "Conocido por:",
    filmography: "Filmografía",
    whereToWatch: "Dónde Ver",
    mostViewedMovies: "Películas más vistas en",
    boxOfficeHits: "Éxitos de taquilla",
    topRatedMovies: "Mejor valoradas",
    allGenres: "Todos los Géneros",
    moodTitle: "¿Cómo te sientes hoy?",
    moodSubtitle:
      "Selecciona tu estado de ánimo para recomendaciones de películas personalizadas",
    happy: "😊 Feliz",
    sad: "😢 Triste",
    anxious: "😰 Ansioso",
    bored: "😑 Aburrido",
    motivated: "💪 Motivado",
    recommendedForMood: "Recomendado para tu estado de ánimo {mood}",
    searchResults: "Resultados de la Búsqueda",
  },
};

function formatRuntime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

function updateStarRating(rating) {
  const starRating = document.getElementById("star-rating");
  const ratingValue = document.getElementById("rating-value");
  starRating.innerHTML = "";
  const fullStars = Math.floor(rating / 2);
  const halfStar = rating % 2 >= 1;

  for (let i = 0; i < 5; i++) {
    const star = document.createElement("span");
    star.className = "star";
    if (i < fullStars) {
      star.innerHTML = '<i class="fa-solid fa-star"></i>';
    } else if (i === fullStars && halfStar) {
      star.innerHTML = '<i class="fa-solid fa-star-half-stroke"></i>';
    } else {
      star.innerHTML = '<i class="fa-regular fa-star"></i>';
    }
    starRating.appendChild(star);
  }

  ratingValue.textContent = `${rating.toFixed(1)}/10`;
}

async function performSearch() {
  const query = document.getElementById("search-input").value;
  if (query.trim() === "") return;

  try {
    const searchResponse = await axios.get(`${BASE_URL}/search`, {
      params: {
        language: currentLanguage,
        query: query
      }
    });

    if (searchResponse.data.length > 0) {
      displaySearchResults(searchResponse.data);
    } else {
      alert("No results found for your search.");
    }
  } catch (error) {
    console.error("Error searching for movies:", error);
    alert("An error occurred while searching for movies. Please try again later.");
  }
}

document
  .getElementById("search-button")
  .addEventListener("click", performSearch);

document
  .getElementById("search-input")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      performSearch();
    }
  });

function updateLanguage() {
  document.getElementById("search-input").placeholder =
    translations[currentLanguage].searchPlaceholder;
  document.getElementById("surprise-me").textContent =
    translations[currentLanguage].surpriseMe;
  document.querySelector("#most-viewed .section-title").textContent = `${
    translations[currentLanguage].mostViewedMovies
  } ${new Date().getFullYear()}`;
  document.querySelector("#box-office-hits .section-title").textContent =
    translations[currentLanguage].boxOfficeHits;
  document.querySelector("#top-rated .section-title").textContent =
    translations[currentLanguage].topRatedMovies;

  // Update mood input text
  document.querySelector(".mood-title").textContent =
    translations[currentLanguage].moodTitle;
  document.querySelector(".mood-subtitle").textContent =
    translations[currentLanguage].moodSubtitle;

  // Update mood buttons text
  const moodButtons = document.querySelectorAll(".mood-buttons button");
  moodButtons.forEach((button) => {
    const mood = button.getAttribute("data-mood");
    button.querySelector("span").textContent =
      translations[currentLanguage][mood];
  });

  if (document.getElementById("movie-details").style.display !== "none") {
    document.querySelector(
      "#movie-details .section-title:nth-of-type(1)"
    ).textContent = translations[currentLanguage].trailer;
    document.querySelector(
      "#movie-details .section-title:nth-of-type(2)"
    ).textContent = translations[currentLanguage].mainCast;
    document.querySelector(
      "#movie-details .section-title:nth-of-type(3)"
    ).textContent = translations[currentLanguage].whereToWatch;
    document.querySelector(
      "#movie-details .section-title:nth-of-type(4)"
    ).textContent = translations[currentLanguage].similarMovies;
  }

  updateGenreFilter();
}

const moodGenreMap = {
  happy: {
    genres: [35, 12, 16, 10402],
    translations: {
      "en-US": "happy",
      "pt-BR": "feliz",
      "es-ES": "feliz",
    },
  },
  sad: {
    genres: [18, 10749, 10751],
    translations: {
      "en-US": "sad",
      "pt-BR": "triste",
      "es-ES": "triste",
    },
  },
  anxious: {
    genres: [99, 36, 10402],
    translations: {
      "en-US": "anxious",
      "pt-BR": "ansioso",
      "es-ES": "ansioso",
    },
  },
  bored: {
    genres: [28, 878, 53, 9648],
    translations: {
      "en-US": "bored",
      "pt-BR": "entediado",
      "es-ES": "aburrido",
    },
  },
  motivated: {
    genres: [10752, 37, 80, 36],
    translations: {
      "en-US": "motivated",
      "pt-BR": "motivado",
      "es-ES": "motivado",
    },
  },
};

function handleMoodSelection() {
  const moodButtons = document.querySelectorAll(".mood-buttons button");
  moodButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const selectedMood = button.getAttribute("data-mood");
      await fetchMoodRecommendations(selectedMood);
    });
  });
}

async function fetchMoodRecommendations(mood) {
  try {
    console.log("Fetching mood recommendations for:", mood);
    
    const response = await axios.get(`${BASE_URL}/mood/${mood}/${currentLanguage}`);
    console.log("API response:", response.data);

    const recommendations = response.data.slice(0, 10);
    updateMoodRecommendations(recommendations, mood);
  } catch (error) {
    console.error("Error fetching mood recommendations:", error);
  }
}

function updateMoodRecommendations(movies, mood) {
  const moodRecommendationsSection = document.getElementById(
    "mood-recommendations"
  );
  const movieList = moodRecommendationsSection.querySelector(".movie-list");
  const sectionTitle =
    moodRecommendationsSection.querySelector(".section-title");

  const translatedMood = moodGenreMap[mood].translations[currentLanguage];
  sectionTitle.textContent = translations[
    currentLanguage
  ].recommendedForMood.replace("{mood}", translatedMood);

  movieList.innerHTML = "";

  movies.forEach((movie) => {
    const movieItem = document.createElement("div");
    movieItem.className = "movie-item";
    movieItem.innerHTML = `
      <img class="movie-poster" src="${movie.poster_path ? IMG_BASE_URL + movie.poster_path : '/path/to/placeholder-image.jpg'}" alt="${movie.title}" loading="lazy">
      <p class="movie-item-title">${movie.title}</p>
    `;
    movieItem.addEventListener("click", () => fetchMovieData(movie.id));
    movieList.appendChild(movieItem);
  });

  addHorizontalScroll(movieList);
  moodRecommendationsSection.style.display = "block";
  document.getElementById("main-content").style.display = "block";
  document.getElementById("movie-details").style.display = "none";
}

async function fetchGenres() {
  try {
    const response = await axios.get(`${BASE_URL}/genres`, {
      params: { language: currentLanguage }
    });
    genres = response.data;
    updateGenreFilter();
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
}

function updateGenreFilter() {
  const genreFilter = document.getElementById("genre-filter");
  genreFilter.innerHTML = "";

  const allGenresButton = document.createElement("button");
  allGenresButton.textContent = translations[currentLanguage].allGenres;
  allGenresButton.classList.add("active");
  allGenresButton.addEventListener("click", () => {
    selectedGenres = [];
    updateGenreButtonStates();
    fetchMovieLists();
  });
  genreFilter.appendChild(allGenresButton);

  genres.forEach((genre) => {
    const button = document.createElement("button");
    button.textContent = genre.name;
    button.addEventListener("click", () => {
      const index = selectedGenres.indexOf(genre.id);
      if (index > -1) {
        selectedGenres.splice(index, 1);
      } else {
        selectedGenres.push(genre.id);
      }
      updateGenreButtonStates();
      fetchMovieLists();
    });
    genreFilter.appendChild(button);
  });
}

function updateGenreButtonStates() {
  const buttons = document.querySelectorAll("#genre-filter button");
  buttons.forEach((button) => {
    if (button.textContent === translations[currentLanguage].allGenres) {
      button.classList.toggle("active", selectedGenres.length === 0);
    } else {
      const genre = genres.find((g) => g.name === button.textContent);
      if (genre) {
        button.classList.toggle("active", selectedGenres.includes(genre.id));
      }
    }
  });
}

async function fetchMovieLists() {
  const currentYear = new Date().getFullYear();
  const genreParam = selectedGenres.length > 0 ? selectedGenres.join(",") : "";
  
  try {
    const [mostViewed, boxOffice, topRated] = await Promise.all([
      axios.get(`${BASE_URL}/discover/most-viewed`, {
        params: {
          language: currentLanguage,
          year: currentYear,
          genres: genreParam
        }
      }),
      axios.get(`${BASE_URL}/discover/box-office`, {
        params: {
          language: currentLanguage,
          genres: genreParam
        }
      }),
      axios.get(`${BASE_URL}/discover/top-rated`, {
        params: {
          language: currentLanguage,
          genres: genreParam
        }
      })
    ]);

    updateMovieList('most-viewed', mostViewed.data.results.slice(0, 10));
    updateMovieList('box-office-hits', boxOffice.data.results.slice(0, 10));
    updateMovieList('top-rated', topRated.data.results.slice(0, 10));
  } catch (error) {
    console.error('Error fetching movie lists:', error);
  }
}

function updateMovieList(listId, movies) {
  const movieList = document.querySelector(`#${listId} .movie-list`);
  movieList.innerHTML = "";
  movies.forEach((movie) => {
    const movieItem = document.createElement("div");
    movieItem.className = "movie-item";
    movieItem.innerHTML = `
          <img class="movie-poster" src="${IMG_BASE_URL}${movie.poster_path}" alt="${movie.title}" loading="lazy">
          <p class="movie-item-title">${movie.title}</p>
        `;
    movieItem.addEventListener("click", () => fetchMovieData(movie.id));
    movieList.appendChild(movieItem);
  });

  addHorizontalScroll(movieList);
}

async function fetchMovieData(movieId = null) {
  try {
    if (!movieId) {
      const randomPage = Math.floor(Math.random() * 500) + 1;
      const genreParam = selectedGenres.length > 0 ? selectedGenres.join(",") : "";
      const randomMovieResponse = await axios.get(`${BASE_URL}/discover/random`, {
        params: {
          language: currentLanguage,
          genres: genreParam,
          page: randomPage
        }
      });
      movieId = randomMovieResponse.data.results[
        Math.floor(Math.random() * randomMovieResponse.data.results.length)
      ].id;
    }

    currentMovieId = movieId;
    const movieResponse = await axios.get(`${BASE_URL}/movies/${movieId}/${currentLanguage}`);
    const movie = movieResponse.data;

    updateUI(movie);
    showMovieDetails();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const searchResultsContainer = document.getElementById("search-results");
    if (searchResultsContainer) {
      searchResultsContainer.style.display = "none";
    }
  } catch (error) {
    console.error("Error fetching movie data:", error);
  }
}

function showMovieDetails() {
  document.getElementById("main-content").style.display = "none";
  document.getElementById("movie-details").style.display = "block";
}

function showMainContent() {
  document.getElementById("main-content").style.display = "block";
  document.getElementById("movie-details").style.display = "none";
  const searchResultsContainer = document.getElementById("search-results");
  if (searchResultsContainer) {
    searchResultsContainer.style.display = "none";
  }
}

async function updateUI(movie) {
  document.getElementById("movie-title").textContent = movie.title;
  document.getElementById("movie-meta").textContent = `${formatDate(
    movie.release_date
  )} | ${formatRuntime(movie.runtime)} | ★ ${movie.vote_average.toFixed(1)}`;
  document.getElementById("movie-overview").textContent = movie.overview;
  document.getElementById(
    "movie-header"
  ).style.backgroundImage = `url(${IMG_BASE_URL}${
    movie.backdrop_path || movie.poster_path
  })`;

  updateGenreTags(movie.genres);
  updateStarRating(movie.vote_average);
  updateTrailer(movie.videos.results);
  updateCast(movie.credits.cast);
  updateProviders(movie["watch/providers"].results);
  updateSimilarMovies(movie.similar.results);

  await addRedeCanaisButton(movie);
}

function updateGenreTags(genres) {
  const genreTagsContainer = document.getElementById("genre-tags");
  genreTagsContainer.innerHTML = "";
  genres.forEach((genre) => {
    const genreTag = document.createElement("span");
    genreTag.className = "genre-tag";
    genreTag.textContent = genre.name;
    genreTagsContainer.appendChild(genreTag);
  });
}

function updateTrailer(videos) {
  const trailerContainer = document.getElementById("trailer-container");
  trailerContainer.innerHTML = "";
  const trailer = videos.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );
  if (trailer) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
    iframe.allowFullscreen = true;
    trailerContainer.appendChild(iframe);
  } else {
    trailerContainer.textContent = "No trailer available";
  }
}

function addHorizontalScroll(element) {
  element.addEventListener("wheel", (event) => {
    if (event.deltaY !== 0) {
      event.preventDefault();
      element.scrollLeft += event.deltaY * 3;
    }
  });
}

function updateCast(cast) {
  const castList = document.getElementById("cast-list");
  castList.innerHTML = "";
  cast.slice(0, 5).forEach((actor) => {
    const castItem = document.createElement("div");
    castItem.className = "cast-item";
    castItem.innerHTML = `
          <img class="cast-photo" src="${IMG_BASE_URL}${actor.profile_path}" alt="${actor.name}" loading="lazy">
          <p class="cast-name">${actor.name}</p>
        `;
    castItem.addEventListener("click", () => openActorPopup(actor.id));
    castList.appendChild(castItem);
  });

  addHorizontalScroll(castList);
}

function updateProviders(providers) {
  const providersContainer = document.getElementById("providers-container");
  providersContainer.innerHTML = "";

  const country = currentLanguage.split("-")[1];
  const countryProviders = providers[country];

  if (
    countryProviders &&
    (countryProviders.flatrate || countryProviders.rent || countryProviders.buy)
  ) {
    const providerList = document.createElement("div");
    providerList.className = "provider-list";

    const allProviders = [
      ...(countryProviders.flatrate || []),
      ...(countryProviders.rent || []),
      ...(countryProviders.buy || []),
    ];

    const uniqueProviders = allProviders.filter(
      (provider, index, self) =>
        index === self.findIndex((t) => t.provider_id === provider.provider_id)
    );

    uniqueProviders.forEach((provider) => {
      const providerItem = document.createElement("div");
      providerItem.className = "provider-item";
      providerItem.innerHTML = `
            <img class="provider-logo" src="${IMG_BASE_URL}${provider.logo_path}" alt="${provider.provider_name}" loading="lazy">
            <span class="provider-name">${provider.provider_name}</span>
          `;
      providerList.appendChild(providerItem);
    });

    providersContainer.appendChild(providerList);
  } else {
    providersContainer.textContent =
      "No streaming information available for your region.";
  }
}

function updateSimilarMovies(similarMovies) {
  const similarMoviesContainer = document.getElementById("similar-movies");
  similarMoviesContainer.innerHTML = "";
  similarMovies.slice(0, 6).forEach((similar) => {
    const similarMovie = document.createElement("div");
    similarMovie.className = "similar-movie";
    similarMovie.innerHTML = `
          <img src="${IMG_BASE_URL}${similar.poster_path}" alt="${
      similar.title
    }" loading="lazy">
          <div class="similar-movie-info">
            <h3 class="similar-movie-title">${similar.title}</h3>
            <p class="similar-movie-year">${
              similar.release_date.split("-")[0]
            }</p>
          </div>
        `;
    similarMovie.addEventListener("click", () => fetchMovieData(similar.id));
    similarMoviesContainer.appendChild(similarMovie);
  });
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(currentLanguage, options);
}

function openActorPopup(actorId) {
  document.body.classList.add("popup-open");
  showPopup(actorId);
}

function closeActorPopup() {
  document.body.classList.remove("popup-open");
  document.getElementById("popup-overlay").style.display = "none";
}

async function showPopup(actorId) {
  const popupOverlay = document.getElementById("popup-overlay");
  const popupTitle = document.getElementById("popup-title");
  const popupImage = document.getElementById("popup-image");
  const popupInfo = document.getElementById("popup-info");
  const popupBio = document.getElementById("popup-bio");
  const popupFilmography = document.getElementById("popup-filmography");

  // Reset popup content
  popupTitle.textContent = translations[currentLanguage].loading;
  popupImage.src = "";
  popupInfo.innerHTML = "";
  popupBio.textContent = "";
  popupFilmography.innerHTML = "";
  popupOverlay.style.display = "flex";

  try {
    const response = await axios.get(`${BASE_URL}/person/${actorId}`, {
      params: { language: currentLanguage }
    });
    const actorInfo = response.data;

    popupTitle.textContent = actorInfo.name;
    popupImage.src = `${IMG_BASE_URL}${actorInfo.profile_path}`;
    popupImage.alt = actorInfo.name;

    let infoHtml = "";
    if (actorInfo.birthday) {
      infoHtml += `<p>${translations[currentLanguage].birthdate} ${formatDate(actorInfo.birthday)}</p>`;
    }
    if (actorInfo.deathday) {
      infoHtml += `<p>${translations[currentLanguage].deathdate} ${formatDate(actorInfo.deathday)}</p>`;
    }
    infoHtml += `<p>${translations[currentLanguage].knownFor} ${actorInfo.known_for_department}</p>`;
    popupInfo.innerHTML = infoHtml;

    popupBio.textContent = actorInfo.biography;

    const filmographyHtml = `
      <h3>${translations[currentLanguage].filmography}</h3>
      <ul>
        ${actorInfo.combined_credits.cast
          .slice(0, 10)
          .map(movie => `
            <li data-movie-id="${movie.id}">
              ${movie.title || movie.name} 
              (${(movie.release_date || movie.first_air_date || "").split("-")[0]})
            </li>
          `).join("")}
      </ul>
    `;
    popupFilmography.innerHTML = filmographyHtml;

    // Add click event listeners to filmography items
    popupFilmography.querySelectorAll("li").forEach(item => {
      item.addEventListener("click", (event) => {
        const movieId = event.target.getAttribute("data-movie-id");
        fetchMovieData(movieId);
        closeActorPopup();
      });
    });
  } catch (error) {
    console.error("Error loading actor information:", error);
    popupTitle.textContent = "Error";
    popupBio.textContent = "Error loading actor information. Please try again later.";
  }
}

document
  .querySelector(".popup-close")
  .addEventListener("click", closeActorPopup);

document
  .getElementById("language-select")
  .addEventListener("change", (event) => {
    currentLanguage = event.target.value;
    updateLanguage();
    fetchGenres();
    if (document.getElementById("movie-details").style.display !== "none") {
      if (currentMovieId) {
        fetchMovieData(currentMovieId);
      } else {
        fetchMovieData();
      }
    } else {
      fetchMovieLists();
    }
  });

const redeCanaisMovies = [
  {
    title: "#Alive (Dublado)",
    year: 2020,
    quality: "1080p",
    url: "https://redecanais.fi/alive-dublado-2020-1080p_34bae61d1.html",
  },
  {
    title: "#ComVocê: Volume: 1 (Dublado)",
    year: 2022,
    quality: "1080p",
    url: "https://redecanais.fi/comvoce-volume-1-dublado-2022-1080p_8042e6c01.html",
  },
  {
    title: "#Horror (Dublado)",
    year: 2015,
    quality: "1080p",
    url: "https://redecanais.fi/horror-dublado-2015-1080p_fedce1243.html",
  },
  {
    title: "#Natal (Dublado)",
    year: 2022,
    quality: "1080p",
    url: "https://redecanais.fi/natal-dublado-2022-1080p_dabfe3667.html",
  },
  {
    title: "Zumbilândia: Atire Duas Vezes (Dublado)",
    year: 2019,
    quality: "1080p",
    url: "https://redecanais.fi/zumbilandia-atire-duas-vezes-dublado-2019-1080p-1_ccc7e9bad.html",
  },
  {
    title: "Zumbilândia: Atire Duas Vezes (Legendado)",
    year: 2019,
    quality: "1080p",
    url: "https://redecanais.fi/zumbilandia-atire-duas-vezes-legendado-2019-1080p_ff90c0cc8.html",
  },
  {
    title: "Zumbilênio: O Parque dos Monstros (Dublado)",
    year: 2017,
    quality: "1080p",
    url: "https://redecanais.fi/zumbilenio-o-parque-dos-monstros-dublado-2017-1080p_aad263015.html",
  },
  {
    title: "Zumbis e Robôs (Dublado)",
    year: 2013,
    quality: "1080p",
    url: "https://redecanais.fi/zumbis-e-robos-dublado-2013-1080p_b0bad79ca.html",
  },
  {
    title: "Zuzu Angel (Nacional)",
    year: 2006,
    quality: "1080p",
    url: "https://redecanais.fi/zuzu-angel-nacional-2006-1080p_e6c9f8a4a.html",
  },
  {
    title: "Zuzubalândia: O Filme (Nacional)",
    year: 2024,
    quality: "1080p",
    url: "https://redecanais.fi/zuzubalandia-o-filme-nacional-2024-1080p_468675715.html",
  },
];

// Função para normalizar texto (remover acentos e caracteres especiais)
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "");
}

async function getPortugueseTitle(tmdbId) {
  try {
    const response = await axios.get(`${BASE_URL}/movies/${tmdbId}/portuguese-title`);
    return response.data.title;
  } catch (error) {
    console.error('Error fetching Portuguese title:', error);
    return null;
  }
}

// Modificar a função findRedeCanaisMovie para ser assíncrona
async function findRedeCanaisMovie(title, year, language, tmdbId) {
  const normalizedSearchTitle = normalizeText(title);
  const isPortuguese = language === 'pt-BR';
  
  // Se não for português, tenta buscar o título em português
  let ptTitle = null;
  if (!isPortuguese) {
      ptTitle = await getPortugueseTitle(tmdbId);
  }

  // Array de títulos para procurar
  const titlesToSearch = [title];
  if (ptTitle) {
      titlesToSearch.push(ptTitle);
  }

  const cleanTitle = (movieTitle) => {
      return movieTitle
          .replace(' (Dublado)', '')
          .replace(' (Legendado)', '')
          .replace(' (Nacional)', '');
  };

  // Função para verificar correspondência de título
  const titleMatches = (movieTitle, searchTitle) => {
      const normalizedTitle = normalizeText(cleanTitle(movieTitle));
      const normalizedSearch = normalizeText(searchTitle);
      const searchWords = normalizedSearch.split(' ');
      return searchWords.every(word => normalizedTitle.includes(word));
  };

  // Busca com todos os títulos disponíveis
  for (const searchTitle of titlesToSearch) {
      // Primeira busca: prioridade baseada no idioma
      let movie = redeCanaisMovies.find(movie => {
          if (!titleMatches(movie.title, searchTitle) || movie.year !== year) return false;
          
          if (isPortuguese) {
              return movie.title.includes('(Dublado)') || movie.title.includes('(Nacional)');
          } else {
              return movie.title.includes('(Legendado)');
          }
      });

      // Segunda busca: versão alternativa
      if (!movie) {
          movie = redeCanaisMovies.find(movie => {
              if (!titleMatches(movie.title, searchTitle) || movie.year !== year) return false;
              
              if (isPortuguese) {
                  return movie.title.includes('(Legendado)');
              } else {
                  return movie.title.includes('(Dublado)') || movie.title.includes('(Nacional)');
              }
          });
      }

      // Terceira busca: qualquer versão
      if (!movie) {
          movie = redeCanaisMovies.find(movie => {
              return titleMatches(movie.title, searchTitle) && movie.year === year;
          });
      }

      if (movie) return movie;
  }

  return null;
}

// Função para adicionar botão do Rede Canais
async function addRedeCanaisButton(movie) {
  const existingButtons = document.querySelectorAll('.rede-canais-button-container');
  existingButtons.forEach(button => button.remove());

  const movieYear = parseInt(movie.release_date.split('-')[0]);
  const redeCanaisMovie = await findRedeCanaisMovie(movie.title, movieYear, currentLanguage, movie.id);

  if (redeCanaisMovie) {
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'rede-canais-button-container';
      
      let audioType = '';
      if (redeCanaisMovie.title.includes('(Dublado)')) {
          audioType = 'Dublado';
      } else if (redeCanaisMovie.title.includes('(Legendado)')) {
          audioType = 'Legendado';
      } else if (redeCanaisMovie.title.includes('(Nacional)')) {
          audioType = 'Nacional';
      }
      
      buttonContainer.innerHTML = `
          <a href="#" 
             class="watch-rede-canais-btn" 
             data-movie-url="${redeCanaisMovie.url}">
              <i class="fas fa-play-circle"></i>
              Assistir no Rede Canais
              <span class="quality-badge">${redeCanaisMovie.quality}</span>
              <span class="audio-badge">${audioType}</span>
          </a>
      `;

      buttonContainer.querySelector('.watch-rede-canais-btn').addEventListener('click', (e) => {
          e.preventDefault();
          const movieUrl = e.currentTarget.getAttribute('data-movie-url');
          showDnsPopup(movieUrl);
      });

      const movieContent = document.querySelector('.movie-content');
      movieContent.insertBefore(buttonContainer, movieContent.firstChild);
  }
}

// Função para mostrar o popup
function showDnsPopup(movieUrl) {
  const popup = document.getElementById('dns-popup');
  popup.style.display = 'flex';

  // Configurar botões
  document.getElementById('continue-to-movie').onclick = () => {
      window.open(movieUrl, '_blank');
      popup.style.display = 'none';
  };

  document.getElementById('close-popup').onclick = () => {
      popup.style.display = 'none';
  };

  // Fechar ao clicar fora do popup
  popup.onclick = (e) => {
      if (e.target === popup) {
          popup.style.display = 'none';
      }
  };
}

function displaySearchResults(results) {
  console.log("Displaying search results:", results); // Debug log

  const mainContent = document.getElementById("main-content");
  const movieDetails = document.getElementById("movie-details");
  let searchResultsContainer = document.getElementById("search-results");

  // Create search results container if it doesn't exist
  if (!searchResultsContainer) {
    console.log("Creating new search results container"); // Debug log
    searchResultsContainer = document.createElement("div");
    searchResultsContainer.id = "search-results";
    document.body.insertBefore(searchResultsContainer, movieDetails);
  }

  const searchResultsHTML = `
      <h2 class="section-title">${
        translations[currentLanguage].searchResults
      }</h2>
      <div class="movie-list">
        ${results
          .map(
            (movie) => `
          <div class="movie-item" data-movie-id="${movie.id}">
            <img class="movie-poster" src="${
              movie.poster_path
                ? IMG_BASE_URL + movie.poster_path
                : "/path/to/placeholder-image.jpg"
            }" alt="${movie.title}">
            <p class="movie-item-title">${movie.title}</p>
          </div>
        `
          )
          .join("")}
      </div>
    `;

  searchResultsContainer.innerHTML = searchResultsHTML;
  console.log("Search results HTML:", searchResultsHTML); // Debug log

  mainContent.style.display = "none";
  movieDetails.style.display = "none";
  searchResultsContainer.style.display = "block";

  // Add click event listeners to search result items
  const searchResultItems = document.querySelectorAll(
    "#search-results .movie-item"
  );
  searchResultItems.forEach((item) => {
    item.addEventListener("click", () => {
      const movieId = item.getAttribute("data-movie-id");
      fetchMovieData(movieId);
    });
  });

  // Add horizontal scroll functionality to search results
  const movieList = searchResultsContainer.querySelector(".movie-list");
  addHorizontalScroll(movieList);

  console.log("Search results displayed"); // Debug log
}

document.getElementById("surprise-me").addEventListener("click", () => {
  fetchMovieData();
});

document.querySelector(".logo").addEventListener("click", () => {
  showMainContent();
  fetchMovieLists();
});

handleMoodSelection();
updateLanguage();
fetchGenres();
fetchMovieLists();
