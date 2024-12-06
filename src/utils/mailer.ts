import nodemailer from 'nodemailer';

const createTransporter = () => {
  console.log('SMTP Configuration:', {
    host: import.meta.env.PUBLIC_SMTP_HOST,
    port: import.meta.env.PUBLIC_SMTP_PORT,
    user: import.meta.env.PUBLIC_SMTP_USER ? '設定済み' : '未設定',
    pass: import.meta.env.PUBLIC_SMTP_PASS ? '設定済み' : '未設定',
  });

  return nodemailer.createTransport({
    host: import.meta.env.PUBLIC_SMTP_HOST,
    port: parseInt(import.meta.env.PUBLIC_SMTP_PORT),
    secure: false,
    auth: {
      user: import.meta.env.PUBLIC_SMTP_USER,
      pass: import.meta.env.PUBLIC_SMTP_PASS,
    },
    debug: true,
    logger: true
  });
};

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendAdminNotification(formData: ContactForm) {
  const transporter = createTransporter();
  const mailOptions = {
    from: import.meta.env.PUBLIC_SMTP_USER,
    to: import.meta.env.PUBLIC_ADMIN_EMAIL,
    subject: `新規お問い合わせ: ${formData.subject}`,
    html: `
      <h2>新規お問い合わせがありました</h2>
      <p><strong>名前:</strong> ${formData.name}</p>
      <p><strong>メールアドレス:</strong> ${formData.email}</p>
      <p><strong>件名:</strong> ${formData.subject}</p>
      <p><strong>内容:</strong></p>
      <p>${formData.message.replace(/\n/g, '<br>')}</p>
    `,
  };

  try {
    console.log('管理者通知メール送信開始:', mailOptions);
    const info = await transporter.sendMail(mailOptions);
    console.log('管理者通知メール送信成功:', info);
    return info;
  } catch (error) {
    console.error('管理者通知メール送信エラー:', error);
    throw error;
  }
}

export async function sendConfirmationEmail(formData: ContactForm) {
  const transporter = createTransporter();
  const mailOptions = {
    from: import.meta.env.PUBLIC_SMTP_USER,
    to: formData.email,
    subject: 'お問い合わせありがとうございます',
    html: `
      <h2>${formData.name} 様</h2>
      <p>お問い合わせありがとうございます。以下の内容で承りました。</p>
      <hr>
      <p><strong>件名:</strong> ${formData.subject}</p>
      <p><strong>お問い合わせ内容:</strong></p>
      <p>${formData.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p>内容を確認の上、担当者より回答させていただきます。</p>
      <p>今しばらくお待ちくださいますようお願い申し上げます。</p>
    `,
  };

  try {
    console.log('自動返信メール送信開始:', mailOptions);
    const info = await transporter.sendMail(mailOptions);
    console.log('自動返信メール送信成功:', info);
    return info;
  } catch (error) {
    console.error('自動返信メール送信エラー:', error);
    throw error;
  }
}