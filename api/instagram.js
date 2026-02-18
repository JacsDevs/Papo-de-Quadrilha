/* global process */
const DEFAULT_LIMIT = 3
const MAX_LIMIT = 10

function normalizeLimit(rawLimit) {
  const parsed = Number.parseInt(rawLimit ?? DEFAULT_LIMIT, 10)

  if (Number.isNaN(parsed) || parsed < 1) {
    return DEFAULT_LIMIT
  }

  return Math.min(parsed, MAX_LIMIT)
}

function mapInstagramItem(item) {
  return {
    id: item.id,
    caption: item.caption ?? '',
    mediaType: item.media_type ?? 'IMAGE',
    mediaUrl: item.media_type === 'VIDEO' ? item.thumbnail_url || item.media_url : item.media_url,
    permalink: item.permalink ?? '',
    timestamp: item.timestamp ?? null,
  }
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Metodo nao permitido.' })
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  const instagramUserId = process.env.INSTAGRAM_USER_ID
  const apiVersion = process.env.INSTAGRAM_API_VERSION || 'v24.0'
  const limit = normalizeLimit(request.query?.limit)

  if (!accessToken || !instagramUserId) {
    return response.status(500).json({
      error: 'Configure INSTAGRAM_ACCESS_TOKEN e INSTAGRAM_USER_ID no ambiente do Vercel.',
    })
  }

  const params = new URLSearchParams({
    fields: 'id,caption,media_type,media_url,permalink,timestamp,thumbnail_url',
    limit: String(limit),
    access_token: accessToken,
  })

  const endpoint = `https://graph.facebook.com/${apiVersion}/${instagramUserId}/media?${params.toString()}`

  try {
    const instagramResponse = await fetch(endpoint)
    const payload = await instagramResponse.json()

    if (!instagramResponse.ok) {
      const apiMessage = payload?.error?.message || 'Falha ao consultar Instagram Graph API.'
      throw new Error(apiMessage)
    }

    const posts = Array.isArray(payload.data) ? payload.data.map(mapInstagramItem) : []

    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600')
    return response.status(200).json({ data: posts })
  } catch (error) {
    console.error('Instagram API error:', error)
    return response.status(502).json({
      error: 'Nao foi possivel carregar posts do Instagram no momento.',
    })
  }
}
