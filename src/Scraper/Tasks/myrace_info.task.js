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
  const city = $('.my-5.text-strong.text-muted').text();

  Logger.log(`${link}: ${date}, ${name}, ${city}`);

  return { date, name, city };
}

function test_myraceInfoTaskLink() {
  const link = 'https://myrace.info/events/657';
  console.log(myraceInfoTaskLink_(link));
}

function RussiaRunningInfoTaskLink_(link) {
  // Проблема - ничего не работает с этого сайта
  const contentList = UrlFetchApp.fetch(link).getContentText();
  const $ = Cheerio.load(contentList);
  const date = $(
    '#app > main > div.event-intro.event-info > div.event-intro__content > div > div > div.event-intro__main > div.event-intro__details > div',
  ).text();
  const name = $('.div.event-intro__details').text();
  const city = $('.my-5.text-strong.text-muted').text();

  Logger.log(`${link}: ${date}, ${name}, ${city}`);

  return { date, name, city };
}

function test_RussiaRunningInfoTaskLink() {
  const link = 'https://russiarunning.com/event/RUTSPerm/';
  console.log(RussiaRunningInfoTaskLink_(link));
}

function X_WATERSInfoTaskLink_(link) {
  const contentList = UrlFetchApp.fetch(link).getContentText();
  const $ = Cheerio.load(contentList);
  const date = $(
    '#container > div.b_top > div > div > div.b_top-content > div.extension.extension-middle > div > div.b_under_itms > div:nth-child(1)',
  ).text();
  const name = $('h1.title-event.js-title-event').text();
  const city = $('h2.itm').text();

  Logger.log(`${link}: ${date}, ${name}, ${city}`);

  return { date, name, city };
}

function test_X_WATERSInfoTaskLink() {
  const link = 'https://x-waters.com/events/volga/';
  console.log(X_WATERSInfoTaskLink_(link));
}

function IRONSTARInfoTaskLink_(link) {
  const contentList = UrlFetchApp.fetch(link).getContentText();
  const $ = Cheerio.load(contentList);
  const date = $(
    '#__nuxt > div > div > main > div:nth-child(2) > section.content-block.white-bg > div > div.content-block-wrap > aside > div > div.event-short-card > div.event-item-head > div.event-head-info > div.date',
  ).text();
  const name = $('h1').text();
  const city = $(
    '#__nuxt > div > div > main > div:nth-child(2) > section.content-block.white-bg > div > div.content-block-wrap > aside > div > div.event-short-card > div.event-item-head > div.event-head-info > div.place',
  ).text();

  Logger.log(`${link}: ${date}, ${name}, ${city}`);

  return { date, name, city };
}

function test_IRONSTARInfoTaskLink() {
  const link = 'https://iron-star.com/event/ironstar-sprint-ekaterinburg-2024/';
  console.log(IRONSTARInfoTaskLink_(link));
}

function TIMERMANInfoTaskLink_(link) {
  // Проблема - ничего не работает с этого сайта
  const contentList = UrlFetchApp.fetch(link).getContentText();
  const $ = Cheerio.load(contentList);
  const date = $('span.competitions__date-value.text-medium-semibold').text();
  const name = $('h1.intro__title.heading-extra').text();
  const city = 'Казань';

  Logger.log(`${link}: ${date}, ${name}, ${city}`);

  return { date, name, city };
}

function test_TIMERMANInfoTaskLink() {
  const link = 'https://timerman.org/event/KazanNightRace2024';
  console.log(TIMERMANInfoTaskLink_(link));
}
