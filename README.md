# TWIST – WiFi Portal System

**TWIST** is a WiFi captive portal system that redirects users to a payment page before granting them internet access. It enables router/station owners to monetize their WiFi by offering short- and long-term access packages, with centralized online management and multi-station support.

---

## 📌 Features

- 💳 **Prepaid Access Packages**:
  - 1-day access – UGX 1,000
  - 3-days – UGX 2,500
  - 5-days – UGX 5,000
  - 7-days – UGX 7,500
  - 2-weeks – UGX 9,000
  - 1-month – UGX 18,000

- 🛠️ **Multi-station support**: One or more owners can manage multiple routers (stations).
- 🌐 **Centralized management server**: Easily control and monitor access from anywhere.
- 🧾 **Token-based login**: Users receive tokens after payment and use them to access internet.
- 📱 **(Upcoming)** Mobile Money Integration for automated payments.
- 🧠 **Smart timeout control**: Redis-backed token expiration ensures sessions expire accurately.
- 📊 **Admin Dashboard**: View currently active tokens, monitor usage, and manage connected stations in real time.

---

## ⚙️ Tech Stack

| Layer         | Technology        |
|---------------|-------------------|
| Frontend      | React             |
| Backend       | NestJS            |
| Database      | MongoDB           |
| Session Mgmt  | Redis             |
| Mobile App    | Flutter (Radius App) |
| Hardware      | TP-Link EAP (Access Point) |

---

## 🚀 Installation & Setup

### 🧰 Hardware Setup

1. **Connect TP-Link EAP** to your router via LAN.
2. Ensure the **EAP is in Standalone/Access Point mode**.
3. Set the **EAP’s IP address** to: `192.168.1.2`

### 📱 Mobile App Setup

1. Install the **Radius mobile app** on a smartphone.
2. Assign the phone a **static IP** of: `192.168.1.3`
3. Ensure both EAP and phone are on the same local network.

---

## 🧑‍💻 Usage Flow

1. A user connects to the open WiFi network.
2. They're automatically redirected to the **TWIST login page**.
3. User enters a valid **token** purchased for internet access.
4. If valid, access is granted for the duration of the chosen package.
5. Once time expires, they must renew to regain access.

---

## 📊 Admin Dashboard

The admin dashboard provides real-time visibility into:

- Currently active tokens
- Associated MAC/IP addresses
- Station ownership and device metadata
- Session expiration times

This interface is essential for station managers to monitor usage and troubleshoot user issues.

---

## 💡 Contributing

We welcome ideas and suggestions to make TWIST better suited to real-world needs!

- Suggest feature improvements
- Report issues or bugs
- Help with UI/UX feedback
- Collaborate on integration of payment systems (e.g. Mobile Money)

> Contributions don’t have to be code — even ideas matter.

---

## 🪪 License

This project currently has **no license**, meaning all rights are reserved to the original author(s). Please do not reuse or redistribute without explicit permission.

---

## 📞 Contact

For feedback or contribution inquiries, reach out to the project maintainer or open an issue on the repository.

---

## ✅ TODOs (Future Enhancements)

- [ ] Full integration of Mobile Money (MTN, Airtel)
- [ ] SMS or push notifications on token expiry
- [ ] Detailed earnings reports for station owners
- [ ] Multi-language support for the login portal
