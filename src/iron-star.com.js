function userActionScrapeIronStarCom() {
  // Получаем новые ссылки
  const url = 'https://iron-star.com/event/';
  const contentList = UrlFetchApp.fetch(url).getContentText();
  const $ = Cheerio.load(contentList);
  const itemList = $('.event-item-wrap a.event-item');

  const newUrls = [];

  itemList.map((_, item) => {
    const $item = Cheerio.load(item);
    const date = $item('.date').text();
    const name = $item('.title').text();
    const city = $('.place').text();
    newUrls.push([$(item).attr('href'), date, name, city]);
  });

  console.log(newUrls);

  // Сохраняем новые ссылки
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = book.getSheetByName('iron-star.com');
  sheet.deleteRows(2, sheet.getLastRow() - 1);

  if (newUrls.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newUrls.length, newUrls[0].length).setValues(newUrls);
  }
}

function testUserActionScrapeMyraceInfo() {
  userActionScrapeMyraceInfo();
}
