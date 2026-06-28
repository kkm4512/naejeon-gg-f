import { getDb } from '../../utils/firebase'
import { getChampionNameById, getChampionKeyById, getDDragonVersion, getChampionImageUrl } from '../../utils/champion'

export default defineEventHandler(async (event) => {
  const name = decodeURIComponent(getRouterParam(event, 'name') || '')
  if (!name) throw createError({ statusCode: 400, message: '소환사 이름이 필요합니다.' })

  const db = getDb()

  // summoners 배열에 이름이 포함된 게임만 조회 (전체 스캔 없음)
  const snap = await db.collection('games')
    .where('summoners', 'array-contains', name)
    .get()

  if (snap.empty) return { summoner: name, stats: null, recentGames: [], champStats: [] }

  const version = await getDDragonVersion()

  let totalWins = 0
  let totalGames = 0
  let totalKills = 0
  let totalDeaths = 0
  let totalAssists = 0
  let totalDamage = 0
  let totalGold = 0
  const champMap = new Map<string, { games: number; wins: number; kills: number; deaths: number; assists: number; champKey: string; champName: string }>()
  const recentGames: any[] = []

  // 날짜 내림차순 정렬
  const gameDocs = snap.docs.sort((a, b) => b.id.localeCompare(a.id))

  for (const gameDoc of gameDocs) {
    const game = gameDoc.data() as any
    if (game.status !== 'completed') continue

    // players 서브컬렉션에서 해당 소환사 찾기
    const playerSnap = await gameDoc.ref.collection('players')
      .where('summoner', '==', name)
      .limit(1)
      .get()

    if (playerSnap.empty) continue
    const myStats = playerSnap.docs[0].data() as any

    totalGames++
    if (myStats.win) totalWins++
    totalKills += Number(myStats.kills || 0)
    totalDeaths += Number(myStats.deaths || 0)
    totalAssists += Number(myStats.assists || 0)
    totalDamage += Number(myStats.totalDamageDealtToChampions || 0)
    totalGold += Number(myStats.goldEarned || 0)

    // 챔피언 통계
    const champId = String(myStats.championId || '')
    if (champId) {
      const champKey = await getChampionKeyById(champId)
      const champName = await getChampionNameById(champId)
      const entry = champMap.get(champId) || { games: 0, wins: 0, kills: 0, deaths: 0, assists: 0, champKey, champName }
      entry.games++
      if (myStats.win) entry.wins++
      entry.kills += Number(myStats.kills || 0)
      entry.deaths += Number(myStats.deaths || 0)
      entry.assists += Number(myStats.assists || 0)
      champMap.set(champId, entry)
    }

    // 최근 게임 목록 (최대 20)
    if (recentGames.length < 20) {
      const champKey = await getChampionKeyById(String(myStats.championId || ''))
      const champName = await getChampionNameById(String(myStats.championId || ''))
      const mode = game.gameMode === 'KIWI' ? '칼바람' : '협곡'
      const duration = game.gameDuration
        ? `${Math.floor(game.gameDuration / 60)}분 ${game.gameDuration % 60}초`
        : '-'
      recentGames.push({
        gameId: gameDoc.id,
        win: myStats.win,
        mode,
        duration,
        date: game.gameCreationDate
          ? new Date(game.gameCreationDate).toLocaleDateString('ko-KR')
          : '-',
        champName,
        champImg: getChampionImageUrl(version, champKey),
        kills: myStats.kills,
        deaths: myStats.deaths,
        assists: myStats.assists,
        damage: Number(myStats.totalDamageDealtToChampions || 0).toLocaleString('ko-KR'),
      })
    }
  }

  if (totalGames === 0) return { summoner: name, stats: null, recentGames: [], champStats: [] }

  const champStats = await Promise.all(
    [...champMap.entries()]
      .sort((a, b) => b[1].games - a[1].games)
      .slice(0, 10)
      .map(async ([champId, v]) => ({
        champName: v.champName,
        champImg: getChampionImageUrl(version, v.champKey),
        games: v.games,
        winRate: ((v.wins / v.games) * 100).toFixed(1),
        avgKda: ((v.kills + v.assists) / Math.max(1, v.deaths)).toFixed(2),
        avgKills: (v.kills / v.games).toFixed(1),
        avgDeaths: (v.deaths / v.games).toFixed(1),
        avgAssists: (v.assists / v.games).toFixed(1),
      }))
  )

  return {
    summoner: name,
    stats: {
      games: totalGames,
      wins: totalWins,
      losses: totalGames - totalWins,
      winRate: ((totalWins / totalGames) * 100).toFixed(1),
      avgKills: (totalKills / totalGames).toFixed(1),
      avgDeaths: (totalDeaths / totalGames).toFixed(1),
      avgAssists: (totalAssists / totalGames).toFixed(1),
      kda: ((totalKills + totalAssists) / Math.max(1, totalDeaths)).toFixed(2),
      avgDamage: Math.round(totalDamage / totalGames).toLocaleString('ko-KR'),
      avgGold: Math.round(totalGold / totalGames).toLocaleString('ko-KR'),
    },
    recentGames,
    champStats,
  }
})
