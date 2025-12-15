import React, { createContext, useContext, useEffect, useState } from 'react';
import init, { connect, defaultConfig, type Seed } from "@breeztech/breez-sdk-spark";
import { decryptMnemonic } from "../utils/keystore";

interface BreezContextType {
    sdk: any | null;
    balance: number | null;
    status: string;
    refreshBalance: () => Promise<void>;
    connectWallet: (password: string) => Promise<boolean>;
    isInitialized: boolean;
}

const BreezContext = createContext<BreezContextType>({
    sdk: null,
    balance: null,
    status: "Disconnected",
    refreshBalance: async () => { },
    connectWallet: async () => false,
    isInitialized: false,
});

export const useBreez = () => useContext(BreezContext);

export const BreezProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sdk, setSdk] = useState<any>(null);
    const [status, setStatus] = useState("Initializing...");
    const [balance, setBalance] = useState<number | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize WASM once
    useEffect(() => {
        const initWasm = async () => {
            try {
                await init();
                // Check if we have a wallet to auto-connect
                const encrypted = localStorage.getItem("wallet_keystore");
                if (encrypted) {
                    const password = localStorage.getItem("wallet_password");
                    if (password) {
                        console.log("Auto-connecting...");
                        await connectToSdk(password);
                    } else {
                        setStatus("Locked");
                        setIsInitialized(true);
                    }
                } else {
                    setStatus("No Wallet");
                    setIsInitialized(true);
                }
            } catch (err) {
                console.error("WASM Init Error:", err);
                setStatus("Error");
                setIsInitialized(true);
            }
        };
        initWasm();
    }, []);

    const connectToSdk = async (password: string): Promise<boolean> => {
        try {
            setStatus("Connecting...");
            const encrypted = localStorage.getItem("wallet_keystore");
            if (!encrypted) {
                setStatus("No Wallet Found");
                return false;
            }

            const mnemonic = decryptMnemonic(encrypted, password);
            if (!mnemonic) {
                setStatus("Incorrect Password");
                return false;
            }

            const seed: Seed = { type: "mnemonic", mnemonic, passphrase: undefined };
            const config = defaultConfig("regtest");
            config.apiKey = import.meta.env.VITE_BREEZE_API_KEY || "";

            const connectedSdk = await connect({ config, seed, storageDir: "./.data" });
            setSdk(connectedSdk);

            const info = await connectedSdk.getInfo({ ensureSynced: false });
            setBalance(Number(info.balanceSats));
            setStatus("Connected");
            return true;
        } catch (err) {
            console.error("Connection Error:", err);
            setStatus("Connection Failed");
            return false;
        } finally {
            setIsInitialized(true);
        }
    };

    const refreshBalance = async () => {
        if (!sdk) return;
        try {
            const info = await sdk.getInfo({ ensureSynced: false });
            setBalance(Number(info.balanceSats));
        } catch (e) {
            console.error("Failed to refresh balance", e);
        }
    };

    return (
        <BreezContext.Provider value={{ sdk, balance, status, refreshBalance, connectWallet: connectToSdk, isInitialized }}>
            {children}
        </BreezContext.Provider>
    );
};
