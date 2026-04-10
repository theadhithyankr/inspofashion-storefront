import { supabase } from '../lib/supabase'

export const collectionService = {
  getCollections: async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}
