'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function(data, className = '') {
    const languages = Object.values(data.languages);
    const currencies = Object.values(data.currencies);

    const html = `
        <article class="country ${className}">
            <img class="country__img" src="${data.flags.png}" />
            <div class="country__data">
                <h3 class="country__name">${data.name}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} millions</p>
                <p class="country__row"><span>🗣️</span>${languages[0].name}</p>
                <p class="country__row"><span>💰</span>${currencies[0].name}</p>
            </div>
        </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    //countriesContainer.style.opacity = 1;
}

const renderError = function(msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
    //countriesContainer.style.opacity = 1;
}

///////////////////////////////////////
// old method
/* const getCountryData = function (country) {
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
    request.send();
    
    request.addEventListener('load', function() {
        const [data] = JSON.parse(this.responseText);
        console.log(data);
        
        const languages = Object.values(data.languages);
        const currencies = Object.values(data.currencies);
    
        const html = `
            <article class="country">
                <img class="country__img" src="${data.flags.png}" />
                <div class="country__data">
                    <h3 class="country__name">${data.name.official}</h3>
                    <h4 class="country__region">${data.region}</h4>
                    <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} millions</p>
                    <p class="country__row"><span>🗣️</span>${languages[0]}</p>
                    <p class="country__row"><span>💰</span>${currencies[0].name}</p>
                </div>
            </article>
        `;
        countriesContainer.insertAdjacentHTML('beforeend', html);
        countriesContainer.style.opacity = 1;
    });
}

getCountryData('canada');
getCountryData('iceland');
getCountryData('sweden'); */


/*
const getCountryAndNeighbour = function (country) {

    // AJAX call country 1
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v2/name/${country}`);
    request.send();
    
    request.addEventListener('load', function() {
        const [data] = JSON.parse(this.responseText);
        console.log(data);

        // Render country 1
        renderCountry(data);

        // get neighbour country
        const [neighbour] = data.borders;

        if (!neighbour) return;

        // AJAX call country 2
        const request2 = new XMLHttpRequest();
        request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
        request2.send();

        // 1 call back inside of the other one.
        request2.addEventListener('load', function() {
            const data2 = JSON.parse(this.responseText);

            renderCountry(data2, 'neighbour');
        });
    });
}

getCountryAndNeighbour('canada'); */


// Promises with then method

/* const getCountryData = function(country) {
    fetch(`https://restcountries.com/v2/name/${country}`).then(function(response) {
        console.log(response);
        return response.json();
    }).then(function(data) {
        console.log(data);
        renderCountry(data[0]);
    });
} */


const getCountryData = function(country) {
    // Country 1
    fetch(`https://restcountries.com/v2/name/${country}`)
        .then(response => response.json())
        .then(data => {
            renderCountry(data[0]); 
            const neighbour = data[0].borders[0];

            if (!neighbour) return;

            // Country 2
            return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
        })
        .then(response => response.json())
        .then(data => renderCountry(data, 'neighbour'))
        // Handling errors
        .catch(err => {
            console.err(`${err}`);
            renderError(`Something went wrong: ${err.message}. Try again later.`);
        })
        .finally(() => {
            countriesContainer.style.opacity = 1;
        });
}

btn.addEventListener('click', function() {
    getCountryData('canada');
});
