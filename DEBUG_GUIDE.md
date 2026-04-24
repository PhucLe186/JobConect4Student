# Hướng dẫn debug upload avatar

## Bước 1: Kiểm tra server console
1. Khởi động server: `cd Server && npm start`
2. Mở browser console và network tab
3. Upload một ảnh
4. Kiểm tra server console xem có log:
   - `Updating avatar for user: [userId]`
   - `Avatar URL: [url]`
   - `Updated student: [object]`

## Bước 2: Kiểm tra database
1. Mở MongoDB Compass, Atlas hoặc MongoDB shell
2. Kết nối bằng giá trị `MONGODB_URI` trong `Server/.env`
3. Kiểm tra collection `student`:
   ```javascript
   db.student.find({}).pretty()
   ```
4. Tìm record có `user_id` của bạn và xem field `avatar`

## Bước 3: Kiểm tra API response
1. Sau khi upload, F5 trang
2. Mở Network tab trong browser
3. Tìm request `GET /student`
4. Xem response có chứa `avatar` URL không

## Bước 4: Kiểm tra frontend console
1. Mở browser console
2. F5 trang
3. Xem các log:
   - `Fetching profile for user: [user]`
   - `Profile Response data: [data]`
   - `Avatar URL: [url]`

## Bước 5: Kiểm tra file system
1. Vào thư mục `Server/uploads/avatars/`
2. Xem có file ảnh được tạo không
3. Thử truy cập trực tiếp `http://localhost:5000/uploads/avatars/[filename]`

## Các lỗi thường gặp

### 1. User ID không đúng
- Kiểm tra JWT token có đúng không
- Xem `user_id` trong database có khớp không

### 2. Student record không tồn tại
- Có thể cần tạo student record trước
- Kiểm tra `upsert: true` có hoạt động không

### 3. File không được lưu
- Kiểm tra quyền ghi vào thư mục uploads
- Xem có lỗi trong multer không

### 4. API không trả về avatar
- Kiểm tra query database có đúng không
- Xem response đã có field `avatar` chưa

## Test nhanh
```javascript
fetch('http://localhost:5000/student', {
  credentials: 'include'
})
  .then((res) => res.json())
  .then((data) => console.log('Avatar:', data.avatar));
```
