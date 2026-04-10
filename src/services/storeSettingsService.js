import { supabase } from '../lib/supabase'

export const storeSettingsService = {
  getSettings: async (key) => {
    const { data, error } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', key)
      .single()

    if (error && error.code !== 'PGRST116') throw error // Ignore "not found"
    return data?.value || null
  }
}
