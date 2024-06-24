/* exported userActionScrapeRussiarunningCom */
function userActionScrapeRussiarunningCom() {
  console.log('userActionScrapeRussiarunningCom', 'start');
  const url = 'https://russiarunning.com/api/events/list/ru';
  const payload = {
    Take: 500,
    DateFrom: new Date().toISOString().split('T')[0],
  };
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };
  const data = UrlFetchApp.fetch(url, options);

  const items = JSON.parse(data.getContentText()).Items;

  const values = items.map((item) => {
    const { c, d, t, p } = item;
    const link = `https://russiarunning.com/event/${c}/`;
    const date = d.split('T')[0];
    const row = [link, date, t, p];
    return row;
  });

  const book = SpreadsheetApp.getActive();
  const sheet = book.getSheetByName('russiarunning.com');

  sheet.getRange(3, 1, sheet.getMaxRows() - 1, sheet.getMaxColumns()).clearContent();

  if (values.length) {
    sheet.getRange(2, 1, values.length, values[0].length).setValues(values);
  } else {
    sheet.getRange('2:2').clearContent();
  }
  console.log('userActionScrapeRussiarunningCom', 'finish');
}
