# ⚡ LnProject

**LnProject** is a multi-language learning initiative focused on introducing developers to the **Bitcoin Lightning Network** by building a real-world inspired remittance app — modeled after **Tando**, a service that enables users to spend Bitcoin in Kenya through a fiat offramp.

This project helps developers understand how to:
- Send/receive Lightning payments
- Integrate with Lightning nodes (LND, Core Lightning, etc.)
- Build an on-ramp/off-ramp bridge for real-world payments
- Develop wallet-to-merchant settlement workflows
- Apply Lightning in remittance use cases

---

## 🎯 Project Goal

The core goal of this project is to help developers **learn Lightning by building** a mock cross-border remittance app where:

1. A **user** sends Lightning BTC to a mock **offramp provider**.
2. The provider then **settles the fiat equivalent** (e.g. KES, NGN, ZAR) to the **merchant/receiver**.
3. All components are simulated or modular to keep the focus on learning Lightning and building integrations.

Each branch supports a different language (e.g. Python, Rust, Go) to allow contributions from a broad community.

---

## 🧠 What You’ll Learn

- How the **Lightning Network** works (channels, invoices, HTLCs)
- How to interact with Lightning node APIs (LND, Core Lightning, etc.)
- How to **send/receive LN payments programmatically**
- How to create Lightning wallets, invoices, and pay them
- Optional: Building front-end interfaces for users and merchants

---

## 🗂️ Branch Structure

| Branch        | Language     | Status        | Maintainers        |
|---------------|--------------|---------------|--------------------|
| `main`        | Meta/Docs    | ✅ Active      | Core team          |
| `python`      | Python       | 🛠 In Progress | @alice, @bob       |
| `go`          | Go           | 🧪 Experimental| @carol             |
| `javascript`  | JavaScript   | 🛠 In Progress | Open for volunteers|
| `rust`        | Rust         | 🧪 Early Stage | TBD                |

> Want to start a new language branch? [Open an issue](https://github.com/BitDevsLagos/LnProject/issues) or fork and submit a PR to propose your language of choice.

---

## ⚙️ Project Architecture (Overview)

```txt
User Wallet (LN) 
   │
   ▼
[LnProject Frontend]
   │
   ▼
[Ln Node API (e.g., LND gRPC/REST)]
   │
   ▼
[Mock Offramp Logic]
   │
   ▼
[Fiat Settlement Simulation (e.g., pay to Bank / M-Pesa)]


## 🔧 Core Features to Build

Each language implementation should aim to support the following:

⚡ Lightning Functionality
 Create a new LN wallet (connect to LND or Core Lightning node)

 Generate invoices (BOLT11)

 Pay invoices

 Monitor payment status and incoming transactions

 Lightning address (optional)

🏦 Offramp Simulation
 Receive LN payment

 Simulate fiat payout to merchant (e.g. log a KES payout)

 Webhook or callback-based merchant notifications

 Optional: Simulated KYC/user records

📱 Frontend/UI (Optional)
 Simple user interface for sending BTC via LN

 Merchant interface to track incoming payouts

 QR code invoice display and scanning

🌍 Remittance Logic
 Choose recipient country and currency

 Estimate fiat equivalent for payout

 Build mock settlement provider interface (admin console or CLI)


##🔌 Integrating a Lightning Node
We recommend using LND (Lightning Network Daemon) for development.
Other node options: Core Lightning (c-lightning), Eclair

Use regtest or testnet for development

Get testnet BTC from a faucet: https://testnet-faucet.mempool.co/


## 🤝 Contributing
We welcome contributors in all languages! Here's how to get started:

Check out an existing language branch (e.g. python, rust, go)

Or propose a new one (e.g. csharp, kotlin, swift)

Follow the contribution guidelines in that branch

Submit PRs to the appropriate branch only

Each language branch should include:

README.md with setup instructions

Tests (unit/integration)

CLI or UI interface (optional)

📢 We encourage reusable architecture across implementations, but each branch is free to adapt based on the language's strengths and idioms.

## 🛡️ Security Notes
This project is intended for educational and experimental purposes. Do not use it for real funds unless you thoroughly audit the code and understand Bitcoin security principles.


## 🔗 Connect with Us

Twitter: @BitDevsLagos

