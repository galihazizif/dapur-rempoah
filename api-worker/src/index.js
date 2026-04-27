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
        const { customer, items, turnstileToken } = orderData;

        const orderId = crypto.randomUUID();
        const orderHash = Math.random().toString(36).substring(2, 12);
        let calculatedTotal = 0;
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

        // Insert order summary
        statements.push(
          env.DB.prepare(`
            INSERT INTO orders (id, hash, customer_name, customer_phone, customer_address, total_amount, status, payment_method, payment_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(orderId, orderHash, customer.name, customer.phone, customer.address, calculatedTotal, 'pending', 'qris', 'unpaid')
        );

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

        const id = crypto.randomUUID();
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
        const { status, payment_status } = await request.json();

        await env.DB.prepare(`
          UPDATE orders 
          SET status = COALESCE(?, status), 
              payment_status = COALESCE(?, payment_status)
          WHERE id = ?
        `).bind(status === undefined ? null : status, payment_status === undefined ? null : payment_status, id).run();

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
