import React, { useState } from 'react';
import { json2csv } from 'json-2-csv';

interface DownloadCSVProps {
    data: TypeTableIncome[];
}

type TypeTableIncome = {
    amount: number;
    link: string;
    short: string;
    views: number;
}

const DownloadCSV: React.FC<DownloadCSVProps> = ({ data }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleDownload = async (): Promise<void> => {
        setLoading(true);
        try {
            // Convert JSON to CSV
            const csv: string = json2csv(data);

            // Creating a Blob from CSV data
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            // Create a link and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'earnings_data.csv'); // Set file name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading CSV:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button className="" onClick={handleDownload} disabled={loading}>
                {loading ? 'Downloading...' : 'Download CSV'}
            </button>
        </div>
    );
};

export default DownloadCSV;
