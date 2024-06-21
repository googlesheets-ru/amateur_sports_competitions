import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Dictionary } from 'crawlee';

export default async (
    data: Dictionary[],
    bookId: string,
    sheetName: string
) => {
    const serviceAccountAuth = new JWT({
        email: 'sa-alex-dev@cents-29.iam.gserviceaccount.com',
        key: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCpvx5ctQpJg5bh\ncE0HAoh18ObaA+QF0DAj+qSfwUmZPMdy+/Agt78wT770KuhtMFg2c+bLRqUnyroe\n5qabR8A49JReGy2fo6lJqqHm9Qs7fm9UdDpsH9roCyZOYboQGeQoP0pp8l9etDps\nOG95A5zkxK5XKrKeJkYJjH0OqTvIPNjAxKxx2olCNZX3nmn16vxazgU4PVpfebvx\n9344PnaY+cwsi1Yc+MvV5gBtC7zGrufAThIHCTXHHK/WxaKf1kdGcVl1qyd4RrrR\ni7b5A4uBxiN9qIm5oozXwrd/gychXM6QY4aSJKleaj+EFyrstXe4EDTc+V2kZQMY\n+Kc2VLEDAgMBAAECggEAC3RksZ/b6lsRZvQjlooCuGbBxUuG6yeB4COtUUSDWW5j\nDSzYJvUPV0zCV4q/tYKSKVaH6AbD5VwGVEh/TLI6U/2ZN4KBASlTpq93jnTRxbmB\n/MJ9IMfDh24dLyPkIOsGXPrsZBrheawS1zO1vgZS45MsKqCsfgSaLFHJLKCZ8qig\nTx+OIevPwhjCYGX0FCEiqFH1G019l4HptwWj5KinutTWSpdoVV3LlQfrq6sAkukY\nqk79MRiYRUvVHU51dmgOE5H4AJGg+qOBgkwMUq9wIg9K36r/Vp2CtyqQkvfMJ9em\n1HqEe1I1ROuaiA/UrK3R6eJ1wyzS40/1LJ6SXt1H8QKBgQDdBByDeEspY3DQaGuQ\nbVIuN0c9aQSqhNYl15RwW4vdibsi5iaNStQ6bGuP1UaZ4/jBL/EPP/oKHQMd7Tu+\nhcX9Bpsj+rzeH28hX5hD3IU1AEnvjIpO763QdIlQFs54X/kVWyzX2FiG3FQWXttH\n23WZHETsbZypD23pNhffl9uIcwKBgQDEnX5DzmjP6dpOiXpPpRB3sFsjixz3OjVN\nDhDNpkDUbBb5MMMG4zYyfUZq8aC2S/73c0uz9gvDVOLQrm7XwEC2ZtljcHmOl4iM\nOshRWbFRH19+0cfG3bQsj1/4jkf3RzuR1oVwP1Q4F5WDJfcpsABr3fcB1d93Pna9\nd5KMM/RhMQKBgQDPD6YDCbUpDm/H4Lw9cB4ZDFLi1ru3YYIbq+/2n93WbM308ThX\nES7pmV/gPgjJ7knD/D1UczS3Ot0LsZFSepO17PV17Nf7JeoAk0Xc9gGaWS3rjniZ\nYXUvIa7vaJ6BKjD68BOAGME/f7YLy0yW8qUnD9QGyN6HiNwJLFOLeAMFvwKBgFmv\n2fQGSOtmqk2fCqsgCaX/TWOmRp1D8SJoIyQcDYCYmdYr9xrCNGvNl3ybIgtmGTU5\nY7QArZb5tskoeKl0KlDKE6n3mYuA9im5er0ZI/h0TjRkbzP42AJnmIiiJpPW64Z4\nC8CLMtivcWU0wU1D2r1ZsB4nOFuFo9aDn9bSsExRAoGBALdc25TCa/jIrGEKqWKS\nrHystNs4xO+/KS4uuMzB/FI3nj9Jsz7DmVPkPCqOpxHDf54afUjPSSOve0/98LZZ\nNoGSuMlwFX5Fy3UoAJaE5VH8LoPmcKdPCDjTprwWbPwkvv/pkgC/PQIfVgw2JJ7s\nwrS/m82J0fO0ttgolbkbH9/x\n-----END PRIVATE KEY-----\n',
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const book = new GoogleSpreadsheet(bookId, serviceAccountAuth);

    await book.loadInfo();

    const sheet =
        book.sheetsByTitle[sheetName] ||
        (await book.addSheet({ title: sheetName }));

    await sheet.clearRows();

    sheet.setHeaderRow(Object.keys(data[0]));
    sheet.addRows(data);

    await sheet.saveUpdatedCells();
};
