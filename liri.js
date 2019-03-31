require("dotenv").config();

var keys = require("./key.js");

var axios = require("axios");

var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var nodeArgs = process.argv;

var action = nodeArgs[2];

var search = "";

var lineBreak = "\n----------------------------------------------\n";


//user input for search in api's
for(var i = 3; i < nodeArgs.length; i++){
    if(i > 3 && i < nodeArgs.length){
      search = search + '+' + nodeArgs[i];
    } 
    
    else{
      search += nodeArgs[i];
    }
  };



function liri(){

    //function to run BandsInTown search
    if(action === "concert-this"){
        axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp")

            .then(
                function(response) {
                    for (i = 0; i < response.data.length; i++){
                        console.log(lineBreak + 
                        "Venue: " + response.data[i].venue.name +
                        "\nLocation: " + response.data[i].venue.city + ", " + response.data[i].venue.country +
                        "\nDate: " + response.data[i].datetime + lineBreak);
                    }
                }
            )   
    }

    //function to run OMDB search
    if (action === "movie-this") {
        axios.get("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy")

            .then(
                function(response) {
                    console.log(lineBreak +
                        "Title: " + response.data.Title +
                        "\nYear: " + response.data.Year +
                        "\nIMDB Rating: " + response.data.imdbRating +
                        "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
                        "\nCountry: " + response.data.Country +
                        "\nLanguage: " + response.data.Language +
                        "\nPlot: " + response.data.Plot +
                        "\nActors: " + response.data.Actors + lineBreak);
                }
            );
    }

    //function to run Spotify search
    if (action === "spotify-this-song"){
        spotify
            .search({ type: 'track', query: search})
            .then(function(data) {
                console.log(lineBreak +
                    "Artist: " + data.tracks.items[0].artists[0].name +
                    "\nTrack: " + data.tracks.items[0].name +
                    "\nPreview Link: " + data.tracks.items[0].preview_url + 
                    "\nAlbum Name: " + data.tracks.items[0].album.name + lineBreak);
            })
                .catch(function(err) {
                    console.log(err);
                });
    }


    else{
        console.log("Please choose an action.");
    }
};

liri();

