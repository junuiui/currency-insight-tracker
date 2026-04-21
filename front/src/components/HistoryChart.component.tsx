import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js 필수 컴포넌트 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface RateData {
    Date: string;
    Rate: string;
}

export default function HistoryChart({ data }: { data: RateData[] }) {
    // 1. 데이터 가공 (기존 로직 유지)
    const cleanData = data
        .map(item => ({
            date: new Date(item.Date),
            formattedDate: new Date(item.Date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            rate: parseFloat(item.Rate.replace(/,/g, '')),
            day: new Date(item.Date).getDay()
        }))
        .filter(item => item.day !== 0 && item.day !== 6) // 주말 제외
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    const labels = cleanData.map(item => item.formattedDate);
    const rates = cleanData.map(item => item.rate);

    const minRate = Math.min(...rates);
    const maxRate = Math.max(...rates);
    const padding = (maxRate - minRate) * 0.15;

    // 2. Chart.js 설정 (Options)
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }, // 범례 숨김
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#000',
                bodyColor: '#000',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: (context: any) => `Rate: ${context.parsed.y.toFixed(7)}`
                }
            }
        },
        scales: {
            x: {
                type: 'category' as const, // MUI의 point scale과 동일
                grid: { display: false },
                border: { display: false },
                ticks: {
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 7, // X축 라벨 개수 제한
                    font: { size: 10 }
                }
            },
            y: {
                min: minRate - padding,
                max: maxRate + padding,
                border: { display: false },
                grid: {
                    color: '#f0f0f0',
                    lineWidth: 1,
                    tickBorderDash: [5, 5] // 점선 그리드
                },
                ticks: {
                    font: { size: 10 },
                    // Y축 눈금 소수점 6자리 해결 (0.00058 대응)
                    callback: (value: any) => value.toFixed(7)
                }
            }
        },
        elements: {
            line: {
                tension: 0, // 직선 (linear curve)
                borderWidth: 3,
                borderColor: '#0d542b',
                fill: false
            },
            point: {
                radius: cleanData.length < 15 ? 3 : 0, // 데이터 적을 때만 점 표시
                hoverRadius: 5,
                backgroundColor: '#0d542b'
            }
        }
    };

    // 3. Chart.js 데이터셋
    const chartData = {
        labels,
        datasets: [
            {
                data: rates,
                borderColor: '#0d542b',
                backgroundColor: 'rgba(13, 84, 43, 0.1)',
            }
        ]
    };

    return (
        <div className="w-full h-80 bg-white p-2">
            <Line options={options} data={chartData} />
        </div>
    );
}