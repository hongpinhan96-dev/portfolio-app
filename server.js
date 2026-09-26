const express = require('express'); 
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET
const MONGO_URI = process.env.MONGO_URI 
const ADMIN_USER = process.env.ADMIN_USER
const ADMIN_PASS = process.env.ADMIN_PASS

if (!JWT_SECRET || !MONGO_URI || !ADMIN_USER || !ADMIN_PASS) {
  console.error('CRITICAL ERROR: Required environment variables are missing!');
  process.exit(1);
}


mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB 連線成功！'))
  .catch(err => console.error('MongoDB 連線失敗:', err));

const ProfileSchema = new mongoose.Schema({
  name: String,
  title: String,
  bio: String,
  skills: [String]
});
const Profile = mongoose.model('Profile', ProfileSchema);

async function initDB() {
  const count = await Profile.countDocuments();
  if (count === 0) {
    await Profile.create({
      name: 'Pinhann',
      title: '資工系學生 / Linux 系統管理者',
      bio: '熱愛 Linux 系統硬化、網路安全與 Docker 容器化開發。',
      skills: ['Linux System', 'Docker', 'Node.js', 'Python', 'C/C++']
    });
    console.log('預設個人資料初始化完成！');
  }
}
mongoose.connection.once('open', initDB);

app.get('/api/profile', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: '無法讀取資料' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // 使用備援預設值驗證
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ success: true, token });
  }
  res.status(401).json({ success: false, message: '帳號或密碼錯誤' });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { name, title, bio, skills } = req.body;
    const updated = await Profile.findOneAndUpdate({}, { name, title, bio, skills }, { new: true, upsert: true });
    res.json({ success: true, profile: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: '更新失敗' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
