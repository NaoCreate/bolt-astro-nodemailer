import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import type { ContactForm } from './types';
import * as fs from 'fs';
import * as path from 'path';

const SHEET_NAME = 'testForm';

// サービスアカウントの認証情報を読み込む
const serviceAccountPath = path.join(process.cwd(), 'google-service-key-AstroContactForm.json');
const serviceAccountCreds = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

const serviceAccountAuth = new JWT({
  email: serviceAccountCreds.client_email,
  key: serviceAccountCreds.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function saveToSpreadsheet(formData: ContactForm) {
  try {
    const doc = new GoogleSpreadsheet(import.meta.env.SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByTitle[SHEET_NAME];
    if (!sheet) {
      throw new Error('Sheet not found');
    }

    const row = [
      new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
      formData.name,
      formData.email,
      formData.message
    ];

    await sheet.addRow(row);
    console.log('Data saved to spreadsheet successfully');
  } catch (error) {
    console.error('Error saving to spreadsheet:', error);
    throw error;
  }
}