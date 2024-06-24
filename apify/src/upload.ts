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

    const book = await sheets.spreadsheets.get({
        spreadsheetId: bookId,
        ranges: [sheetName],
        fields: 'sheets(properties)',
    });

    const sheet = book.data?.sheets?.[0];

    if (sheet) {
        if (sheet && sheet.properties?.gridProperties?.rowCount && sheet.properties?.gridProperties?.rowCount > 2) {
            // @ts-expect-error-ignore-next-line
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: bookId,
                resource: {
                    requests: [
                        {
                            deleteDimension: {
                                range: {
                                    dimension: 'ROWS',
                                    sheetId: sheet.properties.sheetId,
                                    startIndex: 2,
                                    endIndex: 9999999,
                                },
                            },
                        },
                    ],
                },
            });
        }

        // @ts-expect-error-ignore-next-line
        await sheets.spreadsheets.values.update({
            spreadsheetId: bookId,
            range: `${sheetName}!A2`,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: data,
            },
        });
    }
};
