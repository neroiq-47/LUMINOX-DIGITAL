// Public build-time settings. See .env.example.
export const DONATION_URL = process.env.NEXT_PUBLIC_DONATION_URL || '';
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || '';
export const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || '';

export const DONATION_MIN = 25;
export const DONATION_MAX = 100_000;
