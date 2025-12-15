import { useState, useEffect, useRef } from "react";
import * as bip39 from "bip39";
import { encryptMnemonic } from "../utils/keystore";
import { useNavigate } from "react-router-dom";
import { useBreez } from "../context/BreezContext";
import gsap from "gsap";
import toast from "react-hot-toast";

function Home() {
  const [seedPhrase, setSeedPhrase] = useState("");
  const [password, setPassword] = useState("");
  const [generatedMnemonic, setGeneratedMnemonic] = useState<string | null>(null);
  const navigate = useNavigate();
  const { connectWallet, status } = useBreez();

  const heroRef = useRef(null);
  const formRef = useRef(null);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-text", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
      });

      gsap.from(".hero-image", {
        x: 100,
        opacity: 0,
        duration: 1.2,
        delay: 0.5,
        ease: "elastic.out(1, 0.75)"
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Auto-redirect if already connected
  useEffect(() => {
    if (status === "Connected") {
      navigate("/remittance");
    }
  }, [status, navigate]);

  const handleCreate = () => {
    if (!password) return toast.error("Please set a password first");
    const mnemonic = bip39.generateMnemonic();
    setGeneratedMnemonic(mnemonic);
  };

  const handleConfirmBackup = async () => {
    if (!generatedMnemonic) return;
    const encrypted = encryptMnemonic(generatedMnemonic, password);
    localStorage.setItem("wallet_keystore", encrypted);
    localStorage.setItem("wallet_password", password);

    const success = await connectWallet(password);
    if (success) navigate("/remittance");
  };

  const handleImport = async () => {
    if (!seedPhrase.trim()) return toast.error("Enter your seed phrase");
    if (!password) return toast.error("Set a password to encrypt your wallet");

    const encrypted = encryptMnemonic(seedPhrase.trim(), password);
    localStorage.setItem("wallet_keystore", encrypted);
    localStorage.setItem("wallet_password", password);

    const success = await connectWallet(password);
    if (success) navigate("/remittance");
  };

  return (
    <div ref={heroRef} className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row items-center justify-center p-6 gap-12 bg-[#E0E7FF]">

      {/* Hero Section */}
      <div className="flex-1 space-y-8 max-w-2xl">
        <h1 className="hero-text text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter">
          Send Money <br />
          <span className="text-[#FFDE00] text-stroke-3">Instantly</span> <br />
          To Nigeria 🇳🇬
        </h1>
        <p className="hero-text text-xl md:text-2xl font-bold border-l-4 border-black pl-6">
          The fastest way to remit money using Bitcoin Lightning.
          Zero fees, instant settlement to NGN.
        </p>

        <div className="hero-text flex gap-4">
          <div className="bg-black text-white px-6 py-3 font-bold uppercase -rotate-2 inline-block">
            Trusted by 0 users
          </div>
          <div className="bg-[#FFDE00] border-2 border-black px-6 py-3 font-bold uppercase rotate-1 inline-block">
            Powered by Breez
          </div>
        </div>
      </div>

      {/* Auth Form / Wallet Creator */}
      <div ref={formRef} className="w-full max-w-md neobrutal-box p-8 bg-white relative">
        <div className="absolute -top-4 -right-4 bg-black text-white px-4 py-1 font-bold">
          START HERE
        </div>

        <h2 className="text-3xl font-black mb-6 uppercase">Initialize Wallet</h2>

        {!generatedMnemonic ? (
          <div className="space-y-6">
            <div>
              <label className="block font-bold mb-2 uppercase text-sm">Set Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-50 neobrutal-input font-mono"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={handleCreate}
              className="w-full py-4 neobrutal-btn text-lg hover:bg-[#FFDE00]"
            >
              Create New Wallet
            </button>

            <div className="text-center font-bold opacity-50">- OR -</div>

            <div>
              <label className="block font-bold mb-2 uppercase text-sm">Import Seed</label>
              <input
                type="password"
                value={seedPhrase}
                onChange={(e) => setSeedPhrase(e.target.value)}
                className="w-full p-3 bg-gray-50 neobrutal-input font-mono mb-4"
                placeholder="12 word seed phrase..."
              />
              <button
                onClick={handleImport}
                className="w-full py-3 neobrutal-btn bg-white hover:bg-gray-100"
              >
                Import Existing
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-yellow-100 border-2 border-black p-4">
              <p className="font-bold text-red-600 mb-2 uppercase">⚠️ Save these words!</p>
              <p className="font-mono text-sm leading-relaxed">{generatedMnemonic}</p>
            </div>
            <button
              onClick={handleConfirmBackup}
              className="w-full py-4 neobrutal-btn text-lg"
            >
              I Saved It - Let's Go
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
