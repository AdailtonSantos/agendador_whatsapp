const multer = require('multer');
const fs = require('fs');

let counter = 1

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../public/')
  },
  filename: function (req, file, cb) {
    let filename = file.originalname
    const fullPath = '../../public/' + filename
    if (fs.existsSync(fullPath)) {
      req.newFileName = `${counter}-${filename}` 
      cb(null, `${counter}-${filename}`)
      counter++
      return
    }
    cb(null, `${filename}`)
  }
});

const allowedFileTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/svg+xml',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'application/rtf',
  'application/vnd.oasis.opendocument.text',
  'video/mp4',
  'video/x-msvideo',
  'video/x-ms-wmv',
  'video/x-flv',
  'video/webm',
  'application/zip',
  'application/x-rar-compressed',
  'application/gzip',
  'application/x-7z-compressed'
];

const upload = multer({
  storage, 
  limits: { fileSize: 20971520 }, // 20mb
  fileFilter: (req, file, cb) => {
    if (allowedFileTypes.some(type => type === file.mimetype)) {
      cb(null, true);
    } else {
      req.fileValidationError = 'Tipo de arquivo não permitido.';
      cb(null, false, new Error('Tipo de arquivo não permitido.'));
    }
  }
});

module.exports = upload