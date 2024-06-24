function userActionScrapeIronStarCom() {
  // Получаем новые ссылки
  const url = 'https://iron-star.com/event/';
  const contentList = UrlFetchApp.fetch(url).getContentText();
  const $ = Cheerio.load(contentList);
  const itemList = $('.event-item-wrap a.event-item');

  const values = [];

  itemList.map((_, item) => {
    const $item = Cheerio.load(item);
    const date = $item('.date').text().trim();
    const name = $item('.title').text().trim();
    const city = $item('.place').text().trim();
    const url = `https://iron-star.com${$(item).attr('href')}`;
    values.push([url, date, name, city]);
  });

  console.log(values);

  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = book.getSheetByName('iron-star.com');

  sheet.getRange(3, 1, sheet.getMaxRows() - 1, sheet.getMaxColumns()).clearContent();

  if (values.length) {
    sheet.getRange(2, 1, values.length, values[0].length).setValues(values);
  } else {
    sheet.getRange('2:2').clearContent();
  }
}
