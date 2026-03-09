import {
  ANYTYPE_BODY_PROP_KEY,
  ANYTYPE_CATEGORY_PROP_KEY,
  ANYTYPE_DATE_PROP_KEY,
  ANYTYPE_NAME_PROP_KEY,
  ANYTYPE_SLUG_PROP_KEY,
} from './constants'
import { AnytypeObject, listObjectsInBlogSpace, getObjectById } from './client'

export type BlogCategory = 'thoughts' | 'projects' | string

export type BlogPostSummary = {
  id: string
  slug: string
  title: string
  date: string | null
  category: BlogCategory
}

export type BlogPost = BlogPostSummary & {
  body: string
}

function getDetail(obj: AnytypeObject, key: string): unknown {
  if (!obj.details) return null
  return (obj.details as Record<string, unknown>)[key]
}

function coerceString(value: unknown): string | null {
  if (value == null) return null
  if (typeof value === 'string') return value
  return String(value)
}

function mapObjectToSummary(obj: AnytypeObject): BlogPostSummary | null {
  const name =
    coerceString(getDetail(obj, ANYTYPE_NAME_PROP_KEY)) ??
    coerceString(obj.name) ??
    null
  const slug = coerceString(getDetail(obj, ANYTYPE_SLUG_PROP_KEY))
  const dateRaw = coerceString(getDetail(obj, ANYTYPE_DATE_PROP_KEY))
  const categoryRaw = coerceString(getDetail(obj, ANYTYPE_CATEGORY_PROP_KEY))

  if (!slug || !name || !categoryRaw) {
    return null
  }

  let isoDate: string | null = null
  if (dateRaw) {
    // Permite datas em formatos simples (YYYY-MM-DD, DD.MM.YYYY, etc.)
    const parsed = new Date(dateRaw.replaceAll('.', '-'))
    if (!Number.isNaN(parsed.getTime())) {
      isoDate = parsed.toISOString()
    }
  }

  return {
    id: obj.id,
    slug,
    title: name,
    date: isoDate,
    category: categoryRaw.toLowerCase() as BlogCategory,
  }
}

export async function getAllBlogPostSummaries(): Promise<BlogPostSummary[]> {
  const objects = await listObjectsInBlogSpace()
  const posts: BlogPostSummary[] = []

  for (const obj of objects) {
    const mapped = mapObjectToSummary(obj)
    if (mapped) {
      posts.push(mapped)
    }
  }

  // Ordena por data desc, posts sem data vão para o final
  posts.sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return b.date.localeCompare(a.date)
  })

  return posts
}

export async function getPostsByCategory(
  category: 'thoughts' | 'projects',
): Promise<BlogPostSummary[]> {
  const all = await getAllBlogPostSummaries()
  return all.filter((post) => post.category === category)
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getAllBlogPostSummaries()
  const summary = all.find((p) => p.slug === slug)
  if (!summary) return null

  const obj = await getObjectById(summary.id)
  if (!obj) return null

  const bodyRaw = getDetail(obj, ANYTYPE_BODY_PROP_KEY)
  const body = coerceString(bodyRaw) ?? ''

  return {
    ...summary,
    body,
  }
}

