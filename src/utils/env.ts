export function get(key: string): string {
  const val = process.env[key];

  if (!val) {
    throw new Error(`Required environment variable ${key} not set`);
  }

  return val;
}
