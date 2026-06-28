# 내전.gg

리그 오브 레전드 내전 전적 검색 사이트입니다. Discord 봇이 기록한 내전 데이터를 기반으로 소환사 통계, 매치 상세 정보, 랭킹을 제공합니다.

**라이브:** https://naejeon-gg-f.vercel.app/

---

## 주요 기능

- **소환사 검색** — 전체 승/패/승률, KDA, 평균 딜/골드, 챔피언별 통계, 최근 전적 20경기
- **매치 상세** — 팀별 스코어보드, 밴 챔피언, 최고 딜·골드 하이라이트
- **랭킹** — 킬/어시스트/데스/딜량/골드/승률/KDA 기준, 협곡·칼바람 모드 필터 (최소 10게임 조건)
- **전체 전적** — 페이지네이션으로 전체 경기 목록 조회
- **홈** — 최근 5경기 요약, 상위 킬·KDA·승률 하이라이트

---

## 기술 스택

| 분류 | 사용 기술 |
|------|-----------|
| 프레임워크 | Nuxt 3 (Vue 3, SSR) |
| 스타일 | Tailwind CSS |
| 백엔드 | Nuxt Server Routes (Nitro) |
| 데이터베이스 | Firebase Firestore |
| 배포 | Vercel (Node preset) |
| 외부 API | Riot Data Dragon (챔피언 이미지·데이터) |

---

## 프로젝트 구조

```
├── pages/                    # 라우트 페이지
│   ├── index.vue             # 홈
│   ├── summoner/[name].vue   # 소환사 전적
│   ├── match/[gameId].vue    # 매치 상세
│   ├── ranking.vue           # 랭킹
│   └── matches.vue           # 전체 경기 목록
├── components/               # 공통 컴포넌트
├── server/
│   ├── api/                  # API 라우트 핸들러
│   └── utils/                # Firebase, 챔피언 매핑, 날짜 유틸
├── assets/css/               # 전역 스타일
└── nuxt.config.ts
```

---

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/summary` | 홈 요약 데이터 |
| GET | `/api/summoner/:name` | 소환사 통계 + 최근 전적 |
| GET | `/api/match/:gameId` | 매치 상세 정보 |
| GET | `/api/ranking?stat=kills&mode=CLASSIC` | 랭킹 (stat, mode 필터) |
| GET | `/api/matches?page=1&mode=ALL` | 전체 경기 목록 (페이지네이션) |

---

## 로컬 실행

### 환경 변수 설정

`.env` 파일을 생성하고 Firebase 서비스 계정 정보를 입력합니다.

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
```

### 실행

```bash
npm install
npm run dev
```

개발 서버가 `http://localhost:3000` 에서 실행됩니다.

### 빌드

```bash
npm run build
npm run preview
```

---

## Firestore 데이터 구조

Discord 봇이 아래 구조로 데이터를 기록한다고 가정합니다.

```
games/{gameId}
  mode: "CLASSIC" | "ARAM"
  duration: number       # 초 단위
  gameCreation: number   # Unix timestamp
  bannedChampions: string[]
  teams: { win: string[], lose: string[] }
  players/{playerId}
    summonerName: string
    championId: number
    kills: number
    deaths: number
    assists: number
    totalDamageDealt: number
    goldEarned: number
    win: boolean
```
