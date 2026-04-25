const MENU_DATA = [
  {
    id: 1,
    name: "Ayam Rempah Jelantah",
    category: "makanan",
    price: 25000,
    description: "Ayam goreng rempah khas Rempoah dengan bumbu rahasia yang meresap.",
    image_url: "https://images.unsplash.com/photo-1562607311-54bc72273617?q=80&w=400&h=300&auto=format&fit=crop",
    available: true
  },
  {
    id: 2,
    name: "Nasi Goreng Rempoah",
    category: "makanan",
    price: 22000,
    description: "Nasi goreng dengan aroma rempah yang kuat dan telur mata sapi.",
    image_url: "https://images.unsplash.com/photo-1512058560366-cd2429ff5c7c?q=80&w=400&h=300&auto=format&fit=crop",
    available: true
  },
  {
    id: 3,
    name: "Es Teh Manis Rempah",
    category: "minuman",
    price: 8000,
    description: "Teh manis segar dengan sentuhan kayu manis dan cengkeh.",
    image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=400&h=300&auto=format&fit=crop",
    available: true
  },
  {
    id: 4,
    name: "Kopi Susu Gula Aren",
    category: "minuman",
    price: 18000,
    description: "Kopi susu creamy dengan pemanis gula aren alami.",
    image_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400&h=300&auto=format&fit=crop",
    available: true
  },
  {
    id: 5,
    name: "Tempe Mendoan",
    category: "camilan",
    price: 12000,
    description: "Tempe goreng tepung khas Banyumas, disajikan hangat dengan sambal kecap.",
    image_url: "https://images.unsplash.com/photo-1626002061266-9e6b4f728fa5?q=80&w=400&h=300&auto=format&fit=crop",
    available: true
  },
  {
    id: 6,
    name: "Pisang Goreng Madu",
    category: "camilan",
    price: 15000,
    description: "Pisang goreng manis dengan karamelisasi madu yang legit.",
    image_url: "https://images.unsplash.com/photo-1634818462211-373909786638?q=80&w=400&h=300&auto=format&fit=crop",
    available: false
  }
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (url.pathname === "/menu" && request.method === "GET") {
      return new Response(JSON.stringify(MENU_DATA), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
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

        // 2. Validate items... (rest of the logic remains the same)
        if (!items || !Array.isArray(items) || items.length === 0) {
          throw new Error("Order must contain at least one item");
        }
        
        // (Existing validation and D1 logic continues here)
        const orderId = `ORD-${Date.now()}`;
        const statements = [];
        let calculatedTotal = 0;
        const verifiedItems = [];

        // Validate items and calculate total on backend
        for (const item of items) {
          const menuProduct = MENU_DATA.find(p => p.id === item.id);
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
            INSERT INTO orders (id, customer_name, customer_phone, customer_address, total_amount)
            VALUES (?, ?, ?, ?, ?)
          `).bind(orderId, customer.name, customer.phone, customer.address, calculatedTotal)
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

        return new Response(JSON.stringify({ success: true, message: "Order placed successfully", orderId, total: calculatedTotal }), {
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

    return new Response("Not Found", { 
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });
  },
};
