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
                <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} millions people</p>
                <p class="country__row"><span>🗣️</span>${languages[0].name}</p>
                <p class="country__row"><span>💰</span>${currencies[0].name}</p>
            </div>
        </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
}

const renderError = function(msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
    countriesContainer.style.opacity = 1;
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


// First example
/* const getCountryData = function(country) {
    // Country 1
    fetch(`https://restcountries.com/v2/name/${country}`)
        .then(response => {
            console.log(response);

            if (!response.ok)
                throw new Error(`Country not found (${response.status})`)

            return response.json();
        })
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
}); */


// Second example (simplified with the getJSON function)
/* 
const getJSON = function(url, errorMsg = 'Something went wrong') {
    return fetch(url).then(response => {
        if (!response.ok)
            throw new Error(`${errorMsg} (${response.status})`)
        return response.json();
    });
}

const getCountryData = function(country) {
    // Country 1
    getJSON(`https://restcountries.com/v2/name/${country}`, 'Country not found')

        .then(data => {
            renderCountry(data[0]); 
            const neighbour = data[0].borders[0];

            if (!neighbour) throw new Error('No neighbour found!');

            // Country 2
            return getJSON(`https://restcountries.com/v2/alpha/${neighbour}`, 'Country not found');
        })

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
 */
///////////////////////////////////////
// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.s
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating.
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

*/

// Challenge 1

/* const whereAmI = function (lat, lng) {
    fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
      .then(res => {
        if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log(data);
        console.log(`You are in ${data.city}, ${data.country}`);
  
        return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`);
      })
      .then(res => {
        if (!res.ok) throw new Error(`Country not found (${res.status})`);
  
        return res.json();
      })
      .then(data => renderCountry(data[0]))
      .catch(err => console.error(`${err.message} 💥`));
  };

whereAmI(52.508, 13.381);
whereAmI(19.037, 72.873);
whereAmI(-33.933, 18.474); */

// Testing the JS event loop
/* console.log('Test Start'); // 1
setTimeout(() => console.log('0 sec timer'), 0); // 5

Promise.resolve('Resolved promise 1').then(res => console.log(res)); // 3

Promise.resolve('Resolved promise 2').then(res => { // 4
    for (let i = 0; i < 100000; i++) {}
    console.log(res);
})

console.log('Test end'); // 2
 */


// Building promises - takes 1 argument (executor func)
/* const lotteryPromise = new Promise(function(resolve, reject) {
    console.log('Lottery draw is happening.')
    setTimeout(function() {
        if (Math.random() >= 0.5) {
            resolve('you win');
        } else {
            reject(new Error('you lost your money.'));
        }
    }, 2000)
});

// consuming the promise built before
lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

// Promisifying setTimeout (function that returns a promise - more real world example)
// can simplify with arrow function instead
const wait = function(seconds) {
    return new Promise(function(resolve) {
        setTimeout(resolve, seconds * 1000);
    });
}

// Consuming it
wait(2).then(() => {
    console.log('I waited 2 seconds');

    // have to return a new promise
    return wait(1);
}).then(() => console.log('I waited 1 second'));

// static method on the promise constructor - resolve immediatly
Promise.resolve('abc').then(x => console.log(x));
Promise.reject(new Error('Panic')).catch(x => console.error(x)); */

////////////////////////////////////////////////////////////////////////////////////


console.log('Getting position');

const getPosition = function() {
     return new Promise(function(resolve, reject) {
        /*
        navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            err => reject(err)
        );
        */
       // does the same as the commented block up
       navigator.geolocation.getCurrentPosition(resolve, reject);
    }); 
}

//getPosition().then(pos => console.log(pos));

const whereAmI = function () {

    getPosition()
        .then(pos => {
            const {latitude: lat, longitude: lng} = pos.coords;

            return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
        })
      .then(res => {
        if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log(data);
        console.log(`You are in ${data.city}, ${data.country}`);
  
        return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`);
      })
      .then(res => {
        if (!res.ok) throw new Error(`Country not found (${res.status})`);
  
        return res.json();
      })
      .then(data => renderCountry(data[0]))
      .catch(err => console.error(`${err.message} 💥`));
  };

  btn.addEventListener('click', whereAmI);
