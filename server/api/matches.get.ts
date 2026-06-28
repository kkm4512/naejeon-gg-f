import { getDb } from '../utils/firebase'

const PAGE_SIZE = 10

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const mode = (query.mode as string) || 'ALL'

  const db = getDb()
  const snap = await db.collection('games').get()
  if (snap.empty) return { matches: [], total: 0, page, pageSize: PAGE_SIZE }

  const all: any[] = []
  snap.forEach(doc => {
    const game = doc.data() as any
    if (game.status !== 'completed') return
    if (mode !== 'ALL' && game.gameMode !== mode) return

    all.push({
      id: doc.id,
      mode: game.gameMode === 'KIWI' ? '칼바람' : '협곡',
      duration: game.gameDuration
        ? `${Math.floor(game.gameDuration / 60)}분 ${game.gameDuration % 60}초`
        : '-',
      date: game.gameCreationDate
        ? new Date(game.gameCreationDate).toLocaleDateString('ko-KR')
        : '-',
      players: (game.winTeamSummoners?.length || 0) + (game.loseTeamSummoners?.length || 0),
      winTeam: game.winTeamSummoners || [],
      loseTeam: game.loseTeamSummoners || [],
    })
  })

  all.sort((a, b) => Number(b.id) - Number(a.id))

  const total = all.length
  const matches = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  return { matches, total, page, pageSize: PAGE_SIZE, totalPages: Math.ceil(total / PAGE_SIZE) }
})
