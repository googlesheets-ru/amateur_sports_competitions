class App {
  constructor() {}

  get book() {
    if (!this._book) {
      this._book = SpreadsheetApp.getActive();
    }
    return this._book;
  }

  get sheet() {
    if (!this._sheet) {
      this._sheet = this.book.getSheetByName('Данные');
    }
    return this._sheet;
  }

  get scraper() {
    if (!this._scraper) {
      this._scraper = new Scraper();
    }
    return this._scraper;
  }

  arrayToCollection(array) {
    const headers = array.shift().map((h, columnIndex) => String(h).toLowerCase() || `_col_${columnIndex}`);
    return array.map(
      (_, rowIndex) =>
        headers.reduce(
          (rowCollection, header, columnIndex) => {
            rowCollection[header] = {
              value: array[rowIndex][columnIndex],
              __colIndex: columnIndex,
            };
            return rowCollection;
          },
          {
            __rowIndex: rowIndex + 1,
          },
        ),
      [],
    );
  }

  values() {
    const datarange = this.sheet.getDataRange().getValues();
    const collection = this.arrayToCollection(datarange);
    return collection;
  }

  updateItem(item, data) {
    const keyMap = {
      date: 'дата',
      name: 'название',
    };
    Object.keys(data).forEach((key) => {
      const itemKey = keyMap[key];
      if (itemKey) {
        const col = item[itemKey].__colIndex + 1;
        this.sheet.getRange(item.__rowIndex + 1, col).setValue(data[key]);
      }
    });
  }

  updateNewLinks(scrapeName, links) {
    const values = this.values();
    const newValues = links.filter((link) => !values.find((item) => item['ссылка'].value === link));
    if (newValues.length) {
      const lr = this.sheet.getLastRow() + 1;
      this.sheet
        .getRange(lr, values[0]['источник'].__colIndex + 1, newValues.length, 1)
        .setValues(newValues.map((_) => [scrapeName]));
      this.sheet
        .getRange(lr, values[0]['ссылка'].__colIndex + 1, newValues.length, 1)
        .setValues(newValues.map((_) => [_]));
    }
  }

  scrapeNextLink() {
    const values = this.values();
    const nextItem = values.find((item) => {
      return item['ссылка'].value && item['источник'].value && item['название'].value === '';
    });
    const scrapeData = this.scraper.scrapeLink(nextItem['источник'].value, nextItem['ссылка'].value);
    this.updateItem(nextItem, scrapeData);
  }

  scrapeNewLinks() {
    const scrapeName1 = 'myrace.info';
    const newLinks1 = this.scraper.scrapeNewLinks(scrapeName1);
    this.updateNewLinks(scrapeName1, newLinks1);
  }
}
