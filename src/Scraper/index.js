class Scraper {
  constructor() {
    this._tasks = [
      {
        name: 'myrace.info',
        scrapeNewLinks: myraceInfoTaskNewLinks_,
        scrapeLink: myraceInfoTaskLink_,
      },
    ];
  }

  addTask(task) {
    this._tasks.push(task);
  }

  scrapeNewLinks(taskName) {
    const task = this._tasks.find((task) => task.name === taskName);
    if (!task) {
      throw new Error(`Task ${taskName} not found`);
    }

    return task.scrapeNewLinks();
  }

  scrapeLink(taskName, link) {
    const task = this._tasks.find((task) => task.name === taskName);
    if (!task) {
      throw new Error(`Task ${taskName} not found`);
    }

    return task.scrapeLink(link);
  }
}
