import multer from 'multer';
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
  // Since we upload to cloudinary, we can use a temp folder or memory storage
  // but let's just use memory storage to avoid saving files locally first
});

const memoryStorage = multer.memoryStorage();

// Initialize upload
const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Check File Type
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|webp/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
}

export default upload;
