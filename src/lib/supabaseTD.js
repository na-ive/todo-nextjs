import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getTodos({ searchTitle = '', searchTags = [], sortHighToLow = true } = {}) {
  const { data, error } = await supabase
    .from('todoTabel')
    .select('*')
    .ilike('title', `%${searchTitle}%`) // filter title
    .contains('metadata', searchTags.length > 0 ? { tags: searchTags } : {}) // filter tags

  if (error) throw error

  const priorityOrder = ['high','medium','low']
  const sortedData = data.sort((a, b) => {
    const aP = a.metadata.priority
    const bP = b.metadata.priority
    return sortHighToLow
      ? priorityOrder.indexOf(aP) - priorityOrder.indexOf(bP) // high->low
      : priorityOrder.indexOf(bP) - priorityOrder.indexOf(aP) // low->high
  })

  return sortedData
}

export async function createTodo(title, metadata) {
  const { data, error } = await supabase
    .from('todoTabel')
    .insert([{ title, metadata }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTodo(id, title, metadata) {
  const { data, error } = await supabase
    .from('todoTabel')
    .update({ title, metadata })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTodoCompleted(id, is_completed) {
  const { data, error } = await supabase
    .from('todoTabel')
    .update({ is_completed })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTodo(id) {
  const { data, error } = await supabase
    .from('todoTabel')
    .delete()
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getUniqueTags() {
  const { data, error } = await supabase
    .from("todoTabel")
    .select("metadata");

  if (error) throw error;

  const allTags = data.flatMap(row => row.metadata?.tags || []);

  const uniqueTags = [...new Set(allTags)];

  return uniqueTags;
}