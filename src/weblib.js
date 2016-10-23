import {inject, bindable} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class Weblib {
  searchResults = [];
  musicResults = [];
  currentArtist = null;

  @bindable searchPhrase;

  constructor(http) {
    http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl('https://api.spotify.com/')
    });

    this.http = http;
  }

  searchPhraseChanged(newValue){
    if(newValue == "" || newValue == " ")
      return;

    return this.http.fetch('v1/search?q=' + newValue + '&type=track,artist,album&limit=3')
      .then(response => response.json())
      .then(results => {
        console.debug(results)
        this.searchResults = results
      });
  }

  getArtistAlbumsAndTracks(artistId){
    // https://api.spotify.com/v1/artists/fsdfsdf/albums?album_type=single,album
    // https://api.spotify.com/v1/albums/ssad/tracks

    return this.http.fetch('v1/artists/' + artistId + '/top-tracks?country=SE')
      .then(response => response.json())
      .then(results => {
        console.debug(results)
        this.musicResults = results
      });

  }

}
