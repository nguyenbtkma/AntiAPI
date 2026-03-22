# AntiAPI

AntiAPI là một hệ thống xây dựng theo hướng **API Security / API Pentest**, tập trung vào 2 mục tiêu chính:

1) **Kiểm thử (testing) lỗ hổng SQL Injection (SQLi) cho API**  
   - Tổ chức dữ liệu theo **Project → Topic → API**  
   - Hỗ trợ thực hiện “scan”/test API với payload nhằm phát hiện dấu hiệu SQLi
   - Lưu trữ cấu hình, endpoint, format API, payload, kết quả scan và các thông tin liên quan trong CSDL

2) **Bảo vệ API sau kiểm thử (protection)** bằng cách **đóng vai trò như một proxy/filter**  
   - Các mẫu **regex** được xây dựng/đúc kết trong quá trình test sẽ được dùng để **lọc dữ liệu đầu vào**
   - Mục tiêu là chặn/giảm thiểu request có dấu hiệu tấn công (ví dụ chuỗi nghi vấn SQLi) trước khi đi tới API thật (upstream)
   - Có thể coi đây là một lớp “application-level gateway” đơn giản: **nhận request → kiểm tra bằng regex → cho qua hoặc chặn**

> Tóm lại: AntiAPI vừa là **công cụ kiểm thử SQLi cho API**, vừa là **công cụ phòng vệ API** dựa trên các rule/regex thu được từ quá trình kiểm thử.

## Cài đặt & chạy

### 1) Clone project
```bash
git clone https://github.com/nguyenbtkma/AntiAPI.git
cd AntiAPI
```

### 2) Tạo môi trường & cài dependency
```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate

pip install -r requirements.txt
```

### 3) Cấu hình database (MySQL)
Sửa `config.py` cho đúng thông tin MySQL của bạn (user/pass/host/db), ví dụ:
- `MYSQL_USERNAME`
- `MYSQL_PASSWORD`
- `MYSQL_HOST`
- `MYSQL_DB`

Tạo database tương ứng trong MySQL (ví dụ `anti_database`).

### 4) Run
```bash
python run.py
```

Mặc định chạy ở `http://localhost:5000`.
