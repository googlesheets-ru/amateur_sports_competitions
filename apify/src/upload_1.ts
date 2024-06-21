import { google } from 'googleapis';
import { Dictionary } from 'crawlee';

export default async (data: Dictionary[], bookId: string, sheetName: string) => {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            type: 'service_account',
            project_id: 'cents-29',
            private_key_id: 'e02eedcd2cf4c2c5d7cb461ca7b455b42952023a',
            private_key:
                '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvFsMeSgJmEbNs\nVS+RAO/FaVOfSrXN5gaj6S9vjEoSCyPkEsep+a2AfzAGmRjmZ7F84kV7O9qcCFh1\n5NE/UfaPeeQMoinaOtE2kR2YtlFAScs3Y86Y2x6Nww3iU1SAOBMmYJet7QbNQIwL\nZc2GLYsIbGoDW/jkAuYagZ+jsTttMyajCr5LRZd+4/xU87wPBcn93stRTPGuIDvP\nLvFODCMA0CzAikbyofWvNt57owX4yWD85xL7XCkm6u8EtKF2GPGp9yGycoC2GJKH\nq2c4OyOlVHveKrIlvzTpqxRddAZIMhGyojl6HNdGvWLzXHLtnhA2U04zxLA5LCJX\n+Fj9pyXtAgMBAAECggEABcwPo5hlhVXVs0lyXNWdASDJ8E6/DHVIYZn0ngSVMtnw\n+ZODmxJvI7K4xA2PbP8ghpcchmy5zr7zl6eyI+usHOqdjRHup9D/VCEW5UaeekeK\naNsvOasCBniSvgK7TzZMFmu0g442OPDuEhyJr9HtnHBJsrKTX/bjaBvdml2UyNQO\nkDCiEXBUBAaLer18mC9ilGZ/tvIre2BX5mUdwjhMgc4cWCutUlq2zFTnAw/LeVUq\nHWfYXZRAuVuhYEqtCvaBib1Gm7QnKhXQtiVxODVCmgPjYVCYQ4rbyV+BEOhi37q5\nOAK+jjMbEJDW5AeQmfRX0BHhTUfZVoPwdNKChgjf0wKBgQDm4+NObdbi3X+7jtqe\nyiQnVWMRAjp9JKLAGXhntODPQr7pY4IZ0pkxU+VoOKviKg8YMcTHk6sKYIQR9Pre\nwN6dzzedP8QcBu8uL/GZygAX5Xyk60HVKJtpjlpWV4VbC2jbE5lKvl5+NN1rmaqo\ncABAom77eQoCDLZfQWt+0SUiOwKBgQDCIVXp0mnryl61HQ093qHobpIPJziVFOnQ\nMG5+cfVcY8blWV9Br1l1Jx/xCJPPZymII6hMEBdY++X4AURnbIYv6cDVRud8i++Y\nVAbYktRqdwE9FPYCK8kc+1dwVVlJnuuTGZg1ca6B+eCw5c9mVkoJ54b1ePxqVzS/\ncnV5tcBt9wKBgQCUPjENhBx6ILkIVVospaC82Gf43bNr8f/E0xWpkErfB/3Hn6pC\npiLRtwoN9oT1eweiAyJS+Y7R5NInLWF9b9v++rK8ddqWHCWpRAMdOMMClMeIo7vq\n/l16UnnSAfOPVy4Fqvm7Mas94PdhRJJ7/x1KYoBbWYWBd2QImNpJ3EK5TQKBgEvj\nIiWUZmmRI3KjV7DO3fXxe1FHILxOf5QtypPNUn/6VR8Ez9LqjAra74aWtslF55tb\nbQfG5omXdu9691WCu/Xw57u3yvgJ7/BZMI/q3fR8btSE5CI3IZgdvLGh+5Rm9mn7\ngF+r/+65Upd0Tp4Pr0Ot6Tj+QZYEXw9T3A5m+UFDAoGAdLaH0F7SB1r+cEyjdMSa\n2kAHvkKFrqe1znx2dkwwR7IWlsdng3cQhS9dqGWZ9q3uZ9dkTFb8NnyQ6MNAZ5nR\nYR0eUyCHqnyBupS81XJivYA1AU8HiQFoKr6QvXNZtmqY0g1t5REKwXkmYJks8EYU\nZ40sBbDq3CyacNvY4Bpnah0=\n-----END PRIVATE KEY-----\n',
            client_email: 'sa-alex-dev@cents-29.iam.gserviceaccount.com',
            client_id: '104024870889392552306',
            // auth_uri: 'https://accounts.google.com/o/oauth2/auth',
            // token_uri: 'https://oauth2.googleapis.com/token',
            // auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
            // client_x509_cert_url:
            // 'https://www.googleapis.com/robot/v1/metadata/x509/sa-alex-dev%40cents-29.iam.gserviceaccount.com',
            universe_domain: 'googleapis.com',
        },

        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const client = await auth.getClient();

    // Obtain a new drive client, making sure you pass along the auth client
    const sheets = google.sheets({ auth: client, version: 'v4' });

    await sheets.spreadsheets.values.clear({
        range: `${sheetName}!A2:D`,
        spreadsheetId: bookId,
    });

    await sheets.spreadsheets.values.update({
        spreadsheetId: bookId,
        range: `${sheetName}!A2`,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: data,
        },
    });
};
