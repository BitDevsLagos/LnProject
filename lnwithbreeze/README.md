# ⚡ BitNGN - Lightning Remittance

**BitNGN** is a **Neo-Brutalist** web application that enables instant, low-cost cross-border remittances to Nigeria using the **Bitcoin Lightning Network**. 

It uses **Breez SDK Spark** for non-custodial Lightning wallet functionality and integrates **Bitnob (MavaPay)** API to seamlessly off-ramp Bitcoin (Sats) into Nigerian Naira (NGN) bank accounts.

---

## 🚀 Features

-   **🇳🇬 Instant Remittance**: Send NGN directly to Nigerian bank accounts. The app negotiates a quote, converts Sats to NGN, and settles via Lightning in seconds.
-   **⚡ Non-Custodial Wallet**: Built on **Breez SDK Spark**, giving users full control of their keys (BIP39 Mnemonic).
-   **🏦 Bank Off-Ramp**: Integrated with Bitnob's Payout API to support direct bank transfers (Zenith, GTBank, etc.).
-   **🛍️ Merchant POS**: A dedicated "Merchant Mode" to simulate receiving funds (On-Ramp).
-   **🎨 Neo-Brutalism UI**: distinct, high-contrast design language for a bold user experience.

---

## 🛠️ Tech Stack

-   **Frontend**: React + TypeScript + Vite
-   **Styling**: Tailwind CSS (Custom Neo-Brutalism Theme)
-   **Lightning Network**: `@breeztech/breez-sdk-spark` (WASM)
-   **Off-Ramp API**: Bitnob (MavaPay) Sandbox
-   **State Management**: React `Context/useContext`
-   **Animations**: GSAP
-   **Notifications**: React Hot Toast

---

## 📦 Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/bitngn.git
    cd bitngn/lnwithbreeze
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```
    *Note: This project uses `wasm` components. Ensure your environment supports them.*

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    VITE_BREEZE_API_KEY=your_breez_api_key
    VITE_BITNOB_API_KEY=your_bitnob_sandbox_key
    ```
    *Get a Breez API Key from [Breez Technology](https://breez.technology) and a Bitnob Key from [Bitnob Sandbox](https://sandbox.bitnob.com).*

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` to view the app.

---

## 📱 How to Use

### 1. Initialize Wallet
-   On the **Home** (Splash) screen, create a new wallet or import an existing 12-word seed phrase.
-   Set a **Password** to encrypt your keys in local storage.

### 2. Send Money (Remittance)
-   Navigate to the **Send Money** tab.
-   Enter **Account Number** and **Bank Code** (e.g., `057` for Zenith Bank).
-   Enter the amount in **NGN** (e.g., 5000).
-   The app calculates the **Sats** required based on the real-time rate.
-   Click **"Pay & Remit"** to execute the off-ramp.

### 3. Merchant Mode & Wallet
-   Use the **Merchant** tab to generate invoices to receive funds.
-   Use the **Wallet** tab to view balance, manage keys, or reset your session.

---

## ⚠️ Important Notes

> [!WARNING]
> **Network Compatibility**: This demo uses **Bitnob Sandbox** (Bitcoin Testnet) and **Breez SDK** (Regtest/Mainnet). 
> - Due to SDK limitations, direct Lightning payments from the Local Regtest Wallet to the Public Testnet Invoice will fail with a Network Error. 
> - **This is expected behavior** in this simulation environment. The integration logic (Quote -> Invoice Generation) is fully functional.

> [!NOTE]
> **Security**: This is a frontend-only demo. In production, API Keys should be proxied through a backend server to prevent exposure.

---
**Built with 💛 for the Bitcoin Africa Hackathon.**
