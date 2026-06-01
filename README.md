# 🗺 여행 가이드 PWA

**나만의 여행 일정을 앱으로 만들어보세요.**

JSON 파일 하나로 완성되는 오프라인 지원 여행 가이드 앱입니다.
일정 타임라인 · 예약 정보 · 날씨 · 맛집 · 지출 관리 · 준비물 체크리스트를 한 곳에서 관리할 수 있습니다.

---

## 데모

> **[🔗 라이브 데모 보기](https://famtrip-two.vercel.app)**
> *(나가노 · 가미코치 · 가나자와 3박 4일 샘플 일정)*

---

## 스크린샷

| 홈 | 일정 타임라인 | 예약 정보 |
|:---:|:---:|:---:|
| ![홈](./docs/home.png) | ![일정](./docs/plan.png) | ![예약](./docs/reservations.png) |

---

## 주요 기능

- **📅 일정 타임라인** — 날짜별 일정, 이동 정보 포함 구글맵 길찾기 연동
- **✈️ 예약 정보** — 항공 · 렌터카 · 호텔 · 식당 한눈에 보기
- **⛅ 날씨 정보** — Open-Meteo API 기반 실시간 날씨 / 과거 참고 날씨
- **🍽 맛집 가이드** — 목적지별 음식점 · 먹거리 가이드
- **💴 지출 관리** — 엔/달러/원 자동 환율 변환 · CSV 내보내기
- **✅ 체크리스트** — 진행률 바 · localStorage 자동 저장
- **📷 라이브 카메라** — YouTube 라이브 / 외부 웹캠 임베드
- **🎨 테마 색상** — 컬러 피커로 앱 전체 색상 변경
- **✏️ 편집 모드** — JSON 에디터로 인앱 데이터 수정
- **✨ AI로 만들기** — Claude.ai 무료 계정으로 trip.json 자동 생성
- **📴 오프라인 지원** — Service Worker PWA · 기내/산악에서도 동작
- **🖨 PDF 인쇄** — 전체 일정 PDF로 저장

---

## 나만의 여행으로 만들기

### 방법 1 — AI로 자동 생성 (권장, 무료)

앱 우측 하단 **✨ 버튼** → 여행 정보 입력 → Claude.ai에서 생성 → 편집기에 붙여넣기

```
예시 입력:
"도쿄 4박 5일, 친구 3명, 10월, 음식 + 쇼핑 위주"
"제주도 2박 3일, 가족 4명, 여름, 렌터카 여행"
```

Claude.ai 무료 계정으로 이용 가능합니다.

### 방법 2 — `data/trip.json` 직접 수정

핵심 파일은 **`data/trip.json`** 하나입니다.
일정·예약·맛집·쇼핑 모든 데이터가 여기 있습니다.

```
data/
└── trip.json    ← 이 파일만 수정하면 앱 전체가 바뀝니다
```

---

## 배포 (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO_NAME)

1. 위 버튼 클릭
2. GitHub 계정으로 로그인 (없으면 무료 가입)
3. 저장소 이름 입력 → **Deploy**
4. 자동 배포 완료 → 나만의 URL 생성

Vercel 무료 플랜으로 충분합니다.

---

## 로컬 실행

```bash
# 저장소 클론
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

# 로컬 서버 실행 (Python)
python3 -m http.server 8080

# 또는 Node.js
npx serve .

# 브라우저에서 열기
open http://localhost:8080
```

> ⚠️ `file://`로 직접 열면 trip.json 로드가 안 됩니다. 반드시 로컬 서버를 통해 열어주세요.

---

## 파일 구조

```
/
├── index.html          # 앱 전체 (HTML + CSS + JS 단일 파일)
├── sw.js               # Service Worker (오프라인 지원)
├── manifest.json       # PWA 매니페스트
├── icon.svg            # 앱 아이콘
├── data/
│   └── trip.json       # ★ 여행 데이터 (여기만 수정!)
└── web_img/            # 이미지 파일들 (선택)
```

---

## trip.json 구조

```jsonc
{
  "meta": { "schemaVersion": 2 },   // 스키마 버전
  "home": { ... },                  // 홈 화면 텍스트
  "overview": { ... },              // 여행 개요 · 루트 · 하이라이트
  "days": [                         // 날짜별 일정 (핵심!)
    {
      "label": "Day 1",
      "date": "07/23",
      "items": [
        { "type": "period", "cls": "morning", "label": "🌅 오전" },
        {
          "type": "item",
          "title": "활동명",
          "desc": "설명",
          "startAt": "09:00",
          "ts": { "icon": "🚗", "from": "출발지", "to": "도착지", "mode": "driving" }
        }
      ]
    }
  ],
  "reservations": { ... },          // 항공 · 렌터카 · 호텔 · 식당
  "eatExplore": { ... },            // 맛집 가이드
  "shopping": { ... },              // 쇼핑 가이드
  "attractions": [ ... ],           // 관광지 상세 + 체크리스트
  "outfits": [ ... ],               // 날짜별 옷차림 추천
  "checklist": { ... },             // 준비물 체크리스트
  "transport": { ... },             // 교통 정보 · 일본어 회화
  "cameras": [ ... ],               // 라이브 카메라
  "places": [ ... ],                // 장소 좌표 · 지도 링크 · 맵코드
  "weatherTips": [ ... ]            // 날씨 주의사항
}
```

전체 스키마 문서는 [`data/trip.json`](./data/trip.json)을 참고하세요.

---

## 기술 스택

- **프론트엔드** — 순수 HTML · CSS · JavaScript (프레임워크 없음)
- **데이터** — JSON (서버 불필요, 정적 파일)
- **날씨 API** — [Open-Meteo](https://open-meteo.com/) (무료, 키 불필요)
- **폰트** — [Pretendard](https://github.com/orioncactus/pretendard) · Noto Sans KR
- **PWA** — Service Worker · Web App Manifest
- **호스팅** — [Vercel](https://vercel.com/) (무료)

외부 의존성이 최소화되어 있어 유지보수가 쉽습니다.

---

## 커스터마이징

### 테마 색상 변경

앱 우측 하단 🎨 버튼 → 색상 선택 → 자동 저장

또는 `trip.json`의 `meta.colorPresets`에서 미리 정의:

```json
"colorPresets": [
  { "title": "Blue", "color": "#1E70FF", "dark": "#1554CC", ... }
]
```

### 이미지 추가

`web_img/` 폴더에 이미지를 넣고 `trip.json`에서 경로를 지정합니다.

```json
"image": "./web_img/my_photo.jpg"
```

---

## 라이선스

MIT License — 자유롭게 사용, 수정, 배포할 수 있습니다.

---

## 만든 이

여행 일정 짜는 것을 좋아해서 만들었습니다.
