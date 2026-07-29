import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Letter } from '../types';
import { INITIAL_LETTERS } from '../data/initialLetters';

const env = (import.meta as any).env || {};
const supabaseUrl = (env.VITE_SUPABASE_URL || process?.env?.VITE_SUPABASE_URL) as string | undefined;
const supabaseAnonKey = (env.VITE_SUPABASE_ANON_KEY || process?.env?.VITE_SUPABASE_ANON_KEY) as string | undefined;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('http') && 
    !supabaseUrl.includes('your-supabase-project')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Convert Supabase DB Row -> App Letter object
// Supports both camelCase and snake_case column schemas seamlessly
const mapRowToLetter = (row: any): Letter => {
  return {
    id: String(row.id),
    name: row.name || 'Anonymous Star',
    location: row.location || 'Celestial Cosmos',
    lat: typeof row.lat === 'number' ? row.lat : (row.lat ? Number(row.lat) : undefined),
    lng: typeof row.lng === 'number' ? row.lng : (row.lng ? Number(row.lng) : undefined),
    country: row.country || undefined,
    category: row.category || 'memories',
    content: row.content || '',
    archiveNumber: Number(row.archive_number ?? row.archiveNumber ?? 1),
    rarity: row.rarity || 'standard',
    dateCreated: row.date_created || row.dateCreated || new Date().toISOString().split('T')[0],
    isCapsuleLetter: Boolean(row.is_capsule_letter ?? row.isCapsuleLetter ?? false),
    waxColor: row.wax_color || row.waxColor || undefined,
    sealSymbol: row.seal_symbol || row.sealSymbol || undefined,
    paperStyle: row.paper_style || row.paperStyle || 'celestial',
  };
};

// Convert App Letter object -> Supabase DB Row
const mapLetterToRow = (letter: Letter): Record<string, any> => {
  return {
    id: letter.id,
    name: letter.name,
    location: letter.location,
    lat: letter.lat ?? null,
    lng: letter.lng ?? null,
    country: letter.country ?? null,
    category: letter.category,
    content: letter.content,
    archive_number: letter.archiveNumber,
    rarity: letter.rarity,
    date_created: letter.dateCreated,
    is_capsule_letter: letter.isCapsuleLetter ?? false,
    wax_color: letter.waxColor ?? null,
    seal_symbol: letter.sealSymbol ?? null,
    paper_style: letter.paperStyle ?? 'celestial',
  };
};

/**
 * Loads all letters from Supabase shared database.
 * If Supabase table is empty on first boot, seeds default initial exhibit letters!
 */
export async function loadLettersFromSupabase(): Promise<{ letters: Letter[]; isLiveDb: boolean; error?: string }> {
  if (!supabase) {
    console.warn('[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing. Using fallback exhibit.');
    return { letters: INITIAL_LETTERS, isLiveDb: false };
  }

  try {
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .order('archive_number', { ascending: false });

    if (error) {
      console.error('[Supabase Fetch Error]:', error.message);
      return { letters: INITIAL_LETTERS, isLiveDb: false, error: error.message };
    }

    if (!data || data.length === 0) {
      console.log('[Supabase] Database table "letters" is empty. Seeding initial museum collection...');
      // Auto-seed initial exhibit letters so the museum is immediately populated
      const rowsToInsert = INITIAL_LETTERS.map(mapLetterToRow);
      const { error: seedError } = await supabase.from('letters').insert(rowsToInsert);

      if (seedError) {
        console.warn('[Supabase Seed Warning]:', seedError.message);
        return { letters: INITIAL_LETTERS, isLiveDb: true };
      }

      return { letters: INITIAL_LETTERS, isLiveDb: true };
    }

    const parsedLetters = data.map(mapRowToLetter);
    return { letters: parsedLetters, isLiveDb: true };
  } catch (err: any) {
    console.error('[Supabase Client Error]:', err);
    return { letters: INITIAL_LETTERS, isLiveDb: false, error: err?.message || 'Unknown network error' };
  }
}

/**
 * Inserts a new submitted letter directly into the shared Supabase database.
 */
export async function saveLetterToSupabase(letter: Letter): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    console.warn('[Supabase] Env vars not set. Letter held in local session.');
    return { success: false, error: 'Supabase credentials not configured' };
  }

  try {
    const row = mapLetterToRow(letter);
    const { error } = await supabase.from('letters').insert([row]);

    if (error) {
      console.error('[Supabase Save Error]:', error.message);
      return { success: false, error: error.message };
    }

    console.log('[Supabase] Successfully saved letter globally:', letter.id);
    return { success: true };
  } catch (err: any) {
    console.error('[Supabase Insert Exception]:', err);
    return { success: false, error: err?.message || 'Failed to submit letter to database' };
  }
}
