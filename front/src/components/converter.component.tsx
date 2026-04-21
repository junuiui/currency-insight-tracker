import { useState } from "react";

interface RateData {
    Date: string;
    Rate: string;
}

interface ConverterProps {
    from: string;
    to: string;
    data: RateData[];
}

export default function ConverterComponent({ from, to, data }: ConverterProps) {
    const [amount, setAmount] = useState<number>(1);

    const latestRate = data.length > 0 ? parseFloat(data[data.length - 1].Rate) : 0;

    // 계산 로직
    const convertedAmount = (amount * latestRate).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <div className="p-5 border border-gray-200 rounded text-sm bg-gray-50 space-y-4">
            <h3 className="font-bold text-gray-700">Quick Converter</h3>

            {/* Horizontal Flex Container */}
            <div className="flex flex-col md:flex-row items-center gap-6">

                {/* L: Input & Conversion logic */}
                <div className="flex items-center gap-3 flex-1 w-full">
                    <div className="relative flex-1">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-gray-900 pr-10"
                        />
                        <span className="absolute right-3 top-2 text-gray-400 font-bold">{from}</span>
                    </div>

                    <span className="text-gray-400 font-bold">➔</span>

                    <div className="relative flex-1 bg-white border border-gray-300 p-2 rounded">
                        <span className="font-black text-gray-900">{convertedAmount}</span>
                        <span className="absolute right-3 text-gray-400 font-bold">{to}</span>
                    </div>
                </div>

                {/* R: Rate Info & Metadata */}
                <div className="flex flex-col items-end border-l border-gray-200 pl-6 min-w-50">
                    <div className="text-right">
                        <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Current Rate</span>
                        <span className="font-bold text-green-900">1 {from} = {latestRate} {to}</span>
                    </div>
                    <p className="mt-1 text-[10px] text-gray-400 text-right">
                        Based on {data.length > 0 ? data[data.length - 1].Date : 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    );
}