'use strict'

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT;

// app.use(express.static('./data'));
app.use(cors());

// app.get('/', (request, response) => {
//   response.send('Home Page!');
// })

let weatherArray = [];

app.get('/location', (request, response) => {
  try {
    const geoData = require('./data/geo.json');
    const city = request.query.city;
    console.log(request.query);
    const locationData = new Location(city, geoData);
    response.send(locationData);
  }
  catch(error){
    errorHandler('so sorry, something went wrong.', request, response);
  }
});

//getting the weather 
app.get('/weather', (request, response) => {
  try {
    const weatherData = require('./data/darksky.json');
    // const weatherBuilder = new WeatherConstructor(daily, weatherData);
    weatherData.daily.data.forEach(obj =>{
      weatherArray.push(new WeatherConstructor (obj.time, obj.summary));
    })
    response.send(weatherArray);
    console.log(weatherArray);
  }
  catch(error){
    errorHandler('so sorry, something went wrong.', request, response);
  }
})

function WeatherConstructor(time, forecast){
  this.time = time;
  this.forecast = forecast;
}


function Location(city, geoData){
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

const errorHandler = (error, request, response) => {
  response.status(500).send(error);
}





app.listen(PORT, () => console.log('server up on Port'));

