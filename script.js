/**
 * 시간표 웹앱 메인 스크립트
 * - ES6+ 문법 사용
 * - async/await 패턴
 * - DOM 조작 최적화 (hidden 속성 활용)
 * - 에러 핸들링
 */

// 상수 정의
const DAYS_OF_WEEK = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
const MAX_PERIODS = 10;

// 파스텔 색상 클래스 배열
const PASTEL_COLORS = [
  'pastel-pink',
  'pastel-blue',
  'pastel-green',
  'pastel-yellow',
  'pastel-purple',
  'pastel-orange',
  'pastel-teal',
  'pastel-indigo',
  'pastel-rose',
  'pastel-cyan'
];

// 전역 상태 관리
let currentWeekStart = null;
let currentWeekData = {};
let isLoading = false;

// DOM 요소 참조
const elements = {
  weekTitle: null,
  weekRange: null,
  prevWeekBtn: null,
  nextWeekBtn: null,
  todayBtn: null,
  timetable: null,
  timetableBody: null
};

/**
 * 애플리케이션 초기화
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    initializeElements();
    setupEventListeners();
    initializeWeek();
    console.log('시간표 앱 초기화 완료');
  } catch (error) {
    console.error('앱 초기화 중 오류 발생:', error);
    showErrorState();
  }
});

/**
 * DOM 요소 초기화
 */
function initializeElements() {
  elements.weekTitle = document.getElementById('weekTitle');
  elements.weekRange = document.getElementById('weekRange');
  elements.prevWeekBtn = document.getElementById('prevWeekBtn');
  elements.nextWeekBtn = document.getElementById('nextWeekBtn');
  elements.todayBtn = document.getElementById('todayBtn');
  elements.timetable = document.getElementById('timetable');
  elements.timetableBody = document.getElementById('timetableBody');

  // 필수 요소 체크 (todayBtn 제외)
  const requiredElementNames = ['weekTitle', 'weekRange', 'prevWeekBtn', 'nextWeekBtn', 'timetable', 'timetableBody'];
  const missingElements = requiredElementNames.filter(name => !elements[name]);

  if (missingElements.length > 0) {
    throw new Error(`필수 DOM 요소를 찾을 수 없습니다: ${missingElements.join(', ')}`);
  }
}

/**
 * 이벤트 리스너 설정
 */
function setupEventListeners() {
  // 주차 네비게이션
  elements.prevWeekBtn.addEventListener('click', () => navigateWeek(-1));
  elements.nextWeekBtn.addEventListener('click', () => navigateWeek(1));

  // todayBtn이 존재할 경우에만 이벤트 리스너 추가
  if (elements.todayBtn) {
    elements.todayBtn.addEventListener('click', goToCurrentWeek);
  }

  // 키보드 네비게이션
  document.addEventListener('keydown', handleKeyboardNavigation);
}

/**
 * 키보드 네비게이션 처리
 * @param {KeyboardEvent} event 
 */
function handleKeyboardNavigation(event) {
  if (isLoading) return;

  switch (event.key) {
    case 'ArrowLeft':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        navigateWeek(-1);
      }
      break;
    case 'ArrowRight':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        navigateWeek(1);
      }
      break;
    case 'Home':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        goToCurrentWeek();
      }
      break;
  }
}

/**
 * 현재 주로 이동
 */
function initializeWeek() {
  const today = new Date();
  currentWeekStart = getWeekStart(today);
  updateWeekDisplay();
  loadCurrentWeekData();
}

/**
 * 오늘이 포함된 주로 이동
 */
function goToCurrentWeek() {
  const today = new Date();
  currentWeekStart = getWeekStart(today);
  updateWeekDisplay();
  loadCurrentWeekData();
}

/**
 * 주차 네비게이션
 * @param {number} direction - 방향 (-1: 이전주, 1: 다음주)
 */
function navigateWeek(direction) {
  if (isLoading) return;

  const newWeekStart = new Date(currentWeekStart);
  newWeekStart.setDate(newWeekStart.getDate() + (direction * 7));

  currentWeekStart = newWeekStart;
  updateWeekDisplay();
  loadCurrentWeekData();
}

/**
 * 주차 정보 표시 업데이트
 */
function updateWeekDisplay() {
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  // 주차 계산
  const weekNumber = getWeekNumber(currentWeekStart);
  const year = currentWeekStart.getFullYear();
  const month = currentWeekStart.getMonth() + 1;

  // 제목 업데이트 - "xxxx년 x월 x주차 시간표" 형식
  elements.weekTitle.textContent = `우리집 ${year}년 ${month}월 ${weekNumber}주차 시간표`;

  // 날짜 범위 업데이트
  const startDate = formatDate(currentWeekStart, 'MM.DD');
  const endDate = formatDate(weekEnd, 'MM.DD');
  elements.weekRange.textContent = `${startDate} - ${endDate}`;
}

/**
 * 주차 번호 계산
 * @param {Date} date 
 * @returns {number}
 */
function getWeekNumber(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstWeekStart = getWeekStart(firstDay);
  const diffTime = date.getTime() - firstWeekStart.getTime();
  const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
  return diffWeeks + 1;
}

/**
 * 주의 시작일(월요일) 계산
 * @param {Date} date 
 * @returns {Date}
 */
function getWeekStart(date) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day + (day === 0 ? -6 : 1); // 월요일을 주의 시작으로
  result.setDate(diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 날짜 포맷팅
 * @param {Date} date 
 * @param {string} format 
 * @returns {string}
 */
function formatDate(date, format) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
}

/**
 * YYYYMMDD 형식으로 날짜 변환
 * @param {Date} date 
 * @returns {number}
 */
function dateToYYYYMMDD(date) {
  return parseInt(formatDate(date, 'YYYYMMDD'), 10);
}

/**
 * 현재 주차 데이터 로드 (성능 최적화 버전)
 */
async function loadCurrentWeekData() {
  try {
    isLoading = true;

    // 일주일간의 날짜 생성
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      weekDates.push(dateToYYYYMMDD(date));
    }

    console.log('주간 날짜 생성:', weekDates);

    // 한 번의 쿼리로 주간 데이터 가져오기 (성능 최적화)
    if (typeof window.getWeekPlanData === 'function') {
      currentWeekData = await window.getWeekPlanData(weekDates);
      console.log('주간 데이터 로드 완료:', currentWeekData);
    } else {
      // fallback: 개별 쿼리
      console.warn('getWeekPlanData 함수를 사용할 수 없습니다. 개별 쿼리로 진행합니다.');
      const dataPromises = weekDates.map(date => window.getPlanData(date));
      const results = await Promise.all(dataPromises);

      currentWeekData = {};
      weekDates.forEach((date, index) => {
        currentWeekData[date] = results[index] || [];
      });
      console.log('개별 쿼리 데이터 로드 완료:', currentWeekData);
    }

    // 데이터 검증
    const hasAnyData = Object.values(currentWeekData).some(dayData =>
      Array.isArray(dayData) && dayData.length > 0
    );

    console.log('데이터 존재 여부:', hasAnyData);

    // 시간표 렌더링 (상태 표시 없이 바로 렌더링)
    renderTimetable();

  } catch (error) {
    console.error('주차 데이터 로드 중 오류:', error);
    // 에러가 발생해도 빈 시간표를 표시
    renderTimetable();
  } finally {
    isLoading = false;
  }
}

/**
 * 시간표 렌더링
 */
function renderTimetable() {
  try {
    console.log('시간표 렌더링 시작');

    // 시간대별 활동 정리
    const periodData = organizePeriodData();
    console.log('정리된 차수 데이터:', periodData);

    // 시간표 테이블 생성 (데이터가 없어도 빈 테이블 표시)
    elements.timetableBody.innerHTML = '';
    const table = createTimetableTable(periodData);
    elements.timetableBody.appendChild(table);

    console.log(`시간표 렌더링 완료: ${periodData.length}개 차수`);

    // 항상 시간표 표시
    showTimetable();

  } catch (error) {
    console.error('시간표 렌더링 중 오류:', error);
    // 에러가 발생해도 빈 테이블 표시
    elements.timetableBody.innerHTML = '';
    const emptyTable = createEmptyTimetableTable();
    elements.timetableBody.appendChild(emptyTable);
    showTimetable();
  }
}

/**
 * 빈 시간표 테이블 생성
 * @returns {HTMLElement}
 */
function createEmptyTimetableTable() {
  const table = document.createElement('table');
  table.className = 'timetable-table';

  // 테이블 헤더 생성
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // 차수 헤더
  const periodHeader = document.createElement('th');
  periodHeader.className = 'period-header';
  periodHeader.textContent = '차수';
  headerRow.appendChild(periodHeader);

  // 요일 헤더들
  DAYS_OF_WEEK.forEach(day => {
    const dayHeader = document.createElement('th');
    dayHeader.className = 'day-header';
    dayHeader.textContent = day;
    headerRow.appendChild(dayHeader);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // 빈 본문
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  return table;
}

/**
 * 시간표 테이블 생성
 * @param {Array} periodData 
 * @returns {HTMLElement}
 */
function createTimetableTable(periodData) {
  const table = document.createElement('table');
  table.className = 'timetable-table';

  // 테이블 헤더 생성
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // 차수 헤더
  const periodHeader = document.createElement('th');
  periodHeader.className = 'period-header';
  periodHeader.textContent = '차수';
  headerRow.appendChild(periodHeader);

  // 요일 헤더들 - 날짜와 요일 함께 표시
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

    const dayHeader = document.createElement('th');
    dayHeader.className = 'day-header';
    dayHeader.textContent = `${month}.${day}(${dayOfWeek})`;
    headerRow.appendChild(dayHeader);
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // 테이블 본문 생성
  const tbody = document.createElement('tbody');

  periodData.forEach((period, index) => {
    const row = createTimetableTableRow(period, index + 1);
    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  return table;
}

/**
 * 시간표 테이블 행 생성
 * @param {Object} period 
 * @param {number} periodNumber 
 * @returns {HTMLElement}
 */
function createTimetableTableRow(period, periodNumber) {
  const row = document.createElement('tr');
  row.className = 'timetable-row';

  // 차수 셀
  const periodCell = document.createElement('td');
  periodCell.className = `period-cell period-${periodNumber}`;

  const periodNumberDiv = document.createElement('div');
  periodNumberDiv.className = 'period-number';
  periodNumberDiv.textContent = `${periodNumber}차`;

  periodCell.appendChild(periodNumberDiv);
  row.appendChild(periodCell);

  // 각 요일별 활동 셀 생성
  for (let i = 0; i < 7; i++) {
    const activities = period.activities[i];
    const time = period.times[i];
    const cell = createActivityTableCell(activities, time);
    row.appendChild(cell);
  }

  return row;
}

/**
 * 활동명을 기반으로 일관된 색상 반환
 * @param {string} activityName 
 * @returns {string}
 */
function getColorForActivity(activityName) {
  // 활동명의 해시값을 계산하여 일관된 색상 선택
  let hash = 0;
  for (let i = 0; i < activityName.length; i++) {
    const char = activityName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit integer로 변환
  }

  // 해시값을 배열 인덱스로 변환
  const colorIndex = Math.abs(hash) % PASTEL_COLORS.length;
  return PASTEL_COLORS[colorIndex];
}

/**
 * 시간을 HH:MM 형식으로 포맷팅
 * @param {string} timeString - "H:MM" 또는 "HH:MM" 형식의 시간
 * @returns {string} - "HH:MM" 형식의 시간
 */
function formatTimeString(timeString) {
  if (!timeString) return '';

  const parts = timeString.split(':');
  if (parts.length !== 2) return timeString;

  const hours = parts[0].padStart(2, '0');
  const minutes = parts[1].padStart(2, '0');

  return `${hours}:${minutes}`;
}

/**
 * 활동 테이블 셀 생성 (시간 포함, 다중 활동 지원)
 * @param {Array|null} activities 
 * @param {string|null} time
 * @returns {HTMLElement}
 */
function createActivityTableCell(activities, time) {
  const cell = document.createElement('td');
  cell.className = 'activity-cell';

  if (activities && activities.length > 0) {
    cell.classList.add('activity-cell--filled');

    // 시작시간과 종료시간 계산 및 포맷팅
    const startTimes = [...new Set(activities.map(a => a.시작시간))].sort();
    const endTimes = [...new Set(activities.map(a => a.종료시간))].sort();

    let timeRange;
    if (startTimes.length === 1 && endTimes.length === 1) {
      // 단일 시간대
      timeRange = `${formatTimeString(startTimes[0])} ~ ${formatTimeString(endTimes[0])}`;
    } else {
      // 복수 시간대 - 가장 이른 시작시간부터 가장 늦은 종료시간까지
      const earliestStart = startTimes[0];
      const latestEnd = endTimes[endTimes.length - 1];
      timeRange = `${formatTimeString(earliestStart)} ~ ${formatTimeString(latestEnd)}`;
    }

    // 시간 표시
    const timeDiv = document.createElement('div');
    timeDiv.className = 'activity-time';
    timeDiv.textContent = timeRange;
    cell.appendChild(timeDiv);

    // 활동들을 파스텔 색상 태그로 표시
    const activitiesContainer = document.createElement('div');
    activitiesContainer.className = 'activities-container';

    activities.forEach(activity => {
      const activityTag = document.createElement('div');
      activityTag.className = 'activity-tag';

      // 활동명에 따라 일관된 파스텔 색상 적용
      const colorClass = getColorForActivity(activity.활동명);
      activityTag.classList.add(colorClass);

      activityTag.textContent = activity.활동명;

      // 개별 활동의 정확한 시간도 tooltip에 표시
      const activityTimeRange = `${formatTimeString(activity.시작시간)} ~ ${formatTimeString(activity.종료시간)}`;
      activityTag.title = `${activityTimeRange}\n${activity.활동명}`;

      activitiesContainer.appendChild(activityTag);
    });

    cell.appendChild(activitiesContainer);

    // 전체 셀의 tooltip
    const activityNames = activities.map(a => a.활동명).join(', ');
    cell.title = `${timeRange}\n${activityNames}`;

  } else {
    cell.classList.add('activity-cell--empty');
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-indicator';
    emptyDiv.textContent = '-';
    cell.appendChild(emptyDiv);
    cell.title = '일정 없음';
  }

  return cell;
}

/**
 * 차수별 데이터 정리 (요일별 독립 차수 방식 + 시간대별 그룹화)
 * @returns {Array}
 */
function organizePeriodData() {
  try {
    console.log('차수별 데이터 정리 시작');

    // 각 요일별로 시간대별 활동 그룹 생성
    const dayTimeGroupsMap = {};

    // 일주일간의 날짜 생성하여 요일 인덱스와 매핑
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      weekDates.push(dateToYYYYMMDD(date));
    }

    // 각 요일별로 시간대별 활동 그룹화
    weekDates.forEach((date, dayIndex) => {
      const dayData = currentWeekData[date] || [];
      console.log(`${DAYS_OF_WEEK[dayIndex]} (${date}) 데이터:`, dayData);

      // 시간대별로 활동 그룹화
      const timeGroups = {};
      dayData.forEach(activity => {
        if (activity && activity.시작시간) {
          const timeKey = activity.시작시간;
          if (!timeGroups[timeKey]) {
            timeGroups[timeKey] = [];
          }
          timeGroups[timeKey].push(activity);
        }
      });

      // 시간순으로 정렬된 그룹 배열 생성
      const sortedTimeGroups = Object.keys(timeGroups)
        .sort()
        .map(time => ({
          time: time,
          activities: timeGroups[time]
        }));

      dayTimeGroupsMap[dayIndex] = sortedTimeGroups;
      console.log(`${DAYS_OF_WEEK[dayIndex]} 시간대 그룹:`, sortedTimeGroups);
    });

    // 최대 차수 계산
    const maxPeriods = Math.max(
      ...Object.values(dayTimeGroupsMap).map(groups => groups.length),
      0
    );

    console.log('최대 차수:', maxPeriods);

    // 데이터가 없으면 빈 배열 반환
    if (maxPeriods === 0) {
      console.log('모든 요일에 데이터가 없음');
      return [];
    }

    // 최대 10차까지만 표시
    const periodsToShow = Math.min(maxPeriods, MAX_PERIODS);
    console.log('표시할 차수:', periodsToShow);

    // 차수별로 데이터 구성
    const periodData = [];

    for (let periodIndex = 0; periodIndex < periodsToShow; periodIndex++) {
      const period = {
        periodNumber: periodIndex + 1,
        activities: {},
        times: {} // 각 요일별 시간 저장
      };

      // 각 요일의 해당 차수 활동 그룹 추가
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const dayTimeGroups = dayTimeGroupsMap[dayIndex] || [];
        const timeGroup = dayTimeGroups[periodIndex] || null;

        if (timeGroup) {
          period.activities[dayIndex] = timeGroup.activities;
          period.times[dayIndex] = timeGroup.time;
        } else {
          period.activities[dayIndex] = null;
          period.times[dayIndex] = null;
        }
      }

      periodData.push(period);
    }

    console.log('최종 차수별 데이터:', periodData);
    return periodData;

  } catch (error) {
    console.error('차수별 데이터 정리 중 오류:', error);
    return [];
  }
}

/**
 * YYYYMMDD 날짜에서 요일 인덱스 계산
 * @param {number} yyyymmdd 
 * @returns {number} 0: 월요일, 6: 일요일
 */
function getDayOfWeekFromDate(yyyymmdd) {
  const year = Math.floor(yyyymmdd / 10000);
  const month = Math.floor((yyyymmdd % 10000) / 100) - 1;
  const day = yyyymmdd % 100;

  const date = new Date(year, month, day);
  const dayOfWeek = date.getDay();

  // 일요일(0)을 6으로, 월요일(1)을 0으로 변환
  return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
}

/**
 * 상태별 UI 표시 함수들 - 로딩/에러 상태 제거
 */
function showTimetable() {
  // 모든 상태를 숨기고 시간표만 표시
  if (elements.loadingState) elements.loadingState.hidden = true;
  if (elements.errorState) elements.errorState.hidden = true;
  if (elements.emptyState) elements.emptyState.hidden = true;
  elements.timetable.hidden = false;
}



/**
 * 디버깅용 함수들
 */
window.debugTimetable = {
  getCurrentWeekData: () => currentWeekData,
  getCurrentWeekStart: () => currentWeekStart,
  reloadData: loadCurrentWeekData,
  testDate: (yyyymmdd) => window.getPlanData(yyyymmdd)
};

/**
 * 간단한 인쇄 함수
 */
function printTimetableByRows() {
  // CSS에서 page-break를 사용하므로 단순히 인쇄만 실행
  window.print();
}

// 전역 함수로 내보내기
window.printTimetableByRows = printTimetableByRows; 