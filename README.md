# 電子個人簡介製作

本專案是一個部署於 Ubuntu Server 虛擬機 Docker 容器中的個人簡介網站，支援管理者登入與動態資料修改。

---

## 技術棧與工具 

- **前端 (Front-end)**: HTML5, CSS3, JavaScript, Bootstrap
- **後端 (Back-end)**: Node.js (Express)
- **資料庫 (Database)**: MongoDB (NoSQL)
- **DevOps & Infrastructure**: 
  - Ubuntu Server (無 GUI 最小化環境)
  - Docker & Docker Compose
  - SSH (金鑰認證機制)
  - Git / GitHub (版本控制)

---

## 系統架構 (System Architecture)

1. **基礎設施**: 在本機建立 Ubuntu Server 虛擬機，停用密碼認證並僅允許 SSH Key 連線，將系統切換為純文字模式（`multi-user.target`）最小化運作。
2. **容器化部署**: 透過 Docker Compose 管理後端服務與 MongoDB 資料庫：
   - **Backend Container**: 運行 Node.js/Express 服務（Port 3000）。
   - **Database Container**: 運行 MongoDB 儲存個人簡介與動態資料（Port 27017）。
3. **頁面架構**:
   - `/`：個人簡介展示頁面（開放瀏覽）。
   - `/login`：管理者登入與資料編輯頁面（需通過身份驗證）。

---

##部署與啟動步驟 (Deployment & Setup)

### 1. 複製專案庫
```bash
git clone [https://github.com/pinhann/portfolio-app.git](https://github.com/pinhann/portfolio-app.git)
cd portfolio-app
