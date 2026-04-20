import { useEffect, useState } from 'react'

interface RateData {
    Date: string;
    Rate: string;
}

interface ApiResponse {
    pair: string;
    data: RateData[];
}

function App() {
    const ENV_API_URL = import.meta.env.VITE_API_URL;

    const [baseCurrency, setBaseCurrency] = useState<string>('EUR')
    const [targetCurrency, setTargetCurrency] = useState<string>('KRW')
    const [days, setDays] = useState<string>('14')
    const [data, setData] = useState<RateData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const currencies = ['CAD', 'USD', 'KRW', 'EUR', 'JPY']

    const fetchRates = async () => {
        if (baseCurrency === targetCurrency) {
            setData([]);
            return;
        }

        setLoading(true)
        try {
            const pair = `${baseCurrency}_${targetCurrency}`
            // 사용자님의 실제 API 주소로 유지하세요.
            const API_URL = `${ENV_API_URL}?pair=${pair}&days=${days}`;
            
            const response = await fetch(API_URL);
            const result: ApiResponse = await response.json();

            if (result.data) {
                const sortedData = result.data.sort((a, b) => a.Date.localeCompare(b.Date));
                setData(sortedData);
            } else {
                setData([]);
            }
        }
        catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRates();
    }, [baseCurrency, targetCurrency, days]);

    return (
        // 전체 배경은 흰색, 패딩만 넉넉하게
        <div className="p-8 bg-white min-h-screen text-gray-900">
            
            {/* 메인 컨테이너: 최대 너비 설정, 중앙 정렬, 연한 경계선 */}
            <div className="max-w-4xl mx-auto border border-gray-200 rounded-md">
                
                {/* 헤더: 하단 경계선 */}
                <div className="p-5 border-b border-gray-200">
                    <h1 className="text-xl font-bold">Currency History Tracker</h1>
                </div>

                {/* 컨트롤러 섹션: 왼쪽 폼, 오른쪽 결과 리스트 (Flexbox) */}
                <div className="flex flex-col md:flex-row">
                    
                    {/* 왼쪽: 입력 폼 (모바일에서는 위쪽, PC에서는 왼쪽) */}
                    <div className="w-full md:w-1/3 p-5 space-y-6 border-b md:border-b-0 md:border-r border-gray-200">
                        
                        {/* Base Selector */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">From (Base)</label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {currencies.map((curr) => (
                                    <button 
                                        key={`base-${curr}`}
                                        onClick={() => setBaseCurrency(curr)}
                                        className={`px-3 py-2 text-sm border rounded ${baseCurrency === curr ? 'border-gray-900 bg-gray-900 text-white font-semibold' : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'}`}
                                    >
                                        {curr}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Target Selector */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">To (Target)</label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {currencies.map((curr) => (
                                    <button 
                                        key={`target-${curr}`}
                                        onClick={() => setTargetCurrency(curr)}
                                        className={`px-3 py-2 text-sm border rounded ${targetCurrency === curr ? 'border-gray-900 bg-gray-900 text-white font-semibold' : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'}`}
                                    >
                                        {curr}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Days Input */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Last Days</label>
                            <input 
                                type="number"
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                                className='w-full border border-gray-200 p-2 text-sm rounded focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900'
                                placeholder='e.g. 30'
                            />
                        </div>
                    </div>

                    {/* 오른쪽: 결과 리스트 */}
                    <div className="w-full md:w-2/3 p-5">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-700">
                                {baseCurrency} / {targetCurrency}
                            </h2>
                            <span className="text-xs text-gray-400 font-mono">Count: {data.length}</span>
                        </div>

                        {loading ? (
                            <div className="text-center py-10 text-gray-500 text-sm">Loading...</div>
                        ) : baseCurrency === targetCurrency ? (
                            <div className="text-center py-10 text-gray-500 text-sm border border-dashed rounded bg-gray-50">
                                Cannot convert between same currencies.
                            </div>
                        ) : data.length > 0 ? (
                            // 스크롤 영역: 연한 경계선
                            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-2">
                                {data.map((item) => (
                                    <div key={item.Date} className="flex justify-between items-center px-4 py-2 bg-gray-50 border border-gray-100 rounded text-sm">
                                        <span className="font-mono text-gray-500">{item.Date}</span>
                                        <span className="font-semibold text-gray-950">{item.Rate}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-400 text-sm border border-dashed rounded">
                                No data found in DynamoDB.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <footer className="text-center mt-12 text-xs text-gray-400 font-mono">
                Junui Hong
            </footer>
        </div>
    )
}

export default App