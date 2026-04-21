import { LineChart } from '@mui/x-charts/LineChart';

interface RateData {
    Date: string;
    Rate: string;
}

export default function HistoryChart({ data }: { data: RateData[] }) {
    // 1. 데이터 클렌징 + 주말 제외 필터링
    const cleanData = data
        .map(item => ({
            date: new Date(item.Date),
            dateStr: item.Date, // 원본 문자열 보존
            rate: parseFloat(item.Rate.replace(/,/g, '')),
            day: new Date(item.Date).getDay() // 0: 일, 6: 토
        }))
        // 토요일(6)과 일요일(0)을 제외
        .filter(item => item.day !== 0 && item.day !== 6)
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    // 포맷팅된 날짜 배열 (X축 라벨용)
    const xAxisLabels = cleanData.map(item =>
        item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    const seriesData = cleanData.map(item => item.rate);

    const rates = cleanData.map(d => d.rate);
    const minRate = Math.min(...rates);
    const maxRate = Math.max(...rates);

    const padding = (maxRate - minRate) * 0.15;
    const yAxisMin = minRate - padding;
    const yAxisMax = maxRate + padding;


    return (
        <div className="w-full h-80 bg-white">
            <LineChart
                xAxis={[{
                    data: xAxisLabels, // Date 객체 대신 포맷팅된 문자열 배열 전달
                    scaleType: 'point', // 'time' 대신 'point'를 사용하여 간격을 동일하게 배치
                    disableLine: true,
                    disableTicks: true,
                    // 데이터가 너무 많으면 x축 라벨이 겹치므로 적절히 조절
                    tickInterval: (_, index) => index % Math.ceil(cleanData.length / 7) === 0,
                }]}
                yAxis={[{
                    min: yAxisMin,
                    max: yAxisMax,
                    disableLine: true,
                    disableTicks: true,
                }]}
                series={[
                    {
                        data: seriesData,
                        curve: 'linear',
                        area: false,
                        showMark: cleanData.length < 15, // 데이터가 적을 때만 점 표시
                        color: '#0d542b',
                        valueFormatter: (value) => value !== null ? `${value.toFixed(2)}` : '',
                    },
                ]}
                grid={{ horizontal: true }}
                sx={{
                    '.MuiLineElement-root': { strokeWidth: 3 },
                    '.MuiChartsGrid-line': { strokeDasharray: '5 5', stroke: '#f0f0f0' }
                }}
                margin={{ left: 50, right: 20, top: 40, bottom: 40 }}
            >
            </LineChart>
        </div>
    );
}