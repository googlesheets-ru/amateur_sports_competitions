function userActionScrapeMyraceInfo() {
  console.log('userActionScrapeMyraceInfo', 'start');
  // Получаем новые ссылки
  const url = 'https://myrace.info/take/';
  const contentList = UrlFetchApp.fetch(url).getContentText();
  const $ = Cheerio.load(contentList);
  const itemList = $('.container-content.centered > a.events-list__item.row');

  const values = [];

  itemList.map((_, item) => {
    const $item = Cheerio.load(item);

    const date = $item('.date')
      .text()
      .replace(/(\d+)-(\d)+/, '$1');
    const name = $item('h2').clone().children().remove().end().text().trim();
    const city = $item('.flag').text().trim();
    const url = `https://myrace.info${$(item).attr('href')}`;
    values.push([url, date, name, city]);
  });

  const book = SpreadsheetApp.getActive();
  const sheet = book.getSheetByName('myrace.info');

  sheet.getRange(3, 1, sheet.getMaxRows() - 1, sheet.getMaxColumns()).clearContent();

  if (values.length) {
    sheet.getRange(2, 1, values.length, values[0].length).setValues(values);
  } else {
    sheet.getRange('2:2').clearContent();
  }
  console.log('userActionScrapeMyraceInfo', 'finish');
}
