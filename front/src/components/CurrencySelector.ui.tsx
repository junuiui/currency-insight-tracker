// src/components/CurrencySelector.tsx
interface CurrencySelectorProps {
    label: string;
    selected: string;
    currencies: string[];
    onSelect: (curr: string) => void;
}

export default function CurrencySelector({ label, selected, currencies, onSelect }: CurrencySelectorProps) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-600">{label}</label>
            <div className="grid grid-cols-3 gap-1.5">
                {currencies.map((curr) => (
                    <button
                        key={`${label}-${curr}`}
                        onClick={() => onSelect(curr)}
                        className={`px-3 py-2 text-sm border rounded transition-colors ${selected === curr
                                ? 'border-gray-900 bg-gray-900 text-white font-semibold'
                                : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {curr}
                    </button>
                ))}
            </div>
        </div>
    );
}