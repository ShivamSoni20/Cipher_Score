export const CONFIG = {
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
    ORACLE_ADDRESS: import.meta.env.VITE_ORACLE_ADDRESS || '',
    NETWORK: 'sepolia',
    STARKSCAN_BASE: 'https://sepolia.starkscan.co',
    INCOME_THRESHOLD_CENTS: 300000, // $3,000 threshold for demo
};
