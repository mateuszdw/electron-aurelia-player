export class App {
  configureRouter(config, router) {
    config.title = 'One Player';
    config.map([
      { route: ['','library'], name: 'library', moduleId: 'library', nav: true, title: 'Local music' },
      { route: 'weblib', name: 'weblib', moduleId: 'weblib', nav: true, title: 'Web music' }
    ]);

    this.router = router;
  }
}
