以下將會引導你如何安裝此專案到你的電腦上。

Node.js 版本建議為：`18.14.0` 以上...

### 取得專案

```bash
git clone git@github.com:RayChen1996/homesecuritypro-ExpressAPI.git
```

### 安裝套件

```bash
npm install
```

### 環境變數設定

請在終端機輸入 `cp .env.simple .env` 來複製 .env.example 檔案，並依據 `.env` 內容調整相關欄位。

### 運行專案

```bash
npm run start
```

### 開啟專案

在瀏覽器網址列輸入以下即可看到畫面

```bash
http://localhost:3000/
```

### swagger 文件

```bash
http://localhost:3000/swagger
```

## 環境變數說明

```env
PORT=
MONGODB_URL= # MongoDB 資料庫網址
MONGODB_PASSWORD= # MongoDB 密碼

SWAGGER_HOST= # Swagger base url
SWAGGER_SCHEMES= # Swagger 連接 schemes, 'http' or 'https'

IMGUR_ALBUM_ID= # Imgur 相簿 Album ID
IMGUR_CLIENTID= # Imgur API 串接 Client ID
IMGUR_CLIENT_SECRET= # Imgur API 串接 Client Secret
IMGUR_REFRESH_TOKEN= # Imgur API 串接 Token

JWT_SECRET_KEY= # JWT TOKEN 加密私鑰



CLIENT_ID= # Google Cloud Platform Client ID
CLIENT_SECRET= # Google Cloud Platform Secret Key
GMAIL_REDIRECT_URL= # Google Cloud Platform redirect URI
GMAIL_REFRESH_TOKEN= # Gmail API refresh token
...
```

## 資料夾說明

- connections - 資料庫連接
- controllers - 控制器放置處
- interface - TypeScript 型別
- middleware - API 攔截器
- modules - Mongoose 模組放置處
- routes - API 路由
- service - API 相關服務
- utils - 通用方法
  ...

## 專案技術

- Node.js v18.14.1
- express v4.16.1
- mongoose v8.3.2
- typescript v5.4.5
- swagger v2.23.7
  ...

當專案 merge 到 main 時會自動執行以下動作：

- 建立 Node.js 環境
- 安裝相依套件
- 編譯程式碼
- 執行 ESLint 掃描
- 執行測試
- 部署到 Render
  ...
