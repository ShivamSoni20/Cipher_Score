export const CONFIG = {
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001'),
    ORACLE_ADDRESS: import.meta.env.VITE_ORACLE_ADDRESS || '0x0479194feae060df3c06344514911af4f10d56ca3651ec1efb27171a1dfa86d4',
    NETWORK: 'sepolia',
    STARKSCAN_BASE: 'https://sepolia.voyager.online',
    INCOME_THRESHOLD_CENTS: 300000,
    DEMO_MODE: import.meta.env.VITE_DEMO_MODE === 'true',
};
