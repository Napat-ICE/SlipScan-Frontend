# SlipScan-Frontend 🎨

Web interface สำหรับระบบตรวจสอบสลิปโอนเงินธนาคารไทย (SlipScan) สร้างด้วย **React + Vite + Tailwind CSS**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| HTTP Client | Axios |

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/Napat-ICE/SlipScan-Frontend.git
cd SlipScan-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment (ถ้าจะรันแยก)

```bash
cp .env.example .env
```

แก้ไข `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

### 4. Run Development Server

```bash
npm run dev
```

เปิด browser ที่ `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

## Docker (แนะนำสำหรับ Production)

```bash
# Build image
docker build -t slipscan-frontend .

# Run container
docker run -p 80:80 slipscan-frontend
```

หรือใช้ docker-compose รวมกับ backend:
```bash
cd ../SlipScan-Backend

# ⚠️ สำคัญ! Build images ใหม่ทุกครั้งที่ pull โค้ดใหม่
docker-compose build --no-cache frontend

# แล้วค่อยรัน
docker-compose up
```

## Project Structure

```
SlipScan-Frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx    — หน้าแดชบอร์ด + รายการล่าสุด
│   │   ├── Slips.jsx        — หน้ารายการสลิปทั้งหมด
│   │   └── Upload.jsx       — หน้าอัปโหลดสลิป
│   ├── components/          — Reusable components
│   ├── services/
│   │   └── api.js           — Axios config
│   ├── contexts/
│   │   └── ThemeContext.jsx — Dark/Light mode
│   └── App.jsx
├── public/
├── index.html
├── nginx.conf              — Nginx config (Docker)
├── Dockerfile
└── vite.config.js
```

## Related Services

- [SlipScan-Backend](https://github.com/Napat-ICE/SlipScan-Backend) — REST API
- [SlipScan-OCR](https://github.com/Napat-ICE/SlipScan-OCR) — OCR microservice

## สิ่งที่ต้องรู้ก่อนใช้งาน

1. **ต้องรัน Backend ก่อน** — Frontend นี้ต้องการ API จาก SlipScan-Backend
2. **Environment** — ถ้ารันแยกต้องตั้ง `VITE_API_URL` ให้ชี้ไปที่ Backend
3. **Nginx Config** — มี rate limiting + security headers สำหรับ production

