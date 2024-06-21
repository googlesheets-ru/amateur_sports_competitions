import * as fs from 'fs';

import { Actor, Dataset } from 'apify';
import { PuppeteerCrawler } from 'crawlee';
import { router } from './routes.js';
import upload from './upload.js';

interface Input {
    startUrls: string[];
    maxRequestsPerCrawl: number;
    private_key: string;
}

await Actor.init();

let input;
if (process.env.NODE_ENV === 'production') {
    input = await Actor.getInput();
} else {
    const configPath = './Actor.config.json';
    if (fs.existsSync(configPath)) {
        input = JSON.parse(
            fs
                .readFileSync(configPath, 'utf-8')
                .split(String.raw`\n`)
                .join('\n')
        );
    } else {
        console.error('Local Actor.config file not found.');
        process.exit(1);
    }
}

const { private_key: privateKey, client_email: clientEmail } = input;

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

await upload(dataArr, '1v8qf7eQeloaEh3eJ3rmoWa0xrdzcv9FirVBgp3lqUgQ', 'russiarunning.com', {
    private_key: privateKey,
    client_email: clientEmail,
});

await Actor.exit();
