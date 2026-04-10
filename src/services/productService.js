import { supabase } from '../lib/supabase'

export const productService = {
  async getActiveProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },
}
