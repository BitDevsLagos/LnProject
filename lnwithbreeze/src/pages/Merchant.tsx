import { useState } from 'react';
import { useBreez } from '../context/BreezContext';
import { convertNGNtoSats, formatNGN } from '../utils/currency';

function Merchant() {
    const { sdk } = useBreez();
    const [amountNGN, setAmountNGN] = useState('');
    const [invoice, setInvoice] = useState('');
    const [status, setStatus] = useState('');

    const handleGenerate = async () => {
        if (!sdk) return;
        if (!amountNGN) return;

        try {
            setStatus("Generating Invoice...");
            const sats = convertNGNtoSats(Number(amountNGN));

            const response = await sdk.receivePayment({
                paymentMethod: {
                    type: "bolt11Invoice",
                    description: `Remittance: ${formatNGN(Number(amountNGN))}`,
                    amountSats: sats,
                },
            });
            setInvoice(response.paymentRequest);
            setStatus("Invoice Ready. Waiting for payment...");

            // In a real app, we would listen for the payment using a subscription
        } catch (e: any) {
            setStatus(`Error: ${e.message}`);
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="neobrutal-box p-8 bg-white mb-20">
                <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
                    <h2 className="text-3xl font-black uppercase">Merchant POS</h2>
                    <span className="bg-black text-white px-3 py-1 font-bold">PROVIDER MODE</span>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block font-bold mb-2">Amount to Receive (NGN)</label>
                        <input
                            type="number"
                            value={amountNGN}
                            onChange={e => setAmountNGN(e.target.value)}
                            className="w-full p-4 neobrutal-input bg-gray-50 text-2xl font-black"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="bg-gray-100 p-4 border-l-4 border-black">
                        <p className="font-bold">Equivalent in Sats: {amountNGN ? convertNGNtoSats(Number(amountNGN)).toLocaleString() : 0}</p>
                    </div>

                    <button
                        onClick={handleGenerate}
                        className="w-full py-4 neobrutal-btn text-xl"
                    >
                        Generate Invoice
                    </button>
                </div>

                {invoice && (
                    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="font-black text-xl mb-2">Scan or Copy to Pay</h3>
                        <div className="bg-white p-4 border-2 border-black overflow-hidden relative group">
                            <textarea
                                readOnly
                                className="w-full font-mono text-xs h-24 resize-none outline-none"
                                value={invoice}
                            />
                            <button
                                className="absolute bottom-2 right-2 bg-black text-white px-3 py-1 text-xs font-bold uppercase"
                                onClick={() => navigator.clipboard.writeText(invoice)}
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                )}

                {status && (
                    <p className="mt-4 font-bold text-center uppercase tracking-wide">{status}</p>
                )}

            </div>
        </div>
    );
}

export default Merchant;
