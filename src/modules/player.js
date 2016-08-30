import {customElement, bindable, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {PlayerPlay, PlayerNext, PlayerPrev} from '../events';

@inject(Element, EventAggregator)
export class Player {
  @bindable playFile;

  constructor(element, ea){
    this.element = element;
    this.ea = ea;

    ea.subscribe(PlayerPlay, event => {
      this.playFile = event.file;
    });

    this.handlePlayerEnded = () => {
         this.playNext();
    };
  }

  playPrev(){
    this.ea.publish(new PlayerPrev());
  }

  playNext(){
    this.ea.publish(new PlayerNext());
  }

  attached(){
    $(this.element).find('audio').on('ended', this.handlePlayerEnded);
  }

  detached(){
    $(this.element).find('audio').off('ended', this.handlePlayerEnded);
  }

  playFileChanged(newValue){
    $(this.element).find('audio').load();
  }

}
