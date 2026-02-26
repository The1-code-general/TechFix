const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadType = req.uploadType || 'misc';
    const dest = path.join(process.env.UPLOAD_PATH || './uploads', uploadType);
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const isAllowed = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
  if (isAllowed) return cb(null, true);
  cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
};

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
  fileFilter,
});

// Middleware factories
const uploadProductImages = (req, res, next) => {
  req.uploadType = 'products';
  upload.array('images', 5)(req, res, next);
};

const uploadRepairImages = (req, res, next) => {
  req.uploadType = 'repairs';
  upload.array('deviceImages', 3)(req, res, next);
};

const uploadSingle = (fieldName, type = 'misc') => (req, res, next) => {
  req.uploadType = type;
  upload.single(fieldName)(req, res, next);
};

module.exports = { uploadProductImages, uploadRepairImages, uploadSingle };
