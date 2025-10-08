const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Common uploader for file types (PDF, Excel, Word, etc.)
 * @param {Object} options
 * @param {string} options.folderPath - Folder where files will be stored
 * @param {string[]} [options.allowedTypes] - Allowed extensions (default: ['pdf', 'xlsx', 'xls', 'csv', 'doc', 'docx'])
 * @param {number} [options.maxSizeMB=20] - Max file size in MB (default: 20MB)
 * @returns {Object} { upload, multerErrorHandler }
 */
function createFileUploader({
  folderPath,
  allowedTypes = ['pdf', 'xlsx', 'xls', 'csv', 'doc', 'docx'],
  maxSizeMB = 20,
}) {
  // Ensure upload directory exists
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.resolve(folderPath);
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

  // File filter (PDF, Excel, Word, CSV)
  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const allowed = allowedTypes.map((type) => type.toLowerCase());
    const extAllowed = allowed.includes(ext);

    if (extAllowed) {
      cb(null, true);
    } else {
      const error = new Error(`Only ${allowed.join(', ').toUpperCase()} files are allowed.`);
      error.status = 400;
      cb(error);
    }
  };

  // Multer instance
  const uploadFile = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });

  // Common error handler
  const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError || err.status === 400) {
      return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'File upload error.',
      });
    }
    next(err);
  };

  return { uploadFile, multerErrorHandler };
}

module.exports = createFileUploader;
