let champIdToName: Record<string, string> | null = null
let champIdToKey: Record<string, string> | null = null
let cachedVersion: string | null = null

async function fetchLatestVersion(): Promise<string> {
  const res = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
  const data = await res.json() as string[]
  return data[0]
}

async function ensureChampionMap() {
  if (champIdToName) return { champIdToName, champIdToKey, version: cachedVersion }

  const version = await fetchLatestVersion()
  const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion.json`)
  const data = await res.json() as { data: Record<string, { key: string; name: string; id: string }> }

  champIdToName = {}
  champIdToKey = {}
  for (const champKey in data.data) {
    const champ = data.data[champKey]
    champIdToName[champ.key] = champ.name   // key: 숫자(문자열) → 한글명
    champIdToKey[champ.key] = champ.id      // key: 숫자(문자열) → 영문 id (이미지 URL용)
  }
  cachedVersion = version

  return { champIdToName, champIdToKey, version }
}

export async function getChampionNameById(champId: string | number): Promise<string> {
  const { champIdToName: map } = await ensureChampionMap()
  return map![String(champId)] || `챔피언#${champId}`
}

export async function getChampionKeyById(champId: string | number): Promise<string> {
  const { champIdToKey: keyMap } = await ensureChampionMap()
  return keyMap![String(champId)] || 'Aatrox'
}

export async function getDDragonVersion(): Promise<string> {
  const { version } = await ensureChampionMap()
  return version!
}

export function getChampionImageUrl(version: string, champKey: string): string {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champKey}.png`
}
