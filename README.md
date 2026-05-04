# 🎮 Sudoku Web Game
Trò chơi Sudoku trên trình duyệt được xây dựng bằng React + TypeScript + Vite. Người chơi có thể chọn độ khó, điền số, sử dụng gợi ý, ghi chú bằng bút chì và xem đáp án sau khi kết thúc ván đấu.
---
## ✨ Tính năng
- Chọn độ khó: Dễ / Vừa / Khó
- Bảng Sudoku 9×9 với phân vùng 3×3 rõ ràng
- Hệ thống 3 mạng sống — mất mạng khi điền sai
- Bộ đếm thời gian (giới hạn 15 phút mỗi ván)
- Chế độ bút chì để ghi chú các số ứng viên
- Nút gợi ý (hint), hoàn tác (undo), xóa (erase)
- Màn hình thắng (kèm xếp hạng sao) và thua
- Xem đáp án đầy đủ sau khi kết thúc ván
- Thống kê: số ván thắng, kỷ lục thời gian, chuỗi streak
---
## 🚀 Hướng dẫn chạy
### Yêu cầu
- [Node.js](https://nodejs.org) >= 18
- npm >= 9
### Cài đặt & chạy
```bash
# 1. Clone repository
git clone https://github.com/<your-username>/sudoku-game.git
cd sudoku-game
# 2. Cài đặt dependencies
npm install
# 3. Chạy development server
npm run dev
```
Mở trình duyệt tại `http://localhost:5173`
### Build production
```bash
npm run build
```
Output sẽ nằm trong thư mục `dist/`.
### Chạy unit tests
```bash
npm run test
```
---
## 🧪 Kiểm thử
Dự án sử dụng **Vitest** cho unit test các hàm logic cốt lõi (`generateSudoku`, `isValid`, `createPuzzle`, `isGameComplete`, `formatTime`, `getStars`).
Hiện tại có **22 test case tự động** đang pass. Toàn bộ test case thủ công (85 trường hợp) được quản lý trong Google Sheet bên dưới.
---
## 📄 Tài liệu dự án
- **SRS — Đặc tả yêu cầu phần mềm**  [Google Doc](https://docs.google.com/document/d/1GmZCqhZh6KnKdLz0r3Pas7yoLuSIMBlKuT-IqvW__2c/edit?usp=sharing)
- **Figma — Thiết kế giao diện**  [Figma Make](https://www.figma.com/make/j6Z16GR9JIr2zBebhnu5kW/Sudoku-Game-UI-Design?t=Xdm0KuwdNyK5nnUL-1) |
- **Test Case — Bảng kiểm thử**  [Google Sheets](https://docs.google.com/spreadsheets/d/1XYO3OVcCQqtQlSInIwaym0W9j9YV83FnqOHGLJjBj08/edit?usp=sharing) 
