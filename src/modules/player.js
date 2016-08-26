import {customElement, bindable, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {PlayerPlay, PlayerNext, PlayerPrev} from '../events';
// @bindable('play')
// @bindable('playPath')
@inject(Element, EventAggregator)
export class Player {
  @bindable playPath;

  constructor(element, ea){
    this.element = element;
    this.ea = ea;

    ea.subscribe(PlayerPlay, event => {
      this.playPath = event.file.path;

      // this is kind'a fix, changing playPath not trigger audio load/play
      $(this.element).find('audio').load();
    });
  }

  playPrev(){
    this.ea.publish(new PlayerPrev());
  }

  playNext(){
    this.ea.publish(new PlayerNext());
  }

  // playChanged(newValue){
  //   console.debug(newValue);
  //   this.playPath = newValue;
  //   // $(this.element.$children).attr('src', this.play)
  // }

}
