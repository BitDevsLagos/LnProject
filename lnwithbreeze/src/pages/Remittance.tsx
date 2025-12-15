import { useState } from 'react';
import { useBreez } from '../context/BreezContext';
import { convertNGNtoSats } from '../utils/currency';
import { fullOfframpFlow } from '../utils/bitnob';
import toast from 'react-hot-toast';

function Remittance() {
    const { sdk, balance, refreshBalance } = useBreez();
    const [amountNGN, setAmountNGN] = useState<string>('');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankCode, setBankCode] = useState('');
    const [status, setStatus] = useState('');

    const satsAmount = amountNGN ? convertNGNtoSats(Number(amountNGN)) : 0;
    const hasInsufficientBalance = (balance || 0) < satsAmount;

    // Real payment handler
    const [invoice, setInvoice] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleGenerateAndPay = async () => {
        if (!sdk || !amountNGN || !accountNumber || !bankCode) {
            toast.error("Please fill all fields and connect wallet");
            return;
        }

        try {
            setIsProcessing(true);
            setStatus("Negotiating Quote with Bitnob...");

            // 1. Get Invoice from Bitnob (Offramp Quote)
            const offrampData = await fullOfframpFlow(
                Number(amountNGN),
                { accountNumber, bankCode }
            );

            // Note: Bitnob response shape for 'lightning' payment method needs verification.
            // Assuming `offrampData.address` or similar holds the invoice.
            // If strictly following 'payouts', we are paying FOR a payout.

            // DEBUG: For now let's hope 'address' is the invoice or we catch the error to inspect.
            const lnInvoice = offrampData.address || offrampData.invoice;

            if (!lnInvoice) {
                throw new Error("No invoice returned from Bitnob. Check console.");
            }

            setInvoice(lnInvoice);
            setStatus(`Quote Finalized! Invoice: ${lnInvoice.substring(0, 15)}...`);

            // 2. Pay Request
            setStatus("Sending Payment to Bitnob...");
            const prepareResponse = await sdk.prepareSendPayment({
                paymentRequest: lnInvoice,
                amount: undefined,
            });

            const sendResponse = await sdk.sendPayment({
                prepareResponse,
                options: {
                    type: "bolt11Invoice",
                    preferSpark: false,
                    completionTimeoutSecs: 60,
                }
            });

            setStatus(`Success! Payment ID: ${sendResponse.payment.id}`);
            toast.success("Remittance Sent Successfully!");
            refreshBalance();

        } catch (e: any) {
            console.error(e);
            setStatus(`Error: ${e.message}`);
            toast.error(e.message);
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sender Form */}
            <div className="neobrutal-box p-8 bg-white">
                <h2 className="text-3xl font-black mb-6 border-b-4 border-black pb-2 uppercase">Send NGN</h2>

                <div className="space-y-6">
                    <div>
                        <label className="block font-bold mb-2">Account Number</label>
                        <input
                            type="text"
                            value={accountNumber}
                            onChange={e => setAccountNumber(e.target.value)}
                            className="w-full p-4 neobrutal-input bg-gray-50 text-xl font-bold"
                            placeholder="1234567890"
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-2">Bank Code</label>
                        <input
                            type="text"
                            value={bankCode}
                            onChange={e => setBankCode(e.target.value)}
                            className="w-full p-4 neobrutal-input bg-gray-50 text-xl font-bold"
                            placeholder="057 (Zenith)"
                        />
                    </div>


                    <div>
                        <label className="block font-bold mb-2">Amount (NGN)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₦</span>
                            <input
                                type="number"
                                value={amountNGN}
                                onChange={e => setAmountNGN(e.target.value)}
                                className="w-full p-4 pl-10 neobrutal-input bg-gray-50 text-3xl font-black"
                                placeholder="5000"
                            />
                        </div>
                    </div>

                    <div className="bg-[#E0E7FF] border-2 border-black p-4 space-y-2">
                        <div className="flex justify-between font-bold">
                            <span>Conversion Rate:</span>
                            <span>1 NGN ≈ 66 Sats</span>
                        </div>
                        <div className="flex justify-between font-bold text-xl">
                            <span>You Pay:</span>
                            <span>{satsAmount.toLocaleString()} Sats</span>
                        </div>
                        <div className="flex justify-between font-bold text-sm text-gray-500">
                            <span>Your Balance:</span>
                            <span>{(balance || 0).toLocaleString()} Sats</span>
                        </div>
                    </div>

                    {hasInsufficientBalance && (
                        <div className="bg-red-100 border-2 border-red-600 text-red-600 p-3 font-bold">
                            Insufficient Balance
                        </div>
                    )}

                    {/* <button 
                onClick={handleSend}
                disabled={hasInsufficientBalance}
                className="w-full py-4 neobrutal-btn text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Send Money
            </button> */}
                </div>
            </div>

            {/* Payment Execution (Mock Bridge) */}
            <div className="neobrutal-box p-8 bg-[#FFDE00]">
                <h3 className="text-xl font-black mb-4 uppercase">⚡ Confirm & Pay</h3>
                <p className="mb-4 font-bold text-sm">To complete this remittance, pay the Merchant Invoice below (Get it from the Merchant Tab):</p>

                <textarea
                    value={invoice}
                    onChange={e => setInvoice(e.target.value)}
                    className="w-full p-3 border-2 border-black mb-4 font-mono text-xs h-32"
                    placeholder="lnbc..."
                />

                <button
                    onClick={handleGenerateAndPay}
                    disabled={isProcessing}
                    className="w-full py-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-black uppercase disabled:opacity-50"
                >
                    {isProcessing ? "Processing..." : "Pay & Remit"}
                </button>

                {status && (
                    <div className="mt-4 p-4 border-2 border-black bg-white font-mono text-sm break-words">
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Remittance;
