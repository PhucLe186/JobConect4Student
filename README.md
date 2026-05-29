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
└── tool_GetPointCV/  # Python AI service (port 8000) — repo riêng
```

---

## Cấu hình Địa chỉ IP kết nối (Tùy chọn)

Nếu bạn muốn truy cập ứng dụng từ **thiết bị khác trong cùng mạng nội bộ** (ví dụ: qua Radmin VPN, WiFi chung, hoặc từ điện thoại), hãy thực hiện 2 bước sau:

### Bước 1: Cập nhật IP của Server API trong Client

- Bạn **không** cần tạo file `.env` ở thư mục Client.
- Hãy mở file [config.js](file:///c:/JobConect4Student/Client/src/config.js) và cập nhật giá trị của `API_BASE_URL` thành IP máy chạy Server:
  ```javascript
  // Nếu chạy trên máy cục bộ (mặc định):
  export const API_BASE_URL = 'http://localhost:5000/';

  // Nếu truy cập từ thiết bị khác qua mạng nội bộ / Radmin VPN:
  export const API_BASE_URL = 'http://<IP-MÁY-CHỦ>:5000/';
  // Ví dụ: export const API_BASE_URL = 'http://192.168.1.100:5000/';
  ```

### Bước 2: Chạy Client ở chế độ Network

Thay vì dùng `npm start` (chỉ cho phép truy cập từ `localhost`), hãy chạy:

```bash
cd Client
npm run start:network
```

> Lệnh này sẽ khởi động Client với `HOST=0.0.0.0`, cho phép các thiết bị khác trong mạng truy cập qua địa chỉ IP của máy bạn (ví dụ: `http://192.168.1.100:3000`).

**Tóm tắt:**

| Trường hợp | `API_BASE_URL` trong config.js | Lệnh chạy Client |
|---|---|---|
| Chạy trên máy cục bộ | `http://localhost:5000/` | `npm start` |
| Truy cập từ thiết bị khác trong mạng | `http://<IP-MÁY-CHỦ>:5000/` | `npm run start:network` |

---

## Cách chạy

### 1. Clone và cài dependencies

```bash
git clone -b Final https://github.com/PhucLe186/JobConect4Student.git
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
# Clone repo Python riêng
git clone -b PhongAI https://github.com/RosianLoc/tool_GetPointCV.git
cd tool_GetPointCV
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
4. Nếu điểm < 90%: điền form bổ sung → chấm lại → nộp
5. Nếu điểm ≥ 90%: tự động nộp thành công

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

---

## Tài khoản demo phục vụ chạy thử (Tùy chọn)

Sau khi chạy các tập lệnh seed dữ liệu mẫu thành công, bạn có thể sử dụng các tài khoản có sẵn dưới đây để đăng nhập nhanh mà không cần tạo mới:

### 1. Tài khoản Nhà tuyển dụng (Employer)
*   **Từ script `seed-page1-real-companies.js`:**
    *   **Email:** `google.vietnam@company.jobconnect4students.local`
    *   **Mật khẩu:** `Employer@2026!`
*   **Từ script `seed-mock-data.js`:**
    *   **Email:** `google-vietnam-tech-center@seed.jobconnect4students.local` (hoặc `grab-vietnam-digital-hub@seed.jobconnect4students.local`)
    *   **Mật khẩu:** `SeedEmployer@123`

### 2. Tài khoản Sinh viên (Student)
*   Để thử nghiệm đầy đủ quy trình tải CV lên và nhận điểm từ AI, bạn nên đăng ký trực tiếp một tài khoản sinh viên mới trên giao diện (trong mục đăng ký) và điền thông tin thực tế của mình.
