import { getDb } from '../utils/firebase'

export default defineEventHandler(async () => {
  const db = getDb()

  // 쿼리 1: 게임 목록 (game-level 필드만)
  const gamesSnap = await db.collection('games').get()
  if (gamesSnap.empty) return { recentMatches: [], topKill: null, topKda: null, topWinRate: null }

  const gameDocs = gamesSnap.docs
    .filter(d => d.data().status === 'completed')
    .sort((a, b) => Number(b.id) - Number(a.id))

  // 최근 게임 5개 (game doc 필드만으로 구성 — 추가 쿼리 없음)
  const recentMatches = gameDocs.slice(0, 5).map(doc => {
    const game = doc.data() as any
    return {
      id: doc.id,
      mode: game.gameMode === 'KIWI' ? '칼바람' : '협곡',
      duration: game.gameDuration
        ? `${Math.floor(game.gameDuration / 60)}분 ${game.gameDuration % 60}초`
        : '-',
      date: game.gameCreationDate
        ? new Date(game.gameCreationDate).toLocaleDateString('ko-KR')
        : '-',
      winTeam: game.winTeamSummoners || [],
      loseTeam: game.loseTeamSummoners || [],
    }
  })

  // 쿼리 2: 전체 플레이어를 한 번에 (collectionGroup)
  const playersSnap = await db.collectionGroup('players').get()

  const killMap = new Map<string, number>()
  const kdaMap = new Map<string, { kills: number; deaths: number; assists: number; games: number }>()
  const winMap = new Map<string, { wins: number; games: number }>()

  playersSnap.forEach(pd => {
    const p = pd.data() as any
    if (p.kills === undefined) return  // 탈주 게임 플레이어 제외
    const name = p.summoner
    if (!name) return

    killMap.set(name, (killMap.get(name) || 0) + Number(p.kills || 0))

    const kda = kdaMap.get(name) || { kills: 0, deaths: 0, assists: 0, games: 0 }
    kda.kills += Number(p.kills || 0)
    kda.deaths += Number(p.deaths || 0)
    kda.assists += Number(p.assists || 0)
    kda.games += 1
    kdaMap.set(name, kda)

    const win = winMap.get(name) || { wins: 0, games: 0 }
    win.games += 1
    if (p.win) win.wins += 1
    winMap.set(name, win)
  })

  const topKill = [...killMap.entries()].filter(([n]) => (kdaMap.get(n)?.games ?? 0) >= 10).sort((a, b) => b[1] - a[1])[0]
  const topKdaEntry = [...kdaMap.entries()].filter(([, v]) => v.games >= 10)
    .map(([n, v]) => ({ name: n, score: (v.kills + v.assists) / Math.max(1, v.deaths), ...v }))
    .sort((a, b) => b.score - a.score)[0]
  const topWinEntry = [...winMap.entries()].filter(([, v]) => v.games >= 10)
    .map(([n, v]) => ({ name: n, rate: v.wins / v.games, ...v }))
    .sort((a, b) => b.rate - a.rate)[0]

  return {
    recentMatches,
    topKill: topKill ? { name: topKill[0], value: topKill[1] } : null,
    topKda: topKdaEntry ? { name: topKdaEntry.name, score: topKdaEntry.score.toFixed(2) } : null,
    topWinRate: topWinEntry ? { name: topWinEntry.name, rate: (topWinEntry.rate * 100).toFixed(1), wins: topWinEntry.wins, games: topWinEntry.games } : null,
  }
})
