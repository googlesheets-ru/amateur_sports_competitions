import { Dataset, PuppeteerCrawlingContext, RequestHandler, createPuppeteerRouter } from 'crawlee';

export const router = createPuppeteerRouter();

const pageHandler: RequestHandler<PuppeteerCrawlingContext> = async ({ page, log, request }) => {
    log.info(`enqueueing new URLs`);
    console.log(request.url);

    await page.waitForSelector('.pagination__button');
    const events = await page.$$eval('.event-card__container', (eventCards) => {
        return eventCards.map((card) => {
            const date = card.querySelector('.event-card__header')?.innerText.trim();
            const link = card.querySelector('a.event-card__name');
            const url = `https://russiarunning.com/event${link?.getAttribute('href')}`;
            const name = link?.getAttribute('title');
            const city = card.querySelector('.event-card__location')?.getAttribute('title');

            return {
                date,
                url,
                name,
                city,
            };
        });
    });

    console.log(events);

    await Dataset.pushData(events);
};

router.addDefaultHandler(pageHandler);
