// Public build-time settings. See .env.example.
// Only absolute https URLs are accepted, so a mistyped value can't produce a broken or unsafe link.
const httpsUrl = (value: string | undefined) => {
  const v = value?.trim() ?? '';
  try {
    return new URL(v).protocol === 'https:' ? v : '';
  } catch {
    return '';
  }
};

export const DONATION_URL = httpsUrl(process.env.NEXT_PUBLIC_DONATION_URL);
export const FORM_ENDPOINT = httpsUrl(process.env.NEXT_PUBLIC_FORM_ENDPOINT);
export const CHAT_API_URL = httpsUrl(process.env.NEXT_PUBLIC_CHAT_API_URL);

export const DONATION_MIN = 25;
export const DONATION_MAX = 100_000;
