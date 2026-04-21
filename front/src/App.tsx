import { useCurrency } from './hooks/useCurrency';
import CurrencySelector from './components/CurrencySelector.ui';
import ConverterComponent from './components/converter.component';
import HistoryChart from './components/HistoryChart.component';

function App() {
    const {
        baseCurrency, setBaseCurrency,
        targetCurrency, setTargetCurrency,
        days, setDays,
        data, loading
    } = useCurrency();

    const currencies = ['CAD', 'USD', 'KRW', 'EUR', 'JPY'];

    // Swap Logic
    const handleBaseChange = (newBase: string) => {
        if (newBase === targetCurrency) setTargetCurrency(baseCurrency);
        setBaseCurrency(newBase);
    };

    const handleTargetChange = (newTarget: string) => {
        if (newTarget === baseCurrency) setBaseCurrency(targetCurrency);
        setTargetCurrency(newTarget);
    };

    return (
        <div className="p-4 md:p-8 bg-white min-h-screen text-gray-900">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* 1. Header & From-To Selectors (Top) */}
                <div className="border border-gray-200 rounded-md p-5 bg-white shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h1 className="text-xl font-bold whitespace-nowrap">Currency Tracker</h1>
                        <div className="flex flex-1 items-center gap-4 justify-end">
                            <CurrencySelector
                                label="From"
                                selected={baseCurrency}
                                currencies={currencies}
                                onSelect={handleBaseChange}
                            />
                            <div className="text-gray-300 mt-5">→</div>
                            <CurrencySelector
                                label="To"
                                selected={targetCurrency}
                                currencies={currencies}
                                onSelect={handleTargetChange}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Period Selection (Sub-top) */}
                <div className="flex flex-wrap items-center justify-center gap-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex gap-1.5">
                        {[
                            { label: '7D', value: '7' },
                            { label: '1M', value: '30' },
                            { label: '6M', value: '180' },
                            { label: '1Y', value: '365' }
                        ].map((period) => (
                            <button
                                key={period.value}
                                onClick={() => setDays(period.value)}
                                className={`px-4 py-1.5 text-xs border rounded transition-colors ${days === period.value ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 hover:bg-gray-100'}`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 border-l pl-4 border-gray-300">
                        <span className="text-xs font-medium text-gray-500">Custom Days:</span>
                        <input
                            type="number"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            className="w-20 border border-gray-200 p-1 text-xs rounded focus:outline-none focus:border-gray-900"
                        />
                    </div>
                </div>

                {/* 3. Converter (Middle Center) */}
                <div className="flex justify-center">
                    <div className="w-full max-w-2xl border border-gray-200 rounded-md shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 text-xs font-bold border-b border-gray-200 text-center">
                            CURRENCY CONVERTER
                        </div>
                        <ConverterComponent from={baseCurrency} to={targetCurrency} data={data} />
                    </div>
                </div>

                {/* 4. Bottom Section: List (Left) & Chart (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* List - 1/3 width */}
                    <div className="lg:col-span-1 border border-gray-200 rounded-md p-5 flex flex-col h-[400px]">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b">
                            <h2 className="font-semibold text-sm">{baseCurrency}/{targetCurrency} List</h2>
                            <span className="text-[10px] text-gray-400 font-mono">n={data.length}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-1">
                            {loading ? (
                                <div className="text-center py-20 text-xs text-gray-400">Loading...</div>
                            ) : data.length > 0 ? (
                                // 리스트는 최신 데이터를 위로 보여주는 것이 보통 더 직관적입니다.
                                [...data].reverse().map((item) => {
                                    const numericRate = typeof item.Rate === 'string'
                                        ? parseFloat(item.Rate.replace(/,/g, ''))
                                        : item.Rate;

                                    // 숫자가 1보다 작으면 소수점 6자리, 크면 2자리 + 콤마 처리
                                    const displayRate = numericRate < 1
                                        ? numericRate.toFixed(6)
                                        : numericRate.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        });

                                    return (
                                        <div key={item.Date} className="flex justify-between items-center px-3 py-2 bg-gray-50 border border-gray-100 rounded text-xs">
                                            <span className="font-mono text-gray-500">{item.Date}</span>
                                            <span className="font-bold text-gray-900">{displayRate}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-20 text-xs text-gray-400">No data found.</div>
                            )}
                        </div>
                    </div>

                    {/* Chart - 2/3 width */}
                    <div className="lg:col-span-2 border border-gray-200 rounded-md p-5 bg-white shadow-sm flex flex-col h-[400px]">
                        <div className="mb-4 pb-2 border-b">
                            <h2 className="font-semibold text-sm">Trend Analysis</h2>
                        </div>
                        <div className="flex-1 w-full">
                            <HistoryChart data={data} />
                        </div>
                    </div>
                </div>
                
                <footer className="text-center pt-8 text-[10px] text-gray-400 font-mono">
                    DESIGNED BY JUNUI HONG • SFU SOFTWARE SYSTEMS
                </footer>
            </div>
        </div>
    );
}

export default App;