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

    return new Response("Not Found", { 
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });
  },
};
