* Yêu cầu hệ thống: bắt buộc sử dụng python ver: 3.8,  nodejs ver: 16.14.2

* Đối với Network_Backend: Chạy hệ điều hành Window
	** Vào trong folder chứa source code, mở terminal và chạy các câu lệnh sau:
	    o Tạo môi trường:
		 pip install virtualenv ( nếu máy chưa có ) 
		 virtualenv venv
		 .\venv\Scripts\activate
	    o Tải thư viện cần thiết (có thể bỏ qua bước tạo môi trường và cài đặt thằng vào máy)
		 pip install -r requirements.txt
		 Tạo file .env cùng cấp với file main và copy data trong .env.example vào file .env ( nếu  file .env chưa tồn tại) 
		 Chạy hệ thống với port 8080: uvicorn main:app --reload --port 8080 (frontend gọi đến port 8080 của backend để lấy dữ liệu)

* Đối với Web_Social_TDTU_Frontend: Chạy hệ điều hành Window 
	** Vào folder chứa file package.json mở terminal và chạy các câu lệnh sau:
		 npm install 
		 npm start

*** Lưu ý: Đợi 1 thời gian để reactjs khởi động, reactjs sẽ tự dẫn đến trang đăng nhập của hệ thống
