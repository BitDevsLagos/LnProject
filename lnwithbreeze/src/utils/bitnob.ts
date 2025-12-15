import axios from 'axios';

const BITNOB_API_KEY = import.meta.env.VITE_BITNOB_API_KEY;
const BITNOB_BASE_URL = 'https://sandboxapi.bitnob.co/api/v1'; // Sandbox URL

const api = axios.create({
    baseURL: BITNOB_BASE_URL,
    headers: {
        'Authorization': `Bearer ${BITNOB_API_KEY}`,
        'Content-Type': 'application/json',
    },
});

// --- On-Ramp (Paying a Lightning Invoice) ---
export const payLightningInvoice = async (invoice: string) => {
    try {
        const response = await api.post('/wallets/pay', {
            request: invoice,
            reference: `ref_${Date.now()}` // Unique reference
        });
        return response.data;
    } catch (error: any) {
        console.error("Bitnob Pay Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to pay invoice");
    }
};

// --- Off-Ramp (Standard 3-Step Flow) ---

// 1. Create generic quote
export const createQuote = async (amount: number, currency: 'NGN' | 'USD' = 'NGN') => {
    try {
        const res = await api.post('/payouts/quotes', {
            amount: amount,
            settlementCurrency: currency,
            paymentMethod: 'LIGHTNING'
        });
        return res.data.data; // Includes quoteId
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to create quote");
    }
};

// 2. Initialize with Beneficiary (Bank Details)
export const initializeQuote = async (quoteId: string, beneficiary: any) => {
    try {
        const res = await api.post(`/payouts/quotes/${quoteId}`, {
            beneficiary,
            reference: `ref_${Date.now()}_${Math.random().toString(36).substring(7)}`
        });
        return res.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to initialize quote");
    }
}

// 3. Finalize Quote (Returns Lightning Invoice)
export const finalizeQuote = async (quoteId: string) => {
    try {
        const res = await api.post(`/payouts/quotes/${quoteId}/finalize`);
        return res.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to finalize quote");
    }
}

// Composite Helper for Demo (Auto-runs all 3 steps with mock beneficiary)
export const fullOfframpFlow = async (amount: number) => {
    try {
        console.log("1. Creating Quote for", amount);
        const quote = await createQuote(amount);

        console.log("2. Initializing Quote...");
        // Mock Sandbox Beneficiary
        const mockBeneficiary = {
            firstName: "Test",
            lastName: "User",
            accountNumber: "0000000000",
            bankCode: "057", // Zenith Bank
            accountType: "savings",
            country: "NG"
        };
        await initializeQuote(quote.quoteId, mockBeneficiary);

        console.log("3. Finalizing Quote...");
        const final = await finalizeQuote(quote.quoteId);

        return final;
    } catch (e) {
        console.error("Offramp Flow Failed", e);
        throw e;
    }
}
