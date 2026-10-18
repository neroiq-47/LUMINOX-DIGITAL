// Files in /public are served under the GitHub Pages base path, which plain <img> tags don't add on their own.
export const asset = (path: string) => (process.env.NEXT_PUBLIC_BASE_PATH || '') + path;
