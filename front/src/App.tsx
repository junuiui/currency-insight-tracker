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

    return (
        <div className="p-8 bg-white min-h-screen text-gray-900">
            <div className="max-w-4xl mx-auto border border-gray-200 rounded-md">

                {/* Header */}
                <div className="p-5 border-b border-gray-200">
                    <h1 className="text-xl font-bold">Currency History Tracker</h1>
                </div>

                <div className="flex flex-col md:flex-row">
                    {/* Left: Controls */}
                    <div className="w-full md:w-1/3 p-5 space-y-6 border-b md:border-b-0 md:border-r border-gray-200">
                        <CurrencySelector
                            label="From (Base)"
                            selected={baseCurrency}
                            currencies={currencies}
                            onSelect={setBaseCurrency}
                        />
                        <CurrencySelector
                            label="To (Target)"
                            selected={targetCurrency}
                            currencies={currencies}
                            onSelect={setTargetCurrency}
                        />

                        {/* 날짜 선택 버튼 그룹 */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Period</label>
                            <div className="grid grid-cols-2 gap-1.5">
                                {[
                                    { label: '7 Days', value: '7' },
                                    { label: '1 Month', value: '30' },
                                    { label: '6 Months', value: '180' },
                                    { label: '1 Year', value: '365' }
                                ].map((period) => (
                                    <button
                                        key={period.value}
                                        onClick={() => setDays(period.value)}
                                        className={`px-2 py-1.5 text-xs border rounded ${days === period.value ? 'bg-gray-200 border-gray-400 font-bold' : 'bg-white border-gray-200'}`}
                                    >
                                        {period.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Last Days</label>
                            <input
                                type="number"
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                                className='w-full border border-gray-200 p-2 text-sm rounded focus:outline-none focus:border-gray-900'
                            />
                        </div>
                    </div>

                    {/* Right: Results List */}
                    <div className="w-full md:w-2/3 p-5">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-700">{baseCurrency} / {targetCurrency}</h2>
                            <span className="text-xs text-gray-400 font-mono">Count: {data.length}</span>
                        </div>

                        {loading ? (
                            <div className="text-center py-10 text-gray-500 text-sm">Loading...</div>
                        ) : baseCurrency === targetCurrency ? (
                            <div className="text-center py-10 text-gray-500 text-sm border border-dashed rounded bg-gray-50">
                                Same currencies selected.
                            </div>
                        ) : data.length > 0 ? (
                            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-2">
                                {data.map((item) => (
                                    <div key={item.Date} className="flex justify-between items-center px-4 py-2 bg-gray-50 border border-gray-100 rounded text-sm">
                                        <span className="font-mono text-gray-500">{item.Date}</span>
                                        <span className="font-semibold text-gray-950">{item.Rate}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-400 text-sm border border-dashed rounded">No data found.</div>
                        )}
                    </div>
                </div>

                {/* Bottom: Converter */}
                <div className="border-t border-gray-200">
                    <ConverterComponent from={baseCurrency} to={targetCurrency} data={data} />
                </div>
            </div>

            <div>
                <HistoryChart data={data} />
            </div>

            <footer className="text-center mt-12 text-xs text-gray-400 font-mono">Junui Hong</footer>
        </div>
    );
}

export default App;