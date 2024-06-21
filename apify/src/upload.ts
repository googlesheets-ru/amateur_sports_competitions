import { google } from 'googleapis';
import { Dictionary } from 'crawlee';

export interface GoogleAuthCredentials {
    private_key: string;
    client_email: string;
}

export default async (data: Dictionary[], bookId: string, sheetName: string, credentials: GoogleAuthCredentials) => {
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const client = await auth.getClient();

    // Obtain a new drive client, making sure you pass along the auth client
    // @ts-expect-error-ignore-next-line
    const sheets = google.sheets({ auth: client, version: 'v4' });

    await sheets.spreadsheets.values.clear({
        range: `${sheetName}!A2:D`,
        spreadsheetId: bookId,
    });

    // @ts-expect-error-ignore-next-line
    await sheets.spreadsheets.values.update({
        spreadsheetId: bookId,
        range: `${sheetName}!A2`,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: data,
        },
    });
};
