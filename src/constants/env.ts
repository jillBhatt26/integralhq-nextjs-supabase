export const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL! ?? '';

export const SUPABASE_PUBLISHABLE_KEY: string =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! ?? '';

export let API_URL: string = 'http://localhost:3000/api';

if (process.env.NEXT_PUBLIC_API_URL)
    API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
