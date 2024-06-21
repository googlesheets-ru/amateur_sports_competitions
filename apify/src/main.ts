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
    private_key: string;
}

// Initialize the Apify SDK
await Actor.init();

// @ts-expect-error-ignore-next-line
const privateKey: string = Actor.config.get('private_key');
// @ts-expect-error-ignore-next-line
const clientEmail: string = Actor.config.get('client_email');

console.log(privateKey);

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

// : {
//             private_key:
//                 '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvFsMeSgJmEbNs\nVS+RAO/FaVOfSrXN5gaj6S9vjEoSCyPkEsep+a2AfzAGmRjmZ7F84kV7O9qcCFh1\n5NE/UfaPeeQMoinaOtE2kR2YtlFAScs3Y86Y2x6Nww3iU1SAOBMmYJet7QbNQIwL\nZc2GLYsIbGoDW/jkAuYagZ+jsTttMyajCr5LRZd+4/xU87wPBcn93stRTPGuIDvP\nLvFODCMA0CzAikbyofWvNt57owX4yWD85xL7XCkm6u8EtKF2GPGp9yGycoC2GJKH\nq2c4OyOlVHveKrIlvzTpqxRddAZIMhGyojl6HNdGvWLzXHLtnhA2U04zxLA5LCJX\n+Fj9pyXtAgMBAAECggEABcwPo5hlhVXVs0lyXNWdASDJ8E6/DHVIYZn0ngSVMtnw\n+ZODmxJvI7K4xA2PbP8ghpcchmy5zr7zl6eyI+usHOqdjRHup9D/VCEW5UaeekeK\naNsvOasCBniSvgK7TzZMFmu0g442OPDuEhyJr9HtnHBJsrKTX/bjaBvdml2UyNQO\nkDCiEXBUBAaLer18mC9ilGZ/tvIre2BX5mUdwjhMgc4cWCutUlq2zFTnAw/LeVUq\nHWfYXZRAuVuhYEqtCvaBib1Gm7QnKhXQtiVxODVCmgPjYVCYQ4rbyV+BEOhi37q5\nOAK+jjMbEJDW5AeQmfRX0BHhTUfZVoPwdNKChgjf0wKBgQDm4+NObdbi3X+7jtqe\nyiQnVWMRAjp9JKLAGXhntODPQr7pY4IZ0pkxU+VoOKviKg8YMcTHk6sKYIQR9Pre\nwN6dzzedP8QcBu8uL/GZygAX5Xyk60HVKJtpjlpWV4VbC2jbE5lKvl5+NN1rmaqo\ncABAom77eQoCDLZfQWt+0SUiOwKBgQDCIVXp0mnryl61HQ093qHobpIPJziVFOnQ\nMG5+cfVcY8blWV9Br1l1Jx/xCJPPZymII6hMEBdY++X4AURnbIYv6cDVRud8i++Y\nVAbYktRqdwE9FPYCK8kc+1dwVVlJnuuTGZg1ca6B+eCw5c9mVkoJ54b1ePxqVzS/\ncnV5tcBt9wKBgQCUPjENhBx6ILkIVVospaC82Gf43bNr8f/E0xWpkErfB/3Hn6pC\npiLRtwoN9oT1eweiAyJS+Y7R5NInLWF9b9v++rK8ddqWHCWpRAMdOMMClMeIo7vq\n/l16UnnSAfOPVy4Fqvm7Mas94PdhRJJ7/x1KYoBbWYWBd2QImNpJ3EK5TQKBgEvj\nIiWUZmmRI3KjV7DO3fXxe1FHILxOf5QtypPNUn/6VR8Ez9LqjAra74aWtslF55tb\nbQfG5omXdu9691WCu/Xw57u3yvgJ7/BZMI/q3fR8btSE5CI3IZgdvLGh+5Rm9mn7\ngF+r/+65Upd0Tp4Pr0Ot6Tj+QZYEXw9T3A5m+UFDAoGAdLaH0F7SB1r+cEyjdMSa\n2kAHvkKFrqe1znx2dkwwR7IWlsdng3cQhS9dqGWZ9q3uZ9dkTFb8NnyQ6MNAZ5nR\nYR0eUyCHqnyBupS81XJivYA1AU8HiQFoKr6QvXNZtmqY0g1t5REKwXkmYJks8EYU\nZ40sBbDq3CyacNvY4Bpnah0=\n-----END PRIVATE KEY-----\n',
//             client_email: 'sa-alex-dev@cents-29.iam.gserviceaccount.com',
//         }

console.log(data);

await upload(dataArr, '1v8qf7eQeloaEh3eJ3rmoWa0xrdzcv9FirVBgp3lqUgQ', 'russiarunning.com', {
    private_key: privateKey,
    client_email: clientEmail,
});
// Exit successfully
await Actor.exit();
