# 🗓️ AH 시간표 웹앱

> HTML/CSS/JavaScript + Supabase 기반의 반응형 시간표 웹 애플리케이션

![GitHub last commit](https://img.shields.io/github/last-commit/username/AH_newtimetable)
![GitHub repo size](https://img.shields.io/github/repo-size/username/AH_newtimetable)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)

## 📋 프로젝트 소개

AH 시간표는 가족이나 팀의 주간 활동 계획을 효율적으로 관리하고 시각화할 수 있는 반응형 웹 애플리케이션입니다. Supabase를 백엔드로 사용하여 실시간으로 데이터를 동기화하며, 모든 디바이스에서 최적화된 사용자 경험을 제공합니다.

## ✨ 주요 기능

### 🏠 핵심 기능

- **📅 주간 시간표 관리**: 월요일부터 일요일까지 7일간의 활동 일정 표시
- **🔄 주차 네비게이션**: 이전/다음 주차로 손쉬운 이동
- **📱 완전 반응형**: 모바일, 태블릿, 데스크톱 모든 환경에서 최적화
- **🖨️ 인쇄 최적화**: A4 가로 형식으로 깔끔한 인쇄 지원
- **🎨 직관적 UI**: 차수별 색상 구분과 깔끔한 디자인

### 🛠 고급 기능

- **⚡ 실시간 데이터**: Supabase 실시간 데이터베이스 연동
- **🎯 성능 최적화**: 주간 단위 데이터 배치 로딩
- **♿ 접근성**: WCAG 가이드라인 준수
- **🌙 다크 모드**: 시스템 테마 자동 감지
- **⌨️ 키보드 네비게이션**: Ctrl/Cmd + 화살표키로 주차 이동

## 🏗️ 기술 스택

### Frontend

- **HTML5**: 시맨틱 마크업
- **CSS3**:
  - CSS Grid & Flexbox 레이아웃
  - CSS Variables (Custom Properties)
  - clamp() 함수를 활용한 반응형 타이포그래피
  - CSS 애니메이션 & 트랜지션
- **JavaScript (ES6+)**:
  - Async/Await 비동기 처리
  - 모듈 패턴
  - DOM 조작 최적화

### Backend & Database

- **Supabase**:
  - PostgreSQL 데이터베이스
  - 실시간 구독 (Realtime)
  - Row Level Security (RLS)

### 개발 도구

- **Cursor Rules**: 코드 품질 및 일관성 관리
- **Git**: 버전 관리
- **PWA**: Progressive Web App 구조

## 📁 프로젝트 구조

```
AH_newtimetable/
├── 📄 index.html              # 메인 HTML 파일
├── 📁 css/
│   └── 📄 style.css           # 메인 스타일시트
├── 📁 js/
│   └── 📄 script.js           # 메인 JavaScript 로직
├── 📄 supabase.js             # Supabase 연동 API
├── 📄 .cursorrules            # 개발 가이드라인
└── 📄 README.md               # 프로젝트 문서
```

## 🚀 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/username/AH_newtimetable.git
cd AH_newtimetable
```

### 2. Supabase 설정

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. `supabase.js` 파일에서 연결 정보 수정:

```javascript
const SUPABASE_URL = "your-supabase-url";
const SUPABASE_API_KEY = "your-supabase-anon-key";
```

### 3. 데이터베이스 테이블 생성

```sql
CREATE TABLE activities_plan (
    id SERIAL PRIMARY KEY,
    날짜 INTEGER NOT NULL,
    시작시간 TEXT NOT NULL,
    종료시간 TEXT NOT NULL,
    활동명 TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. 로컬 서버 실행

```bash
# Python 3.x
python -m http.server 8000

# Node.js (http-server 설치 필요)
npx http-server

# Live Server (VS Code Extension)
Live Server로 실행
```

### 5. 브라우저에서 확인

```
http://localhost:8000
```

## 📱 사용법

### 기본 사용법

1. **주차 이동**: 좌/우 화살표 버튼으로 이전/다음 주 이동
2. **인쇄**: 우상단 인쇄 버튼으로 A4 가로 형식 인쇄
3. **반응형**: 모바일/태블릿에서 터치로 조작

### 키보드 단축키

- `Ctrl/Cmd + ←`: 이전 주로 이동
- `Ctrl/Cmd + →`: 다음 주로 이동
- `Ctrl/Cmd + Home`: 현재 주로 이동

### 데이터 형식

활동 데이터는 다음 형식으로 입력:

```javascript
{
    날짜: 20241225,           // YYYYMMDD 형식
    시작시간: "09:00",        // HH:MM 형식
    종료시간: "10:30",        // HH:MM 형식
    활동명: "회의"            // 활동 이름
}
```

## 🎨 디자인 시스템

### 반응형 브레이크포인트

- **모바일**: `~ 767px`
- **태블릿**: `768px ~ 1023px`
- **데스크톱**: `1024px ~`

### 컬러 팔레트

- **Primary**: `#10b981` (에메랄드 그린)
- **차수별 파스텔 색상**: 10가지 구분 색상
- **다크 모드**: 시스템 설정 자동 감지

### 타이포그래피

- **폰트**: Noto Sans KR + 시스템 폰트 폴백
- **반응형 폰트**: `clamp()` 함수 활용
- **최소 크기**: 16px (모바일 가독성 보장)

## 🛠️ 개발 가이드라인

### 코드 스타일

- **들여쓰기**: 2스페이스
- **문자열**: 작은따옴표 사용
- **세미콜론**: 필수
- **네이밍**: 카멜케이스 (상수는 UPPER_SNAKE_CASE)

### DOM 조작 원칙

- `innerHTML` 사용 최소화
- `hidden` 속성으로 요소 표시/숨김 제어
- 이벤트 위임 패턴 활용
- 성능 최적화: 디바운싱, 쓰로틀링

### Supabase 연동 규칙

- 모든 함수는 `{ data, error }` 형태로 반환
- async/await 패턴 사용
- 에러 핸들링 필수
- 주간 데이터 배치 로딩으로 성능 최적화

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 개발 환경 설정

```bash
# ESLint & Prettier 설정 (선택사항)
npm init -y
npm install --save-dev eslint prettier
```

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🏷️ 버전 정보

- **v1.0.0**: 기본 시간표 기능 구현
- **v1.1.0**: 반응형 디자인 개선
- **v1.2.0**: 모바일/태블릿 최적화
- **v1.3.0**: 인쇄 기능 최적화

## 📞 문의사항

프로젝트에 대한 질문이나 제안사항이 있으시면 언제든지 연락주세요.

- **GitHub Issues**: [Issues 페이지](https://github.com/username/AH_newtimetable/issues)
- **Email**: your-email@example.com

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되셨다면 스타를 눌러주세요! ⭐**

Made with ❤️ by [Your Name]

</div>
