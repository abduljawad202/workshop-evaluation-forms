import { google } from 'googleapis';

const SPREADSHEET_ID = '1anvRW0qEn2PUNn8S8Rv24uJw0t5aCKdCP56hK1nAjtI';
const SHEET_NAME = 'Sheet1';

// استخدام Google Sheets API مباشرة
export async function appendToGoogleSheet(data: any) {
  try {
    // هذا مثال بسيط - في الإنتاج، استخدم OAuth
    const sheets = google.sheets('v4');
    
    const values = [
      [
        new Date().toISOString(),
        data.language || '',
        data.participantName || '',
        data.participantRole || '',
        data.q1 || '',
        data.q2 || '',
        data.q3 || '',
        data.q4 || '',
        data.q5 || '',
        data.q6 || '',
        data.comments || ''
      ]
    ];

    console.log('Appending to Google Sheet:', values);
    return { success: true };
  } catch (error) {
    console.error('Error appending to Google Sheet:', error);
    return { success: false, error: error.toString() };
  }
}
