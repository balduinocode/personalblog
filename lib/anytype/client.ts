import {
  ANYTYPE_API_URL,
  ANYTYPE_API_KEY,
  ANYTYPE_BLOG_SPACE_NAME,
} from './constants'

if (!ANYTYPE_API_KEY) {
  throw new Error('ANYTYPE_API_KEY is not set in the environment')
}

type Space = {
  id: string
  name?: string | null
}

export type AnytypeObject = {
  id: string
  name?: string | null
  type?: {
    key?: string | null
    name?: string | null
  } | null
  space_id?: string
  details?: Record<string, unknown> | null
}

type ListSpacesResponse = {
  data: Space[]
}

type ListObjectsResponse = {
  data: AnytypeObject[]
  next_offset?: number | null
}

async function anytypeRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = new URL(path, ANYTYPE_API_URL).toString()

  const res = await fetch(url, {
    ...init,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${ANYTYPE_API_KEY}`,
      ...(init.headers ?? {}),
    },
    // Em rotas server-side do Next, o cache padrão já é adequado.
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(
      `Anytype API error (${res.status}) for ${path}: ${body || res.statusText}`,
    )
  }

  return (await res.json()) as T
}

let cachedBlogSpaceId: string | null = null

export async function getBlogSpaceId(): Promise<string> {
  if (cachedBlogSpaceId) return cachedBlogSpaceId

  const resp = await anytypeRequest<ListSpacesResponse>('/v1/spaces', {
    method: 'GET',
  })

  const space =
    resp.data.find(
      (s) =>
        s.name &&
        s.name.toLowerCase().trim() ===
          ANYTYPE_BLOG_SPACE_NAME.toLowerCase().trim(),
    ) ?? resp.data[0]

  if (!space) {
    throw new Error('No Anytype spaces found for this API key')
  }

  cachedBlogSpaceId = space.id
  return cachedBlogSpaceId
}

export async function listObjectsInBlogSpace(): Promise<AnytypeObject[]> {
  const spaceId = await getBlogSpaceId()

  const all: AnytypeObject[] = []
  let offset = 0
  const limit = 100

  for (;;) {
    const query = `?offset=${offset}&limit=${limit}`
    const resp = await anytypeRequest<ListObjectsResponse>(
      `/v1/spaces/${spaceId}/objects${query}`,
      { method: 'GET' },
    )

    all.push(...(resp.data ?? []))

    if (!resp.next_offset || resp.data.length < limit) {
      break
    }

    offset = resp.next_offset
  }

  return all
}

export async function getObjectById(
  objectId: string,
): Promise<AnytypeObject | null> {
  const spaceId = await getBlogSpaceId()
  const obj = await anytypeRequest<AnytypeObject>(
    `/v1/spaces/${spaceId}/objects/${objectId}`,
    { method: 'GET' },
  )
  return obj ?? null
}

