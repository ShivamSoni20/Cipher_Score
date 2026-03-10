export const CONFIG = {
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
    ORACLE_ADDRESS: import.meta.env.VITE_ORACLE_ADDRESS || '0x066ef733b99884bf427fb810d720c6f2df9894ec4f31e6e17358751b83054e3a',
    NETWORK: 'sepolia',
    STARKSCAN_BASE: 'https://sepolia.starkscan.co',
    INCOME_THRESHOLD_CENTS: 300000, // $3,000 threshold for demo
};
