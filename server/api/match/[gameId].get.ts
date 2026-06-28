import { getDb } from '../../utils/firebase'
import { getChampionNameById, getChampionKeyById, getDDragonVersion, getChampionImageUrl } from '../../utils/champion'

export default defineEventHandler(async (event) => {
  const gameId = getRouterParam(event, 'gameId') || ''
  const db = getDb()

  const doc = await db.collection('games').doc(gameId).get()
  if (!doc.exists) throw createError({ statusCode: 404, message: '게임을 찾을 수 없습니다.' })

  const game = doc.data() as any
  const version = await getDDragonVersion()

  const mode = game.gameMode === 'KIWI' ? '칼바람' : '협곡'
  const duration = game.gameDuration
    ? `${Math.floor(game.gameDuration / 60)}분 ${game.gameDuration % 60}초`
    : '-'
  const date = game.gameCreationDate
    ? new Date(game.gameCreationDate).toLocaleString('ko-KR')
    : '-'

  // 밴 챔피언
  const bansRaw = game.teamBans || {}
  const banIds: number[] = [
    ...(bansRaw['100'] || []).map((b: any) => (typeof b === 'object' ? b.championId : b)),
    ...(bansRaw['200'] || []).map((b: any) => (typeof b === 'object' ? b.championId : b)),
  ].filter(Boolean)
  const bans = await Promise.all(
    banIds.map(async (id) => {
      const champKey = await getChampionKeyById(id)
      return { name: await getChampionNameById(id), img: getChampionImageUrl(version, champKey) }
    })
  )

  // players 서브컬렉션 조회
  const playersSnap = await db.collection('games').doc(gameId).collection('players').get()
  const players = playersSnap.docs.map(d => d.data() as any)

  const winTeamId = game.winningTeam
  const loseTeamId = winTeamId === 100 ? 200 : 100

  async function buildPlayerRow(p: any) {
    const champKey = await getChampionKeyById(String(p.championId || ''))
    const champName = await getChampionNameById(String(p.championId || ''))
    return {
      summoner: p.summoner,
      champName,
      champImg: getChampionImageUrl(version, champKey),
      kills: p.kills ?? 0,
      deaths: p.deaths ?? 0,
      assists: p.assists ?? 0,
      kda: ((Number(p.kills || 0) + Number(p.assists || 0)) / Math.max(1, Number(p.deaths || 0))).toFixed(2),
      damage: Number(p.totalDamageDealtToChampions || 0).toLocaleString('ko-KR'),
      damageRaw: Number(p.totalDamageDealtToChampions || 0),
      gold: Number(p.goldEarned || 0).toLocaleString('ko-KR'),
      goldRaw: Number(p.goldEarned || 0),
    }
  }

  const winTeam = await Promise.all(players.filter(p => p.teamId === winTeamId).map(buildPlayerRow))
  const loseTeam = await Promise.all(players.filter(p => p.teamId === loseTeamId).map(buildPlayerRow))

  return { gameId, mode, duration, date, bans, winTeam, loseTeam }
})
