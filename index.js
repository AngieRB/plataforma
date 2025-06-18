import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

let activities = [];
const activitiesFile = 'activities.json';

if (fs.existsSync(activitiesFile)) {
  activities = JSON.parse(fs.readFileSync(activitiesFile));
}

app.post('/api/activities', upload.single('image'), (req, res) => {
  const { name, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
  const activity = { name, description, imageUrl };
  activities.push(activity);
  fs.writeFileSync(activitiesFile, JSON.stringify(activities, null, 2));
  res.status(201).json(activity);
});

app.get('/api/activities', (req, res) => {
  res.json(activities);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
