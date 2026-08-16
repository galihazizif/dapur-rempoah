CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  hash TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  customer_id TEXT,
  payment_method TEXT DEFAULT 'qris',
  payment_status TEXT DEFAULT 'unpaid',
  voucher_code TEXT,
  discount_amount INTEGER DEFAULT 0,
  shipping_fee INTEGER DEFAULT 0,
  additional_fee INTEGER DEFAULT 0,
  order_type TEXT DEFAULT 'delivery',
  pickup_delivery_date TEXT,
  pickup_delivery_time TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vouchers (
  code TEXT PRIMARY KEY,
  amount INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_used BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO settings (key, value) VALUES ('store_status', 'open');
INSERT OR IGNORE INTO settings (key, value) VALUES ('store_message', 'Maaf, toko sedang libur. Silakan pesan dilain waktu.');

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_confirmations (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  order_reference TEXT NOT NULL,
  amount_paid INTEGER NOT NULL,
  notes TEXT,
  status INTEGER DEFAULT 0, -- 1 processed, 0 unprocessed
  payment_date DATETIME NOT NULL,
  validity TEXT DEFAULT NULL, -- null, invalid, valid
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  picture TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_sessions (
  token TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
