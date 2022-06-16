// import { getMovieGenre } from './movie-genres';
import { getGenres, API_KEY } from './get-movies';
import { startLoader, stopLoader } from './loader.js';
import moviesListPatern from '../templates/list-of-movies.hbs';
import Notiflix from 'notiflix';
import axios from 'axios';

const BASE_URL = "https://api.themoviedb.org/3/discover/movie?";

const galleryEl = document.querySelector('.cards-collection');
const formEl = document.querySelector('.genre-search');
const searchGenreEl = document.querySelector('#genres');
const searchBtnOpen = document.querySelector('.search-btn--open');
const searchBtnClose = document.querySelector('.search-btn--close');
const searchBackdrop = document.querySelector('.search-form__wrap');

    renderGenresList();

let genresList;

formEl.addEventListener('click', (event) => {
    const formValue = event.target;
    event.preventDefault();

if (formValue.id === 'years') {
    
    if (formValue.value !== 'year') {
        loaderStartStop();
        onClickSearchBtnClose();
        Notiflix.Notify.success(`Hooray! Here your films by ${formValue.value} year!`);
        clearGallery();
        markupMoviesByYear(formValue.value);        
    }}

    
    if (formValue.id === 'genres') {

        let genreId;

        if (formValue.value !== 'genres') {
            loaderStartStop();
            onClickSearchBtnClose();
            Notiflix.Notify.success(`Hooray! Here your ${formValue.value} movies!`);
            for (const el of genresList) {

                if (el.name === formValue.value) {
                    genreId = el.id;
                }
            }
            clearGallery();
            markupMoviesByGenres(genreId);
        }
    }

    if (formValue.id === 'popularity') {

        if (formValue.value !== 'option') {
            loaderStartStop();
            onClickSearchBtnClose();
            Notiflix.Notify.success(`Hooray! We found most popular movies!`);
            clearGallery();
            markupMoviesByPopularity(formValue.value)
        }
    }

    formEl.reset();

})


searchBtnOpen.addEventListener('click', onClickSearchBtnOpen)
searchBtnClose.addEventListener('click', onClickSearchBtnClose)
function onClickSearchBtnOpen() {
    searchBackdrop.classList.add('is-open');
}

function onClickSearchBtnClose() {
    searchBackdrop.classList.remove('is-open');
}



function clearGallery() {
    galleryEl.innerHTML = '';
}

async function renderGenresList() {

    const response = await getGenres();
    genresList = response.genres;
    const genresItems = genresList.map(({ name }) => {
    return `<option value="${name}">${name}</option>`
}).join('');
searchGenreEl.insertAdjacentHTML('beforeend', genresItems)
}

function loaderStartStop() {
    startLoader();
    stopLoader();
}

async function getMoviesByGenres(genreId) {
    const url = `${BASE_URL}api_key=${API_KEY}&language=en-US&include_adult=false&include_video=false&page=1&with_genres=${genreId}`;
    const response = await axios.get(url);
    return response.data.results;
};

async function getMoviesByYear(year) {
    const url = `${BASE_URL}api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${year}-01-01&primary_release_date.lte=${year}-12-31`;
    const response = await axios.get(url);
    return response.data.results;
}

async function getMoviesByPopularity(param) {
    const url = `${BASE_URL}api_key=${API_KEY}&language=en-US&sort_by=${param}.desc&include_adult=false`;
    const response = await axios.get(url);
    return response.data.results;
}


function insertGenresToMoviesByPopularity(param) {
return getMoviesByPopularity(param).then(data => {
    return getGenres().then(genresList => {
    return data.map(movie => ({
        ...movie,
        release_date: movie.release_date.split('-')[0],
        genres: movie.genre_ids
        .map(id => genresList.genres.filter(el => el.id === id))
        .flat(),
    }))
    })
})
}

function markupMoviesByPopularity(param) {
    insertGenresToMoviesByPopularity(param).then(res => {
    res.map(element => {
    if (element.genres.length > 2) {
        const Obj = {name: "Інше"};
        element.genres[2] = Obj;
        element.genres.length = 3
    }
    })
        renderMoviesList(res);
}).catch(error => {
    console.log(error.message)
})
}


function insertGenresToMoviesByGenres(id) {
    return getMoviesByGenres(id).then(data => {
    return getGenres().then(genresList => {
    return data.map(movie => ({
        ...movie,
        release_date: movie.release_date.split('-')[0],
        genres: movie.genre_ids
        .map(id => genresList.genres.filter(el => el.id === id))
        .flat(),
    }))
    })
})
}

function markupMoviesByGenres(id) {
    insertGenresToMoviesByGenres(id).then(res => {
        res.map(element => {
    if (element.genres.length > 2) {
        const Obj = {name: "Інше"};
        element.genres[2] = Obj;
        element.genres.length = 3
    }
    })
        return renderMoviesList(res);
}).catch(error => {
    console.log(error.message)
})
}

function insertGenresToMoviesByYear(year) {
return getMoviesByYear(year).then(data => {
    return getGenres().then(genresList => {
    return data.map(movie => ({
        ...movie,
        release_date: movie.release_date.split('-')[0],
        genres: movie.genre_ids
        .map(id => genresList.genres.filter(el => el.id === id))
        .flat(),
    }))
    })
})
}

function markupMoviesByYear(year) {
    insertGenresToMoviesByYear(year).then(res => {
    res.map(element => {
    if (element.genres.length > 2) {
        const Obj = {name: "Інше"};
        element.genres[2] = Obj;
        element.genres.length = 3
    }
    })
        renderMoviesList(res);
}).catch(error => {
    console.log(error.message)
})
}

function renderMoviesList(movies) {
    const markup = moviesListPatern(movies)
    galleryEl.insertAdjacentHTML('beforeend', markup);
}



