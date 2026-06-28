import { getDb } from '../utils/firebase'

type StatKey = 'kills' | 'assists' | 'deaths' | 'damage' | 'gold' | 'winRate' | 'kda'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const stat = (query.stat as StatKey) || 'kills'
  const mode = (query.mode as string) || 'ALL'

  const db = getDb()

  // 쿼리 1: 게임 목록 (mode 필터용)
  const gamesSnap = await db.collection('games').get()
  if (gamesSnap.empty) return []

  const validGameIds = new Set(
    gamesSnap.docs
      .filter(d => {
        const g = d.data() as any
        return g.status === 'completed' && (mode === 'ALL' || g.gameMode === mode)
      })
      .map(d => String(d.data().gameId))
  )

  // 쿼리 2: 전체 플레이어를 한 번에 (collectionGroup)
  const playersSnap = await db.collectionGroup('players').get()

  const map = new Map<string, { kills: number; deaths: number; assists: number; damage: number; gold: number; wins: number; games: number }>()

  playersSnap.forEach(pd => {
    const p = pd.data() as any
    if (p.kills === undefined) return  // 탈주 게임 플레이어 제외
    if (!validGameIds.has(String(p.gameId))) return  // mode 필터
    const name = p.summoner
    if (!name) return

    const cur = map.get(name) || { kills: 0, deaths: 0, assists: 0, damage: 0, gold: 0, wins: 0, games: 0 }
    cur.kills += Number(p.kills || 0)
    cur.deaths += Number(p.deaths || 0)
    cur.assists += Number(p.assists || 0)
    cur.damage += Number(p.totalDamageDealtToChampions || 0)
    cur.gold += Number(p.goldEarned || 0)
    cur.games += 1
    if (p.win) cur.wins += 1
    map.set(name, cur)
  })

  const rows = [...map.entries()].map(([name, v]) => {
    const kda = (v.kills + v.assists) / Math.max(1, v.deaths)
    const winRate = v.games > 0 ? v.wins / v.games : 0
    return {
      name,
      games: v.games,
      wins: v.wins,
      winRate: (winRate * 100).toFixed(1),
      kills: v.kills,
      avgKills: (v.kills / v.games).toFixed(1),
      deaths: v.deaths,
      avgDeaths: (v.deaths / v.games).toFixed(1),
      assists: v.assists,
      avgAssists: (v.assists / v.games).toFixed(1),
      kda: kda.toFixed(2),
      damage: v.damage,
      avgDamage: Math.round(v.damage / v.games).toLocaleString('ko-KR'),
      gold: v.gold,
      avgGold: Math.round(v.gold / v.games).toLocaleString('ko-KR'),
    }
  })

  return rows.filter(r => r.games >= 10).sort((a, b) => {
    if (stat === 'winRate') return Number(b.winRate) - Number(a.winRate)
    if (stat === 'kda') return Number(b.kda) - Number(a.kda)
    if (stat === 'kills') return b.kills - a.kills
    if (stat === 'assists') return b.assists - a.assists
    if (stat === 'deaths') return b.deaths - a.deaths
    if (stat === 'damage') return b.damage - a.damage
    if (stat === 'gold') return b.gold - a.gold
    return 0
  })
})
