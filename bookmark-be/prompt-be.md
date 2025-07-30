# 🧠 Prompt cho Cursor AI: Xây dựng Backend cho Bookmark Manager

Bạn là một kỹ sư backend AI chuyên nghiệp. Tôi cần bạn xây dựng toàn bộ phần backend cho dự án "Bookmark Manager" dựa trên các yêu cầu chính thức dưới đây và các ràng buộc công nghệ. Hãy coi đây là một ứng dụng cấp sản phẩm phục vụ hàng triệu người dùng, vì vậy code phải có khả năng mở rộng, sạch sẽ và dễ bảo trì. Chỉ tập trung vào backend, không động đến frontend.

---

## 📝 Tên dự án: Bookmark Manager

### 🎯 Mục tiêu:
Xây dựng backend cho một ứng dụng web Bookmark Manager, nơi người dùng có thể thêm, xem và xóa các liên kết website.

---

## 📌 Yêu cầu tính năng (Chỉ backend):

### API Endpoints:

- `POST /bookmarks`: Thêm bookmark mới với các trường `title` (bắt buộc), `url` (bắt buộc, phải là URL hợp lệ), và `description` (tùy chọn).
- `GET /bookmarks`: Lấy danh sách bookmark với hỗ trợ phân trang (query parameters: `page` và `limit`).
- `DELETE /bookmarks/:id`: Xóa bookmark theo ID.

### Lưu trữ dữ liệu:

- Sử dụng bộ nhớ trong (in-memory storage), không cần database thực.
- Xử lý hiệu quả tới 5,000 bookmark.
- mock database cho 5000 bookmarks để response ra get /bookmarks API endpoint (đương nhiên là theo phân trang)

### Xác thực dữ liệu:

- Xác thực dữ liệu đầu vào cho `POST /bookmarks` (ví dụ: các trường bắt buộc, định dạng URL).
- Xử lý lỗi phù hợp (ví dụ: `400` cho lỗi xác thực, `404` khi không tìm thấy).

### Phân trang:

- Hỗ trợ phân trang cho `GET /bookmarks` với mặc định `page=1` và `limit=20`.
- Trả về dữ liệu phân trang kèm metadata (ví dụ: tổng số lượng, trang hiện tại, tổng số trang).

---

## 💻 Yêu cầu công nghệ backend:

### NestJS + TypeScript:

- Sử dụng `Node.js` với framework `NestJS`.
- Cấu trúc dự án rõ ràng với `Modules`, `Controllers`, `Services`, `DTOs`, và `Repositories`.

### UUID:

- Tạo ID duy nhất cho mỗi bookmark bằng thư viện `uuid`.

### Validation:

- Sử dụng `class-validator` và `class-transformer` để xác thực DTO.

### In-memory Storage:

- Dùng `Map` hoặc `Array` để lưu bookmark, mock database này tới 5000 items.
- Bookmark mới nhất nằm ở đầu danh sách (reverse chronological).
- Tách hẳn logic lưu trữ vào một `Repository` riêng biệt để dễ mở rộng.

---

## ✅ Ràng buộc:

- KHÔNG sử dụng database thực; chỉ dùng bộ nhớ trong (in-memory storage).
- KHÔNG bao gồm code frontend hoặc chỉnh sửa frontend.
- API assume được gọi từ frontend ở `http://localhost:3000`.
- Tuân thủ tiêu chuẩn RESTful API và mã trạng thái HTTP phù hợp.

---

## 🧱 Kiến trúc mở rộng và maintainable:

Áp dụng **Layered Architecture** chuẩn production:

### 1. Repository Pattern:

- Định nghĩa interface `IBookmarkRepository` với các method: `save()`, `findAll()`, `deleteById()`.
- Tạo class `InMemoryBookmarkRepository` implement interface này.
- Inject `IBookmarkRepository` vào `BookmarkService` qua `Dependency Injection`.
- Trong `BookmarkModule`, khai báo provider như sau:

```ts
{
  provide: IBookmarkRepository,
  useClass: InMemoryBookmarkRepository,
}

### 2. Controller:
- Chỉ chịu trách nhiệm xử lý request, validate DTO, và gọi Service.
- KHÔNG chứa logic nghiệp vụ.

### 3. Service:
- Chứa toàn bộ logic nghiệp vụ (business logic).
- Không biết gì về request/response HTTP.
- Chỉ tương tác qua interface Repository.

### 4. Repository:
- Quản lý lưu trữ thực tế trong bộ nhớ (Map/Array).
- Có thể dễ dàng thay bằng PostgresRepository, RedisRepo,... sau này.


## 🧰 Bonus (rất khuyến khích):
- Tích hợp @nestjs/swagger để tự động sinh API docs.
- Tích hợp @nestjs/config để quản lý biến môi trường (ví dụ: PORT, giới hạn, etc).
- Setup script format: Prettier + ESLint với Husky (pre-commit) để giữ code sạch.

## 📦 Cấu trúc thư mục đề xuất (suggest sơ bộ của tao thôi, mày cứ thoải mái add thêm file/folder cần thiết):

src/
├── modules/bookmarks/
│   ├── bookmarks.module.ts
│   ├── bookmarks.controller.ts
│   ├── bookmarks.service.ts
│   ├── dto/
│   │   ├── create-bookmark.dto.ts
│   │   └── pagination-query.dto.ts
│   ├── entities/
│   │   └── bookmark.entity.ts
│   ├── interfaces/
│   │   └── bookmark-repository.interface.ts
│   └── repositories/
│       └── in-memory-bookmark.repository.ts
├── main.ts
├── app.module.ts
