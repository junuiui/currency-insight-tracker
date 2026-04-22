// src/hooks/useCurrency.ts
import { useState, useEffect } from 'react';

interface RateData {
    Date: string;
    Rate: string;
}

interface ApiResponse {
    pair: string;
    data: RateData[];
}

export function useCurrency() {
    const ENV_API_URL = import.meta.env.VITE_API_URL;
    const [baseCurrency, setBaseCurrency] = useState<string>('EUR');
    const [targetCurrency, setTargetCurrency] = useState<string>('KRW');
    const [days, setDays] = useState<string>('14');
    const [data, setData] = useState<RateData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchRates = async () => {
        if (baseCurrency === targetCurrency) {
            setData([]);
            return;
        }

        setLoading(true);
        try {
            const pair = `${baseCurrency}_${targetCurrency}`;
            const API_URL = `${ENV_API_URL}?pair=${pair}&days=${days}`;
            const response = await fetch(API_URL);
            const result: ApiResponse = await response.json();

            if (result.data) {
                const sortedData = result.data.sort((a, b) => a.Date.localeCompare(b.Date));
                setData(sortedData);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
    }, [baseCurrency, targetCurrency, days]);

    return {
        baseCurrency, setBaseCurrency,
        targetCurrency, setTargetCurrency,
        days, setDays,
        data, loading
    };
}