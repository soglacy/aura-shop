// aura-server/routes/uploadRoutes.js
const path = require('path');
const express = require('express');
const multer = require('multer');
const { UploadClient } = require('@uploadcare/upload-client');

const router = express.Router();

// --- НАСТРОЙКА КЛИЕНТА UPLOADCARE ---
// Убедитесь, что переменные окружения установлены!
const client = new UploadClient({ 
  publicKey: process.env.UPLOADCARE_PUBLIC_KEY 
});

// --- НАСТРОЙКА MULTER ---
// Мы будем хранить файл в памяти (буфере), а не на диске
const storage = multer.memoryStorage();

// Функция для проверки типа файла
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Разрешены только изображения (jpg, jpeg, png, webp)!'));
}

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// --- РОУТ ДЛЯ ЗАГРУЗКИ ---
// Мы делаем его асинхронным, чтобы дождаться ответа от Uploadcare
router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Файл для загрузки не предоставлен');
  }

  try {
    // Загружаем файл из буфера (req.file.buffer) в Uploadcare
    const fileInfo = await client.uploadFile(req.file.buffer, {
      publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
      store: 'auto', // Автоматически сохранять файл
      metadata: {
        source: 'aura-shop-backend'
      }
    });

    // fileInfo.cdnUrl содержит готовый URL для использования на сайте
    res.status(201).send({
      message: 'Изображение успешно загружено',
      image: fileInfo.cdnUrl, // <-- Возвращаем URL из Uploadcare
    });

  } catch (uploadError) {
    console.error('Ошибка при загрузке в Uploadcare:', uploadError);
    res.status(500).json({ message: 'Ошибка сервера при загрузке файла.' });
  }
});

module.exports = router;