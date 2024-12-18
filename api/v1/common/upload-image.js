const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../../ticket');
        console.log('Resolved upload path:', uploadPath); 
        fs.mkdirSync(uploadPath, { recursive: true }); 
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true); // File is valid
    } else {
        const error = new Error('Only images (JPG, JPEG, PNG) and PDFs are allowed.');
        error.status = 400; // Add a custom status code
        cb(error); // Pass the error to Multer
    }
};


const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError || err.status === 400) {
        // Handle Multer or custom file validation errors
        return res.status(err.status || 500).json({
            success: false,
            status: err.status || 500,
            message: err.message || 'File upload error.',
        });
    }
    next(err); 
}


// Multer instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
    fileFilter: fileFilter
});

module.exports = {multerErrorHandler,upload};



