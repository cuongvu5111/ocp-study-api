# 🚀 Hướng dẫn Deploy lên Railway

## Bước 1: Tạo tài khoản Railway

1. Truy cập [railway.app](https://railway.app)
2. Đăng ký bằng GitHub (khuyến nghị) hoặc email
3. Xác thực email

## Bước 2: Tạo Project mới

1. Click **"New Project"**
2. Chọn **"Deploy from GitHub repo"**
3. Authorize Railway với GitHub
4. Chọn repo `ocp` (hoặc tên repo của bạn)

## Bước 3: Setup PostgreSQL Database

1. Trong project, click **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway tự động tạo database và cấp credentials
3. Note: Các biến `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` sẽ tự động có trong environment

## Bước 4: Deploy Backend

1. Click **"+ New"** → **"GitHub Repo"**
2. Chọn repo và chọn **"backend"** subdirectory
3. Railway sẽ detect Dockerfile và build

### Cấu hình Environment Variables cho Backend:

```
JWT_SECRET=your-secret-key-min-256-bits-long-for-security
CORS_ORIGINS=https://your-frontend.railway.app
EMAIL_ENABLED=false
```

> ⚠️ **Quan trọng**: Tạo JWT_SECRET mới, không dùng default!

## Bước 5: Deploy Frontend

1. Click **"+ New"** → **"GitHub Repo"**
2. Chọn repo và chọn **"frontend"** subdirectory

### Cấu hình Environment Variables cho Frontend:

```
BACKEND_URL=https://your-backend.railway.app
```

## Bước 6: Kết nối Services

1. Vào Backend service → Settings → Networking
2. Copy Public URL (ví dụ: `ocp-backend-production.up.railway.app`)
3. Vào Frontend service → Variables
4. Set `BACKEND_URL` = URL của backend

## Bước 7: Generate Domain

1. Vào mỗi service → Settings → Networking
2. Click **"Generate Domain"** để có public URL
3. Hoặc add custom domain nếu có

---

## 🔧 Troubleshooting

### Build failed
- Check logs trong Railway dashboard
- Đảm bảo Dockerfile đúng path

### Backend không connect được DB
- Check variables `PGHOST`, `PGPORT`, etc. có được inject chưa
- Railway PostgreSQL tự cấp các biến này

### CORS errors
- Update `CORS_ORIGINS` trong backend với URL chính xác của frontend

### Health check failed
- Backend cần khởi động trong 5 phút
- Check logs để xem lỗi

---

## 💰 Chi phí (Free Tier)

- **$5 credit miễn phí/tháng**
- Sleep sau 15 phút không hoạt động (startup lại ~30s)
- Upgrade $5/tháng nếu cần always-on

---

## 🔗 Useful Links

- [Railway Dashboard](https://railway.app/dashboard)
- [Railway Docs](https://docs.railway.app)
- [Railway Status](https://status.railway.app)
