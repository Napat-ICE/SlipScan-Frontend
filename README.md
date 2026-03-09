# SlipScan-Frontend 🌐

Web Interface สำหรับระบบตรวจสอบสลิปโอนเงินธนาคาร **SlipScan** สร้างด้วย HTML/CSS/JavaScript และ serve ผ่าน **Nginx**

## Pages

| File | Description |
|------|-------------|
| `login.html` | หน้าเข้าสู่ระบบ |
| `register.html` | หน้าสมัครสมาชิก |
| `upload.html` | อัปโหลดและวิเคราะห์สลิป |
| `dashboard.html` | Dashboard สถิติและรายการสลิป |

## Features

- 📤 **Drag & Drop Upload** — รองรับหลายไฟล์พร้อมกัน (jpg, png, webp)
- 🔍 **Real-time Analysis** — แสดงผลการตรวจสอบทันทีหลัง upload
- 📊 **Dashboard** — กราฟแนวโน้มรายวัน/รายสัปดาห์/รายเดือน
- 🏦 **Bank Ranking** — อันดับธนาคารตามยอดโอน
- 🔎 **Advanced Search** — ค้นหาและกรองสลิปตามธนาคาร วันที่ ยอดเงิน
- 📁 **CSV Export** — Export รายการสลิปเป็น Excel-compatible CSV
- ⚠️ **Fraud Detection** — แสดงเตือนเมื่อพบสลิปปลอมหรือซ้ำ

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Charts | Chart.js |
| Web Server | Nginx (Alpine) |
| Container | Docker |

## Getting Started

### 1. Clone

```bash
git clone https://github.com/Napat-ICE/SlipScan-Frontend.git
cd SlipScan-Frontend
```

### 2. Run with Docker

```bash
docker build -t slipscan-frontend .
docker run -p 80:80 slipscan-frontend
```

เปิด `http://localhost` ในเบราว์เซอร์

### 3. Run with Docker Compose (แนะนำ)

```bash
# จาก root ของโปรเจกต์
cd ..
docker-compose up -d
```

Frontend จะรันที่ `http://localhost`

## Backend API Configuration

Frontend เชื่อมต่อ Backend API โดยอัตโนมัติตาม hostname:

| Environment | API URL |
|-------------|---------|
| `localhost` | `http://localhost:8000` |
| Production | `https://slipscan-backend.onrender.com` (ปรับในโค้ด) |

หากต้องการเปลี่ยน URL ให้แก้ค่า `API_BASE` ในไฟล์ `upload.html` และ `dashboard.html`

## Project Structure

```
SlipScan-Frontend/
├── index.html          — Redirect ไปหน้า login
├── login.html          — หน้า Login
├── register.html       — หน้าสมัครสมาชิก
├── upload.html         — หน้าอัปโหลดสลิป
├── dashboard.html      — Dashboard
└── Dockerfile          — Nginx container
```

## Related Services

- [SlipScan-Backend](https://github.com/Napat-ICE/SlipScan-Backend) — REST API
- [SlipScan-OCR](https://github.com/Napat-ICE/SlipScan-OCR) — OCR microservice
