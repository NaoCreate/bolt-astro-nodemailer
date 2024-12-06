import type { APIRoute } from 'astro';
import { sendAdminNotification, sendConfirmationEmail } from '../../utils/mailer';
import { saveToSpreadsheet } from '../../utils/spreadsheet';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    // バリデーション
    if (!data.name || !data.email || !data.subject || !data.message) {
      return new Response(JSON.stringify({
        message: '必須項目が入力されていません。',
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // 環境変数チェック
    const requiredEnvVars = [
      'PUBLIC_SMTP_HOST',
      'PUBLIC_SMTP_PORT',
      'PUBLIC_SMTP_USER',
      'PUBLIC_SMTP_PASS',
      'PUBLIC_ADMIN_EMAIL'
    ];

    const missingEnvVars = requiredEnvVars.filter(
      varName => !import.meta.env[varName]
    );

    if (missingEnvVars.length > 0) {
      console.error('Missing environment variables:', missingEnvVars);
      throw new Error('メール設定が不完全です。');
    }

    try {
      // メール送信とスプレッドシートへの保存を並行して実行
      await Promise.all([
        sendAdminNotification(data),
        sendConfirmationEmail(data),
        saveToSpreadsheet(data)
      ]);
      
      console.log('All operations completed successfully');
    } catch (error) {
      console.error('Operation error:', error);
      throw new Error('処理中にエラーが発生しました。');
    }

    return new Response(JSON.stringify({
      message: 'お問い合わせを受け付けました。',
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('APIエラーの詳細:', error);
    return new Response(JSON.stringify({
      message: error instanceof Error ? error.message : 'エラーが発生しました。しばらく経ってからもう一度お試しください。',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}