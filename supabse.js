// Supabase 연결 정보
const SUPABASE_URL = 'https://dfomeijvzayyszisqflo.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmb21laWp2emF5eXN6aXNxZmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjYwNDIsImV4cCI6MjA2MDQ0MjA0Mn0.-r1iL04wvPNdBeIvgxqXLF2rWqIUX5Ot-qGQRdYo_qk';

// Supabase 클라이언트 초기화
let supabaseClient;

/**
 * Supabase 클라이언트 초기화 함수
 * @returns {Object} Supabase 클라이언트 인스턴스
 */
function initSupabase() {
    if (!supabaseClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_API_KEY);
    }
    return supabaseClient;
}

// ✅ 전역으로 등록 (초기화 함수의 결과물을 window.supabase에 저장)
window.supabase = initSupabase();

// 페이지 로드 시 초기화 확인
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Supabase 클라이언트 초기화 완료');
        console.log('클라이언트 정보:', window.supabase);
    } catch (error) {
        console.error('Supabase 클라이언트 초기화 오류:', error);
    }
});

/**
 * 날짜에 해당하는 계획 데이터 가져오기
 * @param {number} date - 날짜 (yyyymmdd 형식의 숫자)
 * @returns {Promise<Array>} - 계획 데이터 객체 배열
 */
async function getPlanData(date) {
    try {
        // 클라이언트 확인
        if (!window.supabase) {
            console.error('Supabase 클라이언트가 초기화되지 않았습니다.');
            return [];
        }
        
        // 날짜는 int4 타입이므로 숫자로 변환
        const dateNumber = parseInt(date, 10);
        
        // Supabase 쿼리 실행
        const { data, error } = await window.supabase
            .from('activities_plan')
            .select('*')
            .eq('날짜', dateNumber)
            .order('시작시간', { ascending: true });
        
        if (error) {
            console.error('계획 데이터 조회 오류:', error);
            return [];
        }
        
        // 데이터 검증 및 반환
        return data || [];
    } catch (error) {
        console.error('계획 데이터 처리 중 오류 발생:', error);
        return [];
    }
}

/**
 * 주간 계획 데이터 일괄 가져오기
 * @param {Array<number>} dates - 날짜 배열 (yyyymmdd 형식)
 * @returns {Promise<Object>} - 날짜별 계획 데이터 객체
 */
async function getWeekPlanData(dates) {
    try {
        if (!window.supabase) {
            console.error('Supabase 클라이언트가 초기화되지 않았습니다.');
            return {};
        }
        
        // 날짜 배열을 숫자로 변환
        const dateNumbers = dates.map(date => parseInt(date, 10));
        
        // 한 번의 쿼리로 모든 날짜 데이터 가져오기
        const { data, error } = await window.supabase
            .from('activities_plan')
            .select('*')
            .in('날짜', dateNumbers)
            .order('날짜', { ascending: true })
            .order('시작시간', { ascending: true });
        
        if (error) {
            console.error('주간 계획 데이터 조회 오류:', error);
            return {};
        }
        
        // 날짜별로 데이터 그룹화
        const groupedData = {};
        dateNumbers.forEach(date => {
            groupedData[date] = [];
        });
        
        if (data) {
            data.forEach(activity => {
                if (groupedData[activity.날짜]) {
                    groupedData[activity.날짜].push(activity);
                }
            });
        }
        
        return groupedData;
    } catch (error) {
        console.error('주간 계획 데이터 처리 중 오류 발생:', error);
        return {};
    }
}

// 함수를 전역 객체에 할당하여 export
window.getPlanData = getPlanData;
window.getWeekPlanData = getWeekPlanData;

