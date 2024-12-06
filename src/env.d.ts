/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SMTP_HOST: string;
  readonly PUBLIC_SMTP_PORT: string;
  readonly PUBLIC_SMTP_USER: string;
  readonly PUBLIC_SMTP_PASS: string;
  readonly PUBLIC_ADMIN_EMAIL: string;
  readonly MICROCMS_SERVICE_DOMAIN: string;
  readonly MICROCMS_API_KEY: string;
  readonly SPREADSHEET_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}