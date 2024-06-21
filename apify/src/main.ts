/**
 * This template is a production ready boilerplate for developing with `PlaywrightCrawler`.
 * Use this to bootstrap your projects using the most up-to-date code.
 * If you're looking for examples or want to learn more, see README.
 */

// For more information, see https://docs.apify.com/sdk/js
import { Actor, Dataset } from 'apify';
// For more information, see https://crawlee.dev
import { PuppeteerCrawler } from 'crawlee';
// this is ESM project, and as such, it requires you to specify extensions in your relative imports
// read more about this here: https://nodejs.org/docs/latest-v18.x/api/esm.html#mandatory-file-extensions
// note that we need to use `.js` even when inside TS files
import { router } from './routes.js';
import upload from './upload.js';

interface Input {
    startUrls: string[];
    maxRequestsPerCrawl: number;
}

// Initialize the Apify SDK
await Actor.init();

// Structure of input is defined in input_schema.json
const {
    startUrls = [
        'https://russiarunning.com/events?place',
        ...Array.from({ length: 1 }, (_, i) => `https://russiarunning.com/events?place&p=${i + 1}`),
    ],
    maxRequestsPerCrawl = 100,
} = (await Actor.getInput<Input>()) ?? ({} as Input);

const proxyConfiguration = await Actor.createProxyConfiguration();

const ds = await Dataset.open();
const crawler = new PuppeteerCrawler({
    proxyConfiguration,
    maxRequestsPerCrawl,
    requestHandler: router,
});

await crawler.run(startUrls);

const data = await ds.export();

const dataArr = data.map((item) => ['url', 'date', 'name', 'city'].map((key) => item[key]));

console.log(data);

await upload(dataArr, '1v8qf7eQeloaEh3eJ3rmoWa0xrdzcv9FirVBgp3lqUgQ', 'russiarunning.com');
// Exit successfully
await Actor.exit();
