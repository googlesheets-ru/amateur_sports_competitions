function userActionScrapeMyraceInfo() {
  // Получаем новые ссылки
  const url = 'https://myrace.info/take/';
  const contentList = UrlFetchApp.fetch(url).getContentText();
  const $ = Cheerio.load(contentList);
  const itemList = $('.container-content.centered > a.events-list__item.row');

  const urls = [];

  itemList.map((_, item) => urls.push(`https://myrace.info${$(item).attr('href')}`));

  // Сохраняем новые ссылки
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = book.getSheetByName('myrace.info');
  const data = sheet.getDataRange().getValues();
  const currentUrl = data.map((row) => row[0]);
  const newUrls = urls.filter((url) => !currentUrl.includes(url)).map((url) => [url]);

  if (newUrls.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newUrls.length, newUrls[0].length).setValues(newUrls);
  }

  // Прарсим данные первых 10 ссылок
  const maxCalls = 100;
  let countCalls = 0;
  data.some((row, rowIndex) => {
    if (rowIndex === 0) {
      return;
    }
    if (countCalls >= maxCalls) {
      return true;
    }

    const [link] = row;

    const contentList = UrlFetchApp.fetch(link).getContentText();
    countCalls++;
    const $ = Cheerio.load(contentList);
    const date = $('.champ-title > a.text-large.text-strong').text();
    const name = $('.heading-huge.mt-3').text();
    const city = $('.my-5.text-strong.text-muted').text();

    sheet.getRange(rowIndex + 1, 2, 1, 3).setValues([[date, name, city]]);
  });
}

function testUserActionScrapeMyraceInfo() {
  userActionScrapeMyraceInfo();
}
