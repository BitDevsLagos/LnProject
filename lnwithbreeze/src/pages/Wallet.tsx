import { useState } from "react";
import { useBreez } from "../context/BreezContext";
import toast from "react-hot-toast";

function Wallet() {
  const { sdk, balance, status, refreshBalance } = useBreez();
  const [invoiceDesc, setInvoiceDesc] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceResult, setInvoiceResult] = useState("");
  const [payInvoice, setPayInvoice] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [sendResult, setSendResult] = useState("");

  const deleteAccount = () => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-2 border-black`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-gray-900">
                Are you sure you want to delete your wallet?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                This action cannot be undone. You will lose your private keys if not backed up.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => {
              localStorage.removeItem("wallet_keystore");
              localStorage.removeItem("wallet_password");
              toast.dismiss(t.id);
              window.location.href = "/";
            }}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-bold text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleReceive = async () => {
    if (!sdk) return;
    try {
      setInvoiceResult("Generating invoice...");
      const response = await sdk.receivePayment({
        paymentMethod: {
          type: "bolt11Invoice",
          description: invoiceDesc || "Test payment",
          amountSats: Number(invoiceAmount),
        },
      });
      setInvoiceResult(response.paymentRequest);
    } catch (err: any) {
      console.error(err);
      setInvoiceResult("Error generating invoice.");
    }
  };

  const handleSend = async () => {
    if (!sdk) return;
    try {
      setSendResult("Preparing payment...");
      const prepareResponse = await sdk.prepareSendPayment({
        paymentRequest: payInvoice,
        amount: payAmount ? BigInt(payAmount) : undefined,
      });

      const options = {
        type: "bolt11Invoice",
        preferSpark: false,
        completionTimeoutSecs: 10,
      };
      const sendResponse = await sdk.sendPayment({ prepareResponse, options });
      setSendResult(`Payment sent! ID: ${sendResponse.payment.id}`);
      refreshBalance();
    } catch (err: any) {
      console.error(err);
      setSendResult("Error sending payment.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* Wallet Info */}
      <div className="md:col-span-2">
        <div className="neobrutal-box bg-white p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase mb-2">My Wallet</h1>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${status === 'Connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="font-mono">{status}</span>
            </div>
          </div>

          <div className="text-right">
            <p className="font-bold text-gray-500 uppercase text-sm">Balance</p>
            <div className="text-5xl font-black">
              {balance?.toLocaleString()} <span className="text-2xl text-gray-400">sats</span>
            </div>
            <button
              onClick={() => refreshBalance()}
              className="mt-2 text-sm font-bold underline hover:text-[#FFDE00]"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Receive */}
      <div className="neobrutal-box bg-white p-8">
        <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2">Receive</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Description"
            value={invoiceDesc}
            onChange={(e) => setInvoiceDesc(e.target.value)}
            className="w-full p-3 neobrutal-input bg-gray-50"
          />
          <input
            type="number"
            placeholder="Amount (sats)"
            value={invoiceAmount}
            onChange={(e) => setInvoiceAmount(e.target.value)}
            className="w-full p-3 neobrutal-input bg-gray-50"
          />
          <button
            onClick={handleReceive}
            className="w-full py-3 neobrutal-btn text-lg"
          >
            Generate Invoice
          </button>

          {invoiceResult && (
            <div className="mt-4 p-4 border-2 border-dashed border-black bg-gray-50 break-words font-mono text-xs">
              {invoiceResult}
              <button
                className="block mt-2 font-bold underline text-blue-600"
                onClick={() => navigator.clipboard.writeText(invoiceResult)}
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Send */}
      <div className="neobrutal-box bg-white p-8">
        <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2">Send</h2>
        <div className="space-y-4">
          <textarea
            placeholder="Paste Invoice (lnbc...)"
            value={payInvoice}
            onChange={(e) => setPayInvoice(e.target.value)}
            className="w-full p-3 neobrutal-input bg-gray-50 h-32 font-mono text-xs resize-none"
          />
          <input
            type="number"
            placeholder="Custom Amount (optional)"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            className="w-full p-3 neobrutal-input bg-gray-50"
          />
          <button
            onClick={handleSend}
            className="w-full py-3 neobrutal-btn bg-[#FF9F00] text-lg"
          >
            Pay Invoice
          </button>

          {sendResult && (
            <div className="mt-4 p-4 bg-gray-100 border-2 border-black font-bold text-sm">
              {sendResult}
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <button
          onClick={deleteAccount}
          className="w-full py-4 bg-red-500 border-2 border-black font-black uppercase text-white hover:bg-red-600 transition-colors"
        >
          Delete Wallet / Reset Info
        </button>
      </div>

    </div>
  );
}

export default Wallet;
