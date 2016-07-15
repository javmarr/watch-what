
var Movie = {};

Movie.suggestion = function () {
  this.key = '6c2b03c74987c50c1d077cf704d0d8c0';
  this.tmdb = theMovieDb;
  this.movieList = [];
  this.imageSize = 'w500';
  this.movie = {};
  this.currentMovie = 0;
  this.year = Math.floor(((Math.random() * 100) % 30) + 1981);
  console.log(`Using year: ${this.year}`);
}


Movie.suggestion.prototype = {
  init: function () {
    this.tmdb.common.api_key = this.key;
    this.getMovies();
    // theMovieDb.discover.getMovies({"primary_release_year": 2000}, successCB, errorCB);
    // console.log(movieList[0]);
  },

  error: function (data) {
    document.getElementById("error").setAttribute("class", "show");
    console.log(data);
  },

  getMovies: function () {
    this.tmdb.discover.getMovies({year: this.year}, function (data) {
      data = JSON.parse(data);
      if (data.hasOwnProperty('results') && data.results.length > 0) {
        for (var i = 0; i < data.results.length -1; i++) {
          if (data.results[i]["backdrop_path"] != "") {
            var item = {title: "", img: "", id: ""};
            item.title = data.results[i]['title'];
            item.img = data.results[i]['backdrop_path'];
            item.id = data.results[i]['id'];
            this.movieList.push(item);
          }
        };
        this.updateResults();
      } else {
        this.error ("No data received");
      }
    }.bind(this), this.error); // why bind?
  },

  getImage: function (src) {
    return this.tmdb.common.getImage({size: this.imageSize, file: src});
  },

  updateImage: function (src) {
    // get target and add modified poster elements using the poster_template element
    var parent = document.getElementById("container");
    var template = document.getElementById("poster_template").cloneNode(true);
    template.setAttribute("id", this.currentMovieID);
    template.setAttribute("class", "show");
    var clone = template.cloneNode(true); // with children
    clone.childNodes[1].setAttribute("src", src);
    parent.appendChild(clone);

    // document.getElementById("poster").setAttribute("src", src);
  },

  updateResults: function () {
    this.resetStage();

    if(this.movieList.length > 0) {
      while(this.movieList.length > 0) {
        this.movie = this.movieList.shift();
        this.currentMovieID = this.movie.id;
        this.updateImage(this.getImage(this.movie.img));
      }
    } else {
      this.movieList = [];
      this.getMovies();
    }
  },
  resetStage: function () {
    // document.getElementById("next").setAttribute("class", "hide");
    // var results = document.getElementById("result_list");
    // this.clearList(results);
    // var letters = document.getElementById("letters_list");
    // this.clearList(letters);
    document.getElementById("loader").setAttribute("class", "hide");
    // document.getElementById("success").setAttribute("class", "hide");
    document.getElementById("error").setAttribute("class", "hide");
    this.movie = {};
  }
}

// var searchResult;
// var movieList;
// function successCB(data) {
//   searchResult = JSON.parse(data);
//    movieList = searchResult['results'];
//   // console.log("Success callback: " + data);
// };
//
// function errorCB(data) {
//   console.log("Error callback: " + data);
// };

var instance = new Movie.suggestion();
instance.init();
console.log(instance.movieList);
