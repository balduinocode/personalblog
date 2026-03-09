export const ANYTYPE_API_URL =
  process.env.ANYTYPE_API_URL ?? 'http://127.0.0.1:31009'

// API key gerado pelo Anytype (NÃO versionar em git!).
export const ANYTYPE_API_KEY = process.env.ANYTYPE_API_KEY

// Nome do canal/space onde está a página "Blog Content".
export const ANYTYPE_BLOG_SPACE_NAME =
  process.env.ANYTYPE_BLOG_SPACE_NAME ?? 'Blog'

// Nome da página que contém a tabela de posts.
export const ANYTYPE_BLOG_PAGE_NAME =
  process.env.ANYTYPE_BLOG_PAGE_NAME ?? 'Blog Content'

// Chaves das propriedades dos posts dentro de `details`.
export const ANYTYPE_NAME_PROP_KEY =
  process.env.ANYTYPE_NAME_PROP_KEY ?? 'name'
export const ANYTYPE_SLUG_PROP_KEY =
  process.env.ANYTYPE_SLUG_PROP_KEY ?? 'slug'
export const ANYTYPE_DATE_PROP_KEY =
  process.env.ANYTYPE_DATE_PROP_KEY ?? 'date'
export const ANYTYPE_CATEGORY_PROP_KEY =
  process.env.ANYTYPE_CATEGORY_PROP_KEY ?? 'category'
export const ANYTYPE_BODY_PROP_KEY =
  process.env.ANYTYPE_BODY_PROP_KEY ?? 'body'

