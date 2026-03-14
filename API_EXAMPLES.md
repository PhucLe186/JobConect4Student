# API Upload Avatar - Examples

## 1. Upload Avatar Success Response
```json
{
  "message": "Avatar updated successfully",
  "avatarUrl": "http://localhost:5000/uploads/avatars/avatar-1703123456789-123456789.jpg"
}
```

## 2. Get Student Profile Response
```json
{
  "name": "Nguyễn Văn A",
  "email": "student@example.com",
  "dateOfbirth": "2000-01-01T00:00:00.000Z",
  "gender": "Male",
  "phone": "0123456789",
  "address": "Hà Nội",
  "avatar": "http://localhost:5000/uploads/avatars/avatar-1703123456789-123456789.jpg",
  "school": "Đại học Công nghệ",
  "major": "Khoa học Máy tính",
  "gpa": "3.5",
  "graduation_year": "2024",
  "career_goal": "Trở thành Full-stack Developer",
  "desired_salary": "15000000"
}
```

## 3. Error Responses

### File too large
```json
{
  "statusCode": 400,
  "message": "File too large"
}
```

### Invalid file type
```json
{
  "statusCode": 400,
  "message": "Chỉ cho phép file jpg, jpeg, png"
}
```

### Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## 4. Frontend Usage Example

```javascript
// Upload avatar
const handleAvatarChange = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  try {
    const response = await api.post('student/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Update state with new avatar URL
    setProfileData(prev => ({
      ...prev,
      avatar: response.data.avatarUrl
    }));
    
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

// Load profile data (including avatar)
const fetchProfile = async () => {
  try {
    const response = await api.get('student');
    setProfileData(response.data);
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
};
```