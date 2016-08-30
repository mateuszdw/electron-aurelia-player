export class App {
  configureRouter(config, router) {
    config.title = 'One Player';
    config.map([
      { route: ['','library'],         name: 'library',        moduleId: 'library',        nav: true, title: 'Library' }
    ]);

    this.router = router;
  }
}
