import {inject} from 'aurelia-framework';

import {EventAggregator} from 'aurelia-event-aggregator';
import {PlayerPlay, PlayerNext, PlayerPrev} from './events';

// import {areEqual} from './utility';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import FS from 'fs';
import FSPath from 'node-dir';
import DataBase from 'nedb-promise';
import ID3 from 'musicmetadata'; // no need to inject

@inject(HttpClient, FSPath, DataBase({filename: 'library.db', autoload: true}), EventAggregator)
export class Library {
  files = [];
  selectedId = null;
  constructor(http,fspath, db, ea) {
    this.fspath = fspath;
    this.db = db;
    this.ea = ea;

    ea.subscribe(PlayerNext, () => {
      this.playNext()
    })

    ea.subscribe(PlayerPrev, () => {
      this.playPrev()
    })

    this.db.cfind({}).sort({ artist: 1, album: 1 }).exec().then(files => {
      this.files = files;
    })

  }

  activate(){

  }

  clearPlaylist(){
    this.db.remove({}, { multi: true }).then(results => {
      this.files = [];
    })

  }

  playPath(file){
    this.ea.publish(new PlayerPlay(file));
    this.selectedId = file._id;
    // temp get cover
    // this.getFileCover(file);
  }

  // this should go to separate file
  getFilePaths(dirPath){
    return new Promise( (resolve, reject) => {
          this.fspath.paths(dirPath, function(err, paths) {
            if (err) reject(err);
            resolve(paths);
          })
      })
  }

  // getFileId3(filePath){
  //   return new Promise( (resolve, reject) => {
  //     ID3({ file: filePath, type: ID3.OPEN_LOCAL}, (err, tags) => {
  //         if (err) reject(err);
  //         resolve(tags);
  //     });
  //   })
  // }

  getFileId3(filePath){
    return new Promise( (resolve, reject) => {
      ID3(FS.createReadStream(filePath), { duration: true }, (err, tags) => {
          if (err) reject(err);
          resolve(tags);
      });
    })
  }

  getFileCover(file){
    this.getFileId3(file.path).then(info => {

      for (var i = 0; i < this.files.length; i++) {
        if(this.files[i]._id === file._id){
          if(info.picture.length > 0){
            this.files[i].cover = 'data: image/' + info.picture[0].format + ';base64,'+info.picture[0].data.toString('base64');
          }
          break;
        }
      }

    })
    return true;
  }

  selectedFiles(evt){
    if (evt.target.files.length <= 0) {
      return false;
    }

    this.getFilePaths(evt.target.files[0].path).then((paths) => {
      return paths.files.filter(file => {
        return (/\.(?:wav|mp3|ogg|oga|aac)$/i).test(file);
      });
      // console.log('files:\n',paths.files);
      // console.log('subdirs:\n', paths.dirs);
    }).then(paths => {
      for(let f = 0; f < paths.length; f++) {
        this.getFileId3(paths[f]).then(info => {
          // console.debug(info.picture[]);
          this.db.update({path: paths[f]},{path: paths[f], artist: info.artist, album: info.album, song: info.title}, { upsert: true }).then((numReplaced, upsert) => {
            // console.debug(numReplaced, upsert);
            this.files.push({artist: info.artist, album: info.album, song: info.title, path: paths[f]})
          }).catch(function(e) {
              console.error(e.stack);
          });

        })
      }
    })
  }

/* helpers */

  playNext(){
    for (var i = 0; i < this.files.length; i++) {
      if(this.files[i]._id === this.selectedId){
        this.selectedId = this.files[i+1]._id;
        this.playPath(this.files[i+1]);
        break;
      }
    }
  }

  playPrev(){
    for (var i = 0; i < this.files.length; i++) {
      if(this.files[i]._id === this.selectedId){
        this.selectedId = this.files[i-1]._id;
        this.playPath(this.files[i-1]);
        break;
      }
    }
  }

}
