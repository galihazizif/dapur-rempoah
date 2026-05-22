export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const ADMIN_SECRET = env.ADMIN_SECRET || "rempoah-admin-2026";

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    const checkAuth = () => {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
        return false;
      }
      return true;
    };

    const sendTelegramMessage = async (text) => {
      const token = env.TELEGRAM_BOT_TOKEN;
      const chatId = env.TELEGRAM_CHAT_ID;
      if (!token || !chatId) return;

      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: "HTML",
          }),
        });
      } catch (err) {
        console.error("Failed to send Telegram notification:", err);
      }
    };

    const generateFriendlyId = (prefix, length = 6) => {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let randomPart = '';
      for (let i = 0; i < length; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `${prefix}${randomPart}`;
    };

    // Voucher API
    if (url.pathname === "/admin/vouchers" && request.method === "GET") {
      if (!checkAuth()) return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401, headers: corsHeaders });
      try {
        const { results } = await env.DB.prepare("SELECT * FROM vouchers ORDER BY created_at DESC").all();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === "/admin/vouchers" && request.method === "POST") {
      if (!checkAuth()) return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401, headers: corsHeaders });
      try {
        const { code, amount, is_active } = await request.json();
        if (!code || !amount) {
          return new Response(JSON.stringify({ success: false, message: "Code and amount are required" }), { status: 400, headers: corsHeaders });
        }
        await env.DB.prepare(`
          INSERT INTO vouchers (code, amount, is_active, is_used)
          VALUES (?, ?, ?, ?)
        `).bind(code.trim().toUpperCase(), amount, is_active !== undefined ? (is_active ? 1 : 0) : 1, 0).run();
        
        return new Response(JSON.stringify({ success: true, message: "Voucher created" }), { status: 201, headers: corsHeaders });
      } catch (error) {
        if (error.message.includes("UNIQUE constraint failed")) {
          return new Response(JSON.stringify({ success: false, message: "Voucher code already exists" }), { status: 400, headers: corsHeaders });
        }
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname.startsWith("/admin/vouchers/") && request.method === "PUT") {
      if (!checkAuth()) return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401, headers: corsHeaders });
      try {
        const code = url.pathname.split("/")[3];
        const { amount, is_active, is_used } = await request.json();
        
        await env.DB.prepare(`
          UPDATE vouchers 
          SET amount = COALESCE(?, amount), 
              is_active = COALESCE(?, is_active),
              is_used = COALESCE(?, is_used)
          WHERE code = ?
        `).bind(
          amount, 
          is_active !== undefined ? (is_active ? 1 : 0) : null,
          is_used !== undefined ? (is_used ? 1 : 0) : null,
          code
        ).run();

        return new Response(JSON.stringify({ success: true, message: "Voucher updated" }), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname.startsWith("/admin/vouchers/") && request.method === "DELETE") {
      if (!checkAuth()) return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401, headers: corsHeaders });
      try {
        const code = url.pathname.split("/")[3];
        await env.DB.prepare("DELETE FROM vouchers WHERE code = ?").bind(code).run();
        return new Response(JSON.stringify({ success: true, message: "Voucher deleted" }), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname.startsWith("/vouchers/") && request.method === "GET") {
      try {
        const code = url.pathname.split("/")[2];
        const voucher = await env.DB.prepare("SELECT * FROM vouchers WHERE code = ?").bind(code).first();
        if (!voucher) {
           return new Response(JSON.stringify({ success: false, message: "Voucher tidak ditemukan" }), { status: 404, headers: corsHeaders });
        }
        if (!voucher.is_active) {
           return new Response(JSON.stringify({ success: false, message: "Voucher sudah tidak aktif" }), { status: 400, headers: corsHeaders });
        }
        if (voucher.is_used) {
           return new Response(JSON.stringify({ success: false, message: "Voucher sudah digunakan" }), { status: 400, headers: corsHeaders });
        }
        return new Response(JSON.stringify({ success: true, voucher }), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500, headers: corsHeaders });
      }
    }

    // Settings API
    if (url.pathname === "/settings" && request.method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM settings").all();
        const settings = {};
        results.forEach(r => settings[r.key] = r.value);
        return new Response(JSON.stringify(settings), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === "/admin/settings" && request.method === "PUT") {
      if (!checkAuth()) return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401, headers: corsHeaders });
      try {
        const { store_status, store_message } = await request.json();
        const statements = [];
        if (store_status !== undefined) {
          statements.push(env.DB.prepare("UPDATE settings SET value = ? WHERE key = 'store_status'").bind(store_status));
        }
        if (store_message !== undefined) {
          statements.push(env.DB.prepare("UPDATE settings SET value = ? WHERE key = 'store_message'").bind(store_message));
        }
        if (statements.length > 0) await env.DB.batch(statements);
        return new Response(JSON.stringify({ success: true, message: "Settings updated" }), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === "/menu" && request.method === "GET") {
      try {
        const { results } = await env.DB.prepare(`
          SELECT * FROM products WHERE available = 1
        `).all();

        return new Response(JSON.stringify(results), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    if (url.pathname === "/products" && request.method === "GET") {
      try {
        const { results } = await env.DB.prepare(`
          SELECT * FROM products ORDER BY created_at DESC
        `).all();

        return new Response(JSON.stringify(results), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    if (url.pathname === "/orders" && request.method === "POST") {
      try {
        const orderData = await request.json();
        const { customer, items, turnstileToken, voucherCode } = orderData;

        const orderId = generateFriendlyId('ORD');
        const orderHash = Math.random().toString(36).substring(2, 12);
        let calculatedTotal = 0;
        let discountAmount = 0;
        let appliedVoucher = null;
        const verifiedItems = [];
        const statements = [];

        // 1. Verify Turnstile Token
        if (!turnstileToken) {
          return new Response(JSON.stringify({
            success: false,
            message: "Missing bot protection token"
          }), { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
        }

        const formData = new URLSearchParams();
        formData.append("secret", env.TURNSTILE_SECRET_KEY);
        formData.append("response", turnstileToken);
        formData.append("remoteip", request.headers.get("CF-Connecting-IP") || "");

        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          body: formData,
        });

        const verifyResult = await verifyRes.json();
        if (!verifyResult.success) {
          console.error("Turnstile verification failed:", verifyResult);
          return new Response(JSON.stringify({
            success: false,
            message: "Bot protection verification failed",
            errorDetails: verifyResult["error-codes"] // Return error codes for debugging
          }), { status: 403, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
        }

        // Check if store is open
        const statusSetting = await env.DB.prepare("SELECT value FROM settings WHERE key = 'store_status'").first();
        if (statusSetting && statusSetting.value !== 'open') {
          return new Response(JSON.stringify({
            success: false,
            message: "Maaf, toko sedang tutup dan tidak menerima pesanan."
          }), { status: 403, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
        }

        // Validate items and calculate total on backend
        const productIds = items.map(item => item.id);
        const { results: dbProducts } = await env.DB.prepare(`
          SELECT * FROM products WHERE id IN (${productIds.map(() => '?').join(',')})
        `).bind(...productIds).all();

        for (const item of items) {
          const menuProduct = dbProducts.find(p => p.id === item.id);
          if (!menuProduct) {
            return new Response(JSON.stringify({
              success: false,
              message: `Product with ID ${item.id} not found`
            }), { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
          }
          if (!menuProduct.available) {
            return new Response(JSON.stringify({
              success: false,
              message: `Product ${menuProduct.name} is currently unavailable`
            }), { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
          }
          const price = menuProduct.price;
          const quantity = parseInt(item.quantity);
          if (isNaN(quantity) || quantity <= 0) {
            throw new Error(`Invalid quantity for product ${menuProduct.name}`);
          }
          calculatedTotal += price * quantity;
          verifiedItems.push({
            ...item,
            name: menuProduct.name,
            price: price
          });
        }

        if (voucherCode) {
          const voucher = await env.DB.prepare("SELECT * FROM vouchers WHERE code = ?").bind(voucherCode.trim().toUpperCase()).first();
          if (!voucher) {
            return new Response(JSON.stringify({ success: false, message: "Voucher tidak ditemukan" }), { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
          }
          if (!voucher.is_active) {
            return new Response(JSON.stringify({ success: false, message: "Voucher sudah tidak aktif" }), { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
          }
          if (voucher.is_used) {
            return new Response(JSON.stringify({ success: false, message: "Voucher sudah digunakan" }), { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
          }
          appliedVoucher = voucher;
          discountAmount = voucher.amount;
        }

        calculatedTotal -= discountAmount;
        if (calculatedTotal < 0) calculatedTotal = 0;

        // Insert order summary
        statements.push(
          env.DB.prepare(`
            INSERT INTO orders (id, hash, customer_name, customer_phone, customer_address, total_amount, status, payment_method, payment_status, voucher_code, discount_amount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(orderId, orderHash, customer.name, customer.phone, customer.address, calculatedTotal, 'pending', 'qris', 'unpaid', voucherCode ? voucherCode.trim().toUpperCase() : null, discountAmount)
        );

        if (appliedVoucher) {
          statements.push(
            env.DB.prepare("UPDATE vouchers SET is_used = 1 WHERE code = ?").bind(appliedVoucher.code)
          );
        }

        // Insert order items
        for (const item of verifiedItems) {
          statements.push(
            env.DB.prepare(`
              INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
              VALUES (?, ?, ?, ?, ?)
            `).bind(orderId, item.id, item.name, item.price, item.quantity)
          );
        }

        // Execute batch
        await env.DB.batch(statements);

        console.log("Verified order (Turnstile passed) saved to D1:", orderId, "Total:", calculatedTotal);

        // OneSignal Notification
        // try {
        //   await fetch("https://onesignal.com/api/v1/notifications", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json; charset=utf-8",
        //       "Authorization": `Basic ${env.ONESIGNAL_REST_API_KEY}`
        //     },
        //     body: JSON.stringify({
        //       app_id: env.ONESIGNAL_APP_ID,
        //       included_segments: ["Total Subscriptions"],
        //       headings: { en: "Pesanan Baru!" },
        //       contents: { en: `Ada pesanan baru dari ${customer.name} senilai Rp ${calculatedTotal.toLocaleString('id-ID')}` },
        //       url: `https://dapurrempoah.com/admin/orders`
        //     })
        //   });
        // } catch (err) {
        //   console.error("Failed to send OneSignal notification:", err);
        // }

        // Send Telegram Notification
        ctx.waitUntil(sendTelegramMessage(
          `<b>📦 Pesanan Baru!</b>\n\n` +
          `🆔 ID: #${orderId}\n` +
          `👤 Pelanggan: ${customer.name}\n` +
          `📞 WhatsApp: ${customer.phone}\n` +
          `📍 Alamat: ${customer.address}\n` +
          `💰 Total: <b>Rp ${calculatedTotal.toLocaleString('id-ID')}</b>\n\n` +
          `<a href="https://rempoah.my.id/admin/orders">Kelola Pesanan</a>`
        ));

        return new Response(JSON.stringify({
          success: true,
          message: "Order placed successfully",
          orderId,
          hash: orderHash,
          total: calculatedTotal
        }), {
          status: 201,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" },
        });
      } catch (error) {
        console.error("Order Validation/D1 Error:", error);
        return new Response(JSON.stringify({ success: false, message: error.message || "Failed to process order" }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    if (url.pathname.startsWith("/orders/") && request.method === "GET") {
      try {
        const hash = url.pathname.split("/")[2];
        if (!hash) {
          throw new Error("Order hash is required");
        }

        // Get order details
        const order = await env.DB.prepare(`
          SELECT * FROM orders WHERE hash = ?
        `).bind(hash).first();

        if (!order) {
          return new Response(JSON.stringify({ success: false, message: "Order not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        }

        // Get order items
        const { results: items } = await env.DB.prepare(`
          SELECT * FROM order_items WHERE order_id = ?
        `).bind(order.id).all();

        return new Response(JSON.stringify({ success: true, order, items }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    // Product Management Endpoints
    if (url.pathname === "/products" && request.method === "POST") {
      if (!checkAuth()) {
        return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), {
          status: 401,
          headers: corsHeaders
        });
      }
      try {
        const { name, category, price, description, image_url, available } = await request.json();
        const result = await env.DB.prepare(`
          INSERT INTO products (name, category, price, description, image_url, available)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(name, category, price, description || '', image_url || '', available === undefined ? 1 : (available ? 1 : 0)).run();

        return new Response(JSON.stringify({ success: true, message: "Product created", id: result.meta.last_row_id }), {
          status: 201,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    if (url.pathname.startsWith("/products/") && request.method === "PUT") {
      if (!checkAuth()) {
        return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), {
          status: 401,
          headers: corsHeaders
        });
      }
      try {
        const id = url.pathname.split("/")[2];
        const { name, category, price, description, image_url, available } = await request.json();

        await env.DB.prepare(`
          UPDATE products 
          SET name = COALESCE(?, name), 
              category = COALESCE(?, category), 
              price = COALESCE(?, price), 
              description = COALESCE(?, description), 
              image_url = COALESCE(?, image_url), 
              available = COALESCE(?, available)
          WHERE id = ?
        `).bind(name, category, price, description, image_url, available === undefined ? null : (available ? 1 : 0), id).run();

        return new Response(JSON.stringify({ success: true, message: "Product updated" }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    if (url.pathname.startsWith("/products/") && request.method === "DELETE") {
      if (!checkAuth()) {
        return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), {
          status: 401,
          headers: corsHeaders
        });
      }
      try {
        const id = url.pathname.split("/")[2];
        await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();

        return new Response(JSON.stringify({ success: true, message: "Product deleted" }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    // Payment Confirmation endpoint
    if (url.pathname === "/payment-confirmations" && request.method === "POST") {
      try {
        const formData = await request.formData();
        const order_reference = formData.get("order_reference");
        const amount_paid = formData.get("amount_paid");
        const notes = formData.get("notes") || '';
        const payment_date = formData.get("payment_date");
        const turnstileToken = formData.get("turnstileToken");
        const image = formData.get("image");

        // Turnstile verification
        if (!turnstileToken) {
          return new Response(JSON.stringify({ success: false, message: "Missing bot protection token" }), { status: 400, headers: corsHeaders });
        }
        const verifyFormData = new URLSearchParams();
        verifyFormData.append("secret", env.TURNSTILE_SECRET_KEY);
        verifyFormData.append("response", turnstileToken);
        verifyFormData.append("remoteip", request.headers.get("CF-Connecting-IP") || "");

        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          body: verifyFormData,
        });
        const verifyResult = await verifyRes.json();
        if (!verifyResult.success) {
          return new Response(JSON.stringify({ success: false, message: "Bot protection verification failed" }), { status: 403, headers: corsHeaders });
        }

        // Find the order by reference
        let order = await env.DB.prepare("SELECT id FROM orders WHERE id = ?").bind(order_reference).first();
        if (!order) {
          order = await env.DB.prepare("SELECT id FROM orders WHERE hash = ?").bind(order_reference).first();
        }

        if (!order) {
          return new Response(JSON.stringify({ success: false, message: "Order not found" }), { status: 404, headers: corsHeaders });
        }

        // Handle Image Upload
        let image_url = null;
        if (image && typeof image !== 'string' && image.size > 0) {
          if (image.size > 1024 * 1024) {
            return new Response(JSON.stringify({ success: false, message: "Ukuran gambar maksimal 1MB" }), { status: 400, headers: corsHeaders });
          }

          const filename = `proof-${crypto.randomUUID()}-${image.name}`;
          await env.PAYMENT_PROOFS.put(filename, image.stream(), {
            httpMetadata: { contentType: image.type }
          });
          image_url = `/payment-proofs/${filename}`;
        }

        const id = generateFriendlyId('PMT');
        await env.DB.prepare(`
          INSERT INTO payment_confirmations (id, order_id, order_reference, amount_paid, notes, payment_date, status, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(id, order.id, order_reference, amount_paid, notes, payment_date, 0, image_url).run();

        // Update order status to 'confirmation'
        await env.DB.prepare("UPDATE orders SET payment_status = 'confirmation' WHERE id = ?").bind(order.id).run();

        // OneSignal Notification
        // try {
        //   await fetch("https://onesignal.com/api/v1/notifications", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json; charset=utf-8",
        //       "Authorization": `Basic ${env.ONESIGNAL_REST_API_KEY}`
        //     },
        //     body: JSON.stringify({
        //       app_id: env.ONESIGNAL_APP_ID,
        //       included_segments: ["Total Subscriptions"],
        //       headings: { en: "Konfirmasi Pembayaran!" },
        //       contents: { en: `Ada konfirmasi pembayaran baru untuk pesanan ${order_reference}` },
        //       url: `https://dapurrempoah.com/admin/payments`
        //     })
        //   });
        // } catch (err) {
        //   console.error("Failed to send OneSignal notification:", err);
        // }

        // Send Telegram Notification
        ctx.waitUntil(sendTelegramMessage(
          `<b>💸 Konfirmasi Pembayaran!</b>\n\n` +
          `🆔 Referensi: #${order_reference}\n` +
          `💰 Jumlah: <b>Rp ${parseInt(amount_paid).toLocaleString('id-ID')}</b>\n` +
          `📝 Catatan: ${notes || '-'}\n` +
          `📅 Tanggal: ${payment_date}\n\n` +
          `<a href="https://dapurrempoah.com/admin/payments">Lihat Pembayaran</a>`
        ));

        return new Response(JSON.stringify({ success: true, message: "Konfirmasi pembayaran berhasil dikirim", id }), {
          status: 201,
          headers: corsHeaders
        });
      } catch (error) {
        console.error("Payment Confirmation Error:", error);
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500, headers: corsHeaders });
      }
    }

    // Serve payment proofs from R2
    if (url.pathname.startsWith("/payment-proofs/") && request.method === "GET") {
      const filename = url.pathname.split("/")[2];
      const object = await env.PAYMENT_PROOFS.get(filename);

      if (object === null) {
        return new Response("Object Not Found", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("Access-Control-Allow-Origin", "*");

      return new Response(object.body, {
        headers,
      });
    }

    // Admin Payment Confirmation List
    if (url.pathname === "/admin/payment-confirmations" && request.method === "GET") {
      if (!checkAuth()) return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401, headers: corsHeaders });
      try {
        const { results } = await env.DB.prepare("SELECT * FROM payment_confirmations ORDER BY created_at DESC").all();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500, headers: corsHeaders });
      }
    }

    // Admin Payment Confirmation Update
    if (url.pathname.startsWith("/admin/payment-confirmations/") && request.method === "PUT") {
      if (!checkAuth()) return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401, headers: corsHeaders });
      try {
        const id = url.pathname.split("/")[3];
        const { status, validity } = await request.json();

        await env.DB.prepare(`
          UPDATE payment_confirmations 
          SET status = COALESCE(?, status), 
              validity = COALESCE(?, validity)
          WHERE id = ?
        `).bind(status === undefined ? null : status, validity === undefined ? null : validity, id).run();

        return new Response(JSON.stringify({ success: true, message: "Payment confirmation updated" }), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500, headers: corsHeaders });
      }
    }

    // Admin Order List
    if (url.pathname === "/admin/orders" && request.method === "GET") {
      if (!checkAuth()) return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401, headers: corsHeaders });
      try {
        const { results } = await env.DB.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500, headers: corsHeaders });
      }
    }

    // Admin Order Update
    if (url.pathname.startsWith("/admin/orders/") && request.method === "PUT") {
      if (!checkAuth()) return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401, headers: corsHeaders });
      try {
        const id = url.pathname.split("/")[3];
        const { status, payment_status, shipping_fee, additional_fee } = await request.json();

        if (shipping_fee !== undefined || additional_fee !== undefined) {
          const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first();
          if (!order) {
            return new Response(JSON.stringify({ success: false, message: "Order not found" }), { status: 404, headers: corsHeaders });
          }

          const items = await env.DB.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(id).all();
          const itemsBaseTotal = items.results.reduce((acc, item) => acc + (item.price * item.quantity), 0);
          
          const newShipping = shipping_fee !== undefined ? shipping_fee : (order.shipping_fee || 0);
          const newAdditional = additional_fee !== undefined ? additional_fee : (order.additional_fee || 0);
          
          let calculatedTotal = itemsBaseTotal - (order.discount_amount || 0) + newShipping + newAdditional;
          if (calculatedTotal < 0) calculatedTotal = 0;

          await env.DB.prepare(`
            UPDATE orders 
            SET status = COALESCE(?, status), 
                payment_status = COALESCE(?, payment_status),
                shipping_fee = ?,
                additional_fee = ?,
                total_amount = ?
            WHERE id = ?
          `).bind(
            status === undefined ? null : status, 
            payment_status === undefined ? null : payment_status, 
            newShipping, 
            newAdditional, 
            calculatedTotal, 
            id
          ).run();
        } else {
          await env.DB.prepare(`
            UPDATE orders 
            SET status = COALESCE(?, status), 
                payment_status = COALESCE(?, payment_status)
            WHERE id = ?
          `).bind(status === undefined ? null : status, payment_status === undefined ? null : payment_status, id).run();
        }

        return new Response(JSON.stringify({ success: true, message: "Order updated" }), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response("Not Found", {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });
  },
};
