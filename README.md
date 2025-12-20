# HƯỚNG DẪN CHẠY DỰ ÁN (SERVER & CLIENT)

Do project đã được cấu hình sẵn, bạn chỉ cần cài đặt môi trường và chạy lệnh.

## BƯỚC 1: Chuẩn bị môi trường (Bắt buộc)

Trước khi chạy, đảm bảo máy tính Windows của bạn đã có:

1.  **Visual Studio Code**.
2.  **SQL Server** (Đã import database từ file script `.sql` trong source code).
3.  **Node.js** (Để chạy lệnh npm).

## BƯỚC 2: Kiểm tra cấu hình Database (File .env có sẵn)

Trong thư mục **Backend (be)** đã có sẵn file `.env`.

- Bạn hãy mở file đó lên kiểm tra dòng `DB_PASSWORD` và `DB_USER`.
- Nếu mật khẩu SQL Server trên máy bạn KHÁC với trong file, hãy sửa lại cho đúng với máy bạn rồi Lưu lại.

## BƯỚC 3: Chạy BACKEND (Server) - Tab Terminal 1

1.  Mở thư mục dự án bằng VS Code.
2.  Mở Terminal (`Ctrl` + `~`).
3.  Nhập lần lượt các lệnh sau (nhấn Enter sau mỗi dòng):

    cd backend
    npm install
    npm start / npm run dev

    _(Lệnh `cd backend` để đi vào thư mục backend. Lệnh `install` để cài thư viện. Lệnh `start` để chạy server)._

-> **Thành công khi:** Hiện thông báo `Server running...` hoặc `Connected to DB`.
⚠️ **GIỮ NGUYÊN TAB NÀY, KHÔNG ĐƯỢC TẮT.**

## BƯỚC 4: Chạy FRONTEND (Client) - Tab Terminal 2

1.  Vẫn trong VS Code, bấm vào dấu cộng **(+)** ở góc khung Terminal để mở thêm 1 tab mới.
2.  Nhập lần lượt các lệnh sau:

    cd backend
    npm install
    npm start / npm run dev

-> **Thành công khi:** Trình duyệt tự động bật lên và hiện giao diện web.

---

**TÓM TẮT:**

- Tab 1: Chạy Server (Backend).
- Tab 2: Chạy Web (Frontend).
