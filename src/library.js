import {inject} from 'aurelia-framework';

import {EventAggregator} from 'aurelia-event-aggregator';
import {PlayerPlay, PlayerNext, PlayerPrev} from './events';

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
  selectedFilesCount = null;
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

    this.db.cfind({}).sort({ artist: 1, album: 1, disk: 1, no: 1 }).exec().then(files => {
      this.files = files;
    })

  }

  activate(){
    // TODO assign selectedId library row for played song , when back from another tab
    console.debug('activate')
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

  getFileId3(filePath){
    return new Promise( (resolve, reject) => {
      var fileSize = FS.statSync(filePath).size;
      var stream = FS.createReadStream(filePath)
      ID3(stream, { duration: false, fileSize: fileSize}, (err, tags) => {
          stream.destroy()
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

  getFileId3AndInsert(filePath){
    return this.getFileId3(filePath).then((info) => {
      return this.db.update({path: filePath},
        {path: filePath,
          artist: info.artist,
          album: info.album,
          song: info.title,
          dur: info.duration,
          no: info.track.no,
          disk: info.disk.no
        }, { upsert: true })
    }).catch((e)=> {
      console.debug('error: ' + e + ' in ' + filePath)
    })
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
    }).then(audioPaths => {
      this.selectedFilesCount = audioPaths.length;
      // using Bluebird's Promise.map
      Promise.map(audioPaths, path => {
        return this.getFileId3AndInsert(path).then((results) => {
          if(typeof(results) == "object"){
              let result = results[1] // new record results
              this.files.push(result)
          }
        })
      }, {concurrency: 1})
      .then(() => {
        this.selectedFilesCount = null
      })

    })
  }


  clearPlaylist(){
    this.db.remove({}, { multi: true }).then(results => {
      this.files = [];
    })

  }

  playPath(file){
    this.ea.publish(new PlayerPlay(file));
    this.selectedId = file._id;
  }

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
