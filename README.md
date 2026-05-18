# JobConnect4Student

Hệ thống tuyển dụng thông minh dành cho sinh viên, tích hợp AI lọc CV tự động.

## Yêu cầu cài đặt

- Node.js >= 18
- Python 3.10
- MongoDB Atlas account (hoặc MongoDB local)

## Cấu trúc project

```
JobConect4Student/
├── Client/          # React frontend (port 3000)
├── Server/          # NestJS backend (port 5000)
└── DetectCVLasted/  # Python AI service (port 8000) — repo riêng
```

---

## Cách chạy

### 1. Clone và cài dependencies

```bash
git clone <repo-url>
cd JobConect4Student

# Cài Server
cd Server
npm install

# Cài Client
cd ../Client
npm install
```

### 2. Tạo file .env cho Server

```bash
cd Server
cp .env.example .env
```

Mở file `.env` và điền:
- `MONGODB_URI` — connection string MongoDB Atlas của bạn
- `JWT_SECRET` — chuỗi bất kỳ (ví dụ: `mysecretkey123`)
- `PORT` — giữ nguyên `5000`
- `AI_SERVICE_URL` — giữ nguyên `http://localhost:8000`

### 3. Chạy Python AI service (tùy chọn)

> Nếu không chạy Python, hệ thống vẫn hoạt động bình thường với luồng fallback.

```bash
cd DetectCVLasted   # clone repo Python riêng
pip install -r requirements.txt
python main.py
```

### 4. Chạy Server và Client

Mở **2 terminal**:

**Terminal 1 — Backend:**
```bash
cd Server
npm run start
```

**Terminal 2 — Frontend:**
```bash
cd Client
npm start
```

Truy cập: `http://localhost:3000`

---

## Seed dữ liệu mẫu (tùy chọn)

```bash
cd Server
node seed-skills-node.js      # Seed danh sách skills
node seed-mock-data.js        # Seed jobs và users mẫu
```

---

## Luồng sử dụng chính

### Sinh viên ứng tuyển
1. Đăng ký tài khoản **sinh viên**
2. Vào trang chi tiết job → click **Ứng tuyển ngay**
3. Upload CV (PDF/PNG/JPG) → AI chấm điểm
4. Nếu điểm < 60%: điền form bổ sung → chấm lại → nộp
5. Nếu điểm ≥ 60%: tự động nộp thành công

### Nhà tuyển dụng
1. Đăng ký tài khoản **nhà tuyển dụng**
2. Vào **Quản lý tin đăng** → **Đăng tin mới**
3. Điền thông tin job → chọn skills yêu cầu → lưu
4. Click ⋮ → **Đăng tuyển** để job hiển thị cho sinh viên
5. Vào **Quản lý ứng viên** để xem danh sách CV

---

## Biến môi trường

| Biến | Mô tả | Bắt buộc |
|------|-------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key cho JWT | ✅ |
| `PORT` | Port NestJS (mặc định 5000) | ❌ |
| `AI_SERVICE_URL` | URL Python AI (mặc định http://localhost:8000) | ❌ |
