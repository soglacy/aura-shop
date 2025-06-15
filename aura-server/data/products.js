// aura-server/data/products.js

const products = [
  { 
    customId: 'gp9-1', 
    name: ['Google Pixel 9 (8/256Gb)', 'Gray (Серый)'], 
    imageUrl: '/images/gallery/1.png', // Это основное изображение для каталога/карточки
    price: '99 599₽', 
    priceValue: 99599, 
    productLink: '/product/gp9-1', // Это будет использоваться для генерации ссылки на клиенте
    shortDescription: 'Невероятные возможности с Gemini AI.', 
    manufacturer: "Google", 
    ram: 8, 
    storage: 256, 
    screenSizeValue: 6.3, 
    keySpecs: [ 
        { label: "Экран", value: "6.3\" OLED" }, { label: "Камера", value: "50МП" },
        { label: "Память", value: "8/256 ГБ" }, { label: "Чип", value: "Tensor G4" }
    ],
    // Поля для ProductDetailPage
    images: ['/images/gallery/1.png', '/images/temp/pixel9-gray-2.jpg'], // Массив всех изображений для галереи (если imagesByColor нет)
    imagesByColor: { 
      'Серый': ['/images/gallery/1.png', '/images/temp/pixel9-gray-2.jpg', '/images/temp/pixel9-gray-3.jpg'],
      'Черный': ['/images/temp/pixel9-black-1.jpg', '/images/temp/pixel9-black-2.jpg']
    },
    options: [
      { name: 'Цвет', values: ['Серый', 'Черный'], defaultValue: 'Серый' },
      { name: 'Память', values: ['256Gb', '512Gb'], defaultValue: '256Gb', prices: {'256Gb': 99599, '512Gb': 105999} }
    ],
    specifications: { 
    'Дисплей': '6.3" Actua display (1080 x 2400) OLED at 424 PPI, Smooth Display (60-120 Hz)', 
    'Процессор': 'Google Tensor G4, Titan M2 security coprocessor',
    'Основная камера': '50 MP Octa PD wide camera (ƒ/1.68) + 12 MP ultrawide camera (ƒ/2.2)',
    'Фронтальная камера': '10.5 MP ultrawide camera (ƒ/2.2)',
    'Память и хранилище': '8 GB LPDDR5X RAM, 128 GB / 256 GB UFS 3.1 storage',
    'Аккумулятор и зарядка': '4575 mAh (typical), Fast charging – up to 50% charge in about 30 minutes, Qi-certified Wireless charging',
    'Аутентификация': 'Fingerprint Unlock with under-display fingerprint sensor, Face Unlock',
    'Сети и подключения': 'Wi-Fi 6E (802.11ax), Bluetooth® v5.3, NFC, Google Cast, Dual SIM (single Nano SIM and eSIM)',
    'Размеры и вес': '150.5 x 70.8 x 8.9 mm, 187 g',
    'Материалы': 'Scratch-resistant Corning® Gorilla® Glass Victus® cover glass, Edgeless Corning® Gorilla® Glass Victus® back with matte aluminum frame, IP68 dust and water resistance',
    'ОС': 'Android 15 (с обновлениями на 7 лет)',
    }, 
    fullDescription: "Google Pixel 9 переосмысливает возможности смартфона. Встроенный ИИ Gemini помогает вам во всем, от создания потрясающих фотографий до интеллектуального управления задачами. Улучшенная камера с разрешением 50 МП и функцией Night Sight делает невероятные снимки даже при слабом освещении. Magic Editor позволяет редактировать фотографии как по волшебству. Яркий 6,3-дюймовый дисплей с частотой обновления до 120 Гц обеспечивает плавное изображение. Мощный чип Google Tensor G4 создан для передовых ИИ-алгоритмов, а 8 ГБ оперативной памяти гарантируют быструю и плавную работу. Аккумулятор Pixel 9 обеспечит работу на целый день и дольше.",
    category: 'Смартфоны', 
    countInStock: 10, 
    rating: 0, // Пример рейтинга
    numReviews: 0, // Пример количества отзывов
    isFeatured: true,
    tags: ['pixel', 'android', 'camera', 'AI']
  },
  { 
    customId: 'ip15-1', 
    name: ['iPhone 15 (6/256Gb)', 'Желтый'], 
    imageUrl: '/images/gallery/2.png', 
    price: '49 399₽', 
    priceValue: 49399, 
    productLink: '/product/ip15-1',
    shortDescription: 'Новый Dynamic Island, камера 48МП.', 
    manufacturer: "Apple", 
    ram: 6, 
    storage: 256, 
    screenSizeValue: 6.1, 
    keySpecs: [ 
        { label: "Экран", value: "6.1\" Super Retina" }, { label: "Камера", value: "48МП" },
        { label: "Память", value: "6/256 ГБ" }, { label: "Чип", value: "A16 Bionic" }
    ],
    images: ['/images/gallery/2.png', '/images/temp/iphone15-yellow-2.jpg'],
    imagesByColor: { 
      'Желтый': ['/images/gallery/2.png', '/images/temp/iphone15-yellow-2.jpg'],
      'Синий': ['/images/temp/iphone15-blue-1.jpg']
    },
    options: [
      { name: 'Цвет', values: ['Желтый', 'Синий'], defaultValue: 'Желтый' },
      { name: 'Память', values: ['256Gb'], defaultValue: '256Gb', prices: {'256Gb': 49399} }
    ],
    specifications: { 'Дисплей': '6.1" Super Retina XDR', 'Процессор': 'A16 Bionic'}, 
    fullDescription: "Полное описание iPhone 15...",
    category: 'Смартфоны', 
    countInStock: 15, 
    isTrending: true,
    tags: ['iphone', 'ios']
  },
  // ... ДОБАВЬТЕ СЮДА ВСЕ ОСТАЛЬНЫЕ ТОВАРЫ, ЗАПОЛНИВ МАКСИМАЛЬНО ВСЕ ПОЛЯ СОГЛАСНО МОДЕЛИ ...
  // ПРИМЕР НОВОГО ТОВАРА
  { 
    customId: 'sony-xperia-1v-new', // Убедитесь, что customId уникален
    name: ['Sony Xperia 1 V (12/256Gb)', 'Khaki Green'], 
    imageUrl: '/images/temp/sony-xperia-1v.jpg', // Создайте это изображение
    price: '115 890₽', 
    priceValue: 115890, 
    productLink: '/product/sony-xperia-1v-new',
    shortDescription: 'Профессиональная камера в смартфоне от Sony.', 
    manufacturer: "Sony", 
    ram: 12, 
    storage: 256, 
    screenSizeValue: 6.5, 
    keySpecs: [ 
        { label: "Экран", value: "6.5\" 4K OLED" }, { label: "Камера", value: "Zeiss Optics" },
        { label: "Память", value: "12/256 ГБ" }, { label: "Запись видео", value: "4K 120fps" }
    ],
    images: ['/images/temp/sony-xperia-1v.jpg'], // Добавьте больше, если есть
    imagesByColor: { 'Khaki Green': ['/images/temp/sony-xperia-1v.jpg'] },
    options: [
      { name: 'Цвет', values: ['Khaki Green', 'Black'], defaultValue: 'Khaki Green' },
      { name: 'Память', values: ['256Gb', '512Gb'], defaultValue: '256Gb', prices: {'256Gb': 115890, '512Gb': 125890} }
    ],
    specifications: { /* ... */ }, 
    fullDescription: "Детальное описание Sony Xperia 1 V...",
    category: 'Смартфоны', 
    countInStock: 5,
    tags: ['sony', 'xperia', 'camera phone']
  }
];

module.exports = products;