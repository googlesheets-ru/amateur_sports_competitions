function myraceInfoTaskNewLinks_() {
  const url = 'https://myrace.info/take/';
  const contentList = UrlFetchApp.fetch(url).getContentText();
  const $ = Cheerio.load(contentList);
  const itemList = $('.container-content.centered > a.events-list__item.row');

  const urls = [];

  itemList.map((_, item) => urls.push(`https://myrace.info${$(item).attr('href')}`));

  return urls;
}

function myraceInfoTaskLink_(link) {
  const contentList = UrlFetchApp.fetch(link).getContentText();
  const $ = Cheerio.load(contentList);
  const date = $('.champ-title > a.text-large.text-strong').text();
  const name = $('.heading-huge.mt-3').text();

  return { date, name };
}

function test_myraceInfoTaskLink() {
  const link = 'https://myrace.info/events/657';
  console.log(myraceInfoTaskLink_(link));
}
