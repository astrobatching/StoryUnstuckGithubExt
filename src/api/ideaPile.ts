import { supabase } from '../lib/supabase';
import type { IdeaItem, IdeaTag, IdeaReference } from '../types/ideaPile';

export const ideaPileApi = {
  // Core idea management
  async createIdea(idea: Omit<IdeaItem, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('idea_items')
      .insert([idea])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateIdea(id: string, updates: Partial<IdeaItem>) {
    const { data, error } = await supabase
      .from('idea_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteIdea(id: string) {
    const { error } = await supabase
      .from('idea_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getIdeas(filters?: {
    category?: string;
    status?: string;
    tags?: string[];
    search?: string;
  }) {
    let query = supabase
      .from('idea_items')
      .select(`
        *,
        tags:idea_tags(tag),
        references:idea_references(*)
      `);

    // Apply filters
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
    }
    if (filters?.tags?.length) {
      query = query.contains('tags', filters.tags);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Tag management
  async addTag(ideaId: string, tag: string) {
    const { data, error } = await supabase
      .from('idea_tags')
      .insert([{ idea_id: ideaId, tag }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeTag(ideaId: string, tag: string) {
    const { error } = await supabase
      .from('idea_tags')
      .delete()
      .eq('idea_id', ideaId)
      .eq('tag', tag);

    if (error) throw error;
  },

  // Project references
  async addReference(reference: Omit<IdeaReference, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('idea_references')
      .insert([reference])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeReference(id: string) {
    const { error } = await supabase
      .from('idea_references')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};