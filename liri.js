require("dotenv").config();

var keys = require("./key.js");

var axios = require("axios");

var fs = require("fs");

var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var moment = require('moment');

var nodeArgs = process.argv;

var action = nodeArgs[2];

var search = "";

var lineBreak = "\n----------------------------------------------\n";


//user input for search in api's
for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        search = search + '+' + nodeArgs[i];
    }

    else {
        search += nodeArgs[i];
    }
};



function liri() {

    //function to run BandsInTown search
    if (action === "concert-this") {
        axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp")

            .then(
                function (response) {
                    for (i = 0; i < response.data.length; i++) {
                        console.log(lineBreak +
                            "Venue: " + response.data[i].venue.name +
                            "\nLocation: " + response.data[i].venue.city + ", " + response.data[i].venue.country +
                            "\nDate: " + moment(response.data[i].datetime).format("MM/DD/YYYY") + lineBreak);

                        var logArtist =
                            lineBreak +
                            "Venue: " + response.data[i].venue.name +
                            "\nLocation: " + response.data[i].venue.city + ", " + response.data[i].venue.country +
                            "\nDate: " + moment(response.data[i].datetime).format("MM/DD/YYYY") + lineBreak;

                        fs.appendFile("log.txt", logArtist, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                        })
                    }
                }
            )
    }

    //function to run OMDB search
    else if (action === "movie-this") {

        if (!search) {
            search = "Mr. Nobody";
        }

        console.log(search);

        axios.get("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy")

            .then(
                function (response) {
                    console.log(lineBreak +
                        "Title: " + response.data.Title +
                        "\nYear: " + response.data.Year +
                        "\nIMDB Rating: " + response.data.imdbRating +
                        "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
                        "\nCountry: " + response.data.Country +
                        "\nLanguage: " + response.data.Language +
                        "\nPlot: " + response.data.Plot +
                        "\nActors: " + response.data.Actors + lineBreak);

                    var logMovie =
                        lineBreak +
                        "Title: " + response.data.Title +
                        "\nYear: " + response.data.Year +
                        "\nIMDB Rating: " + response.data.imdbRating +
                        "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
                        "\nCountry: " + response.data.Country +
                        "\nLanguage: " + response.data.Language +
                        "\nPlot: " + response.data.Plot +
                        "\nActors: " + response.data.Actors + lineBreak;

                    fs.appendFile("log.txt", logMovie, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                }
            )
            .catch((err) => {
                console.log(err);
            })

    }

    //function to run Spotify search
    else if (action === "spotify-this-song") {

        if (!search) {
            search = "The Sign";
        }

        console.log(search);

        spotify
            .search({ type: 'track', query: search })
            .then(function (data) {
                console.log(lineBreak +
                    "Artist: " + data.tracks.items[0].artists[0].name +
                    "\nTrack: " + data.tracks.items[0].name +
                    "\nPreview Link: " + data.tracks.items[0].href +
                    "\nAlbum Name: " + data.tracks.items[0].album.name + lineBreak);

                var logSong =
                    lineBreak +
                    "Artist: " + data.tracks.items[0].artists[0].name +
                    "\nTrack: " + data.tracks.items[0].name +
                    "\nPreview Link: " + data.tracks.items[0].href +
                    "\nAlbum Name: " + data.tracks.items[0].album.name + lineBreak;

                fs.appendFile("log.txt", logSong, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                })

            })
            .catch(function (err) {
                console.log(err);
            });
    }

    else if (action === "do-what-it-says") {
        fs.readFile("random.txt", "utf8", function(err, data){
            if (err){
                console.log(err);
            }

            console.log(data);

            var dataArr = data.split(",");

            console.log(dataArr);
        })
    }


    else {
        console.log("Please choose an action.");
    }
};

liri();

