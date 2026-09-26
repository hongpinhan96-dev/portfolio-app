# Pinhann Personal Portfolio App (個人作品集系統)

採用玻璃 UI 設計的個人作品集網站。系統具備動態資料讀取、JWT 身份驗證登入、後台動態編輯功能，並透過 Docker Compose 進行容器化與內部網路資安硬化部署。

---

## 🏗️ 系統架構圖 (System Architecture)

```mermaid
graph TD
    Client[訪客 / 管理員 瀏覽器] -->|HTTP 請求 Port 3000| Backend[Node.js Express 後端容器]
    
    subgraph Docker Bridge Network (隔離網路)
        Backend -->|內部域名 mongodb:27017| Database[(MongoDB 6.0 資料庫容器)]
    end

    classDef container fill:#2d3748,stroke:#4a5568,color:#fff;
    class Backend,Database container;

---

## 🛠️ 3. 技術棧 (Tech Stack)

- **前端 (Frontend)**：HTML5, CSS3 (Glassmorphism 玻璃擬態設計), JavaScript (ES6+ Native JS), Font Awesome 6
- **後端 (Backend)**：Node.js, Express.js, JWT (JSON Web Token 權限驗證), `dotenv` (環境變數管理)
- **資料庫 (Database)**：MongoDB 6.0 (Mongoose ORM)
- **容器化與部署 (DevOps)**：Docker, Docker Compose, Ubuntu Server

---

## 🚀 4. 快速開始 / 安裝步驟 (Quick Start)

### 1. Clone Repository

```bash
git clone [https://github.com/hongpinhan96-dev/portfolio-app.git](https://github.com/hongpinhan96-dev/portfolio-app.git)
cd portfolio-app

2. 設定環境變數 
複製專案提供的範例環境變數檔 .env.example 並建立 .env
開啟 .env 檔案並設定屬於你的安全金鑰與密碼：

3. 使用 Docker Compose 一鍵啟動
啟動完成後，開啟瀏覽器造訪 http://localhost:3000 (或 http://你的伺服器IP:3000) 即可看到作品集網站！

---

## 🔑 5. 功能與使用說明 (Features & Usage)

- **動態資料展示**：前端首頁透過 Fetch API 向後端 `/api/profile` 發送請求，動態載入並渲染個人簡介、技術標籤與精選專案。
- **管理者身份驗證**：
  1. 點擊頁面右上方 **「管理者登入」** 按鈕，開啟登入 Modal[cite: 1]。
  2. 輸入 `.env` 設定之 `ADMIN_USER` 與 `ADMIN_PASS` 登入憑證[cite: 1]。
  3. 驗證成功後，後端將核發 JWT (JSON Web Token)，前端會將其快取至 Session/Local Storage[cite: 1]。
- **後台資料編輯**：
  - 登入狀態下，頁面將解鎖 **「編輯個人資料」** 按鈕[cite: 1]。
  - 點擊可彈出編輯 Modal，透過 `PUT /api/profile` 帶入 JWT Header 進行安全寫入與資料更新[cite: 1]。

---

## 🛡️ 6. 資安與部署最佳實踐 (Security & Best Practices)

1. **環境變數強制驗證 (Strict ENV Validation)**：
   - 後端 `server.js` 啟動時會嚴格檢查關鍵環境變數[cite: 1]。若未提供 `.env` 變數（如未設定 `JWT_SECRET` 或 `MONGO_URI`），程式會立即停機報錯 (`process.exit(1)`)，杜絕任何預設備援金鑰被預測的風險[cite: 1]。
2. **MongoDB 網路隔離 (Internal Network Only)**：
   - Docker Compose 中僅對外曝露 Express Port 3000，MongoDB 的 Port 27017 不進行 Host Mapping，確保資料庫僅能在 Docker Bridge 內部網路溝通[cite: 1]。
3. **金鑰與機密隔離 (Secrets Management)**：
   - 所有的敏感資料（如資料庫 Root 帳密、JWT 簽署金鑰、管理者登入帳密）皆使用 `.env` 進行管理，並已加入 `.gitignore` 避免敏感數據洩漏至版本控制系統[cite: 1]。
