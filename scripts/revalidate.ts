/**
 * Clears the site's data cache after a script wrote through Payload's local API (collection hooks cannot reach the
 * Next.js server from another process). Targets REVALIDATE_URLS (comma-separated) when set, otherwise the local
 * dev/prod server (http://localhost:$PORT) and NEXT_PUBLIC_SITE_URL, so both a local and the deployed site refresh.
 */
export async function revalidateSite() {
  const configured = process.env.REVALIDATE_URLS?.split(',')
  const urls = (configured ?? [`http://localhost:${process.env.PORT || 3000}`, process.env.NEXT_PUBLIC_SITE_URL ?? ''])
    .map((url) => url.trim().replace(/\/$/, ''))
    .filter(Boolean)
  for (const url of new Set(urls)) {
    try {
      const res = await fetch(`${url}/next/revalidate`, {
        method: 'POST',
        headers: { 'x-revalidate-secret': process.env.PAYLOAD_SECRET || '' },
        signal: AbortSignal.timeout(15000),
      })
      console.log(res.ok ? `Đã làm mới cache: ${url}` : `Không làm mới được cache ${url} (${res.status}).`)
    } catch {
      console.log(`Không kết nối được ${url}: cache ở đó tự hết hạn sau tối đa 1 giờ.`)
    }
  }
}
