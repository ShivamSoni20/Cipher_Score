import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StarknetConfig, publicProvider, argent, braavos } from '@starknet-react/core';
import { sepolia } from '@starknet-react/chains';
import "./index.css";

const connectors = [argent(), braavos()];

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <StarknetConfig
            chains={[sepolia]}
            provider={publicProvider()}
            connectors={connectors}
            autoConnect
        >
            <App />
        </StarknetConfig>
    </React.StrictMode>
);
