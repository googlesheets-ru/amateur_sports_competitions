import {
    Dataset,
    PlaywrightCrawlingContext,
    RequestHandler,
    createPlaywrightRouter,
} from 'crawlee';

export const router = createPlaywrightRouter();

const pageHandler: RequestHandler<PlaywrightCrawlingContext> = async ({
    page,
    log,
}) => {
    log.info(`enqueueing new URLs`);

    const events = await page.$$eval('.event-card__container', (eventCards) => {
        return eventCards.map((card) => {
            const date = card
                .querySelector('.event-card__header')
                ?.innerText.trim();
            const link = card.querySelector('a.event-card__name');
            const url = `https://russiarunning.com/event${link?.getAttribute(
                'href'
            )}`;
            const name = link?.getAttribute('title');
            const city = card
                .querySelector('.event-card__location')
                ?.getAttribute('title');

            return {
                date,
                url,
                name,
                city,
            };
        });
    });

    await Dataset.pushData(events);
};

router.addDefaultHandler(pageHandler);
