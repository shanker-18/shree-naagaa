import emailjs from "@emailjs/browser";

// Test function to send a sample email
export const testEmailJS = async () => {
  try {
    console.log("🧪 Testing EmailJS with sample data...");
    
    const sampleOrder = {
      id: "TEST-ORDER-123",
      customerName: "Test Customer",
      customerPhone: "+91 9876543210",
      customerAddress: "123 Test Street, Test City, 123456",
      items: [
        { name: "Test Product 1", qty: 2 },
        { name: "Test Product 2", qty: 1 }
      ],
      totalPrice: "₹1500",
      paymentStatus: "Paid",
      deliveryDate: "2024-01-15"
    };

    await sendWarehouseEmail(sampleOrder);
    console.log("✅ Test email sent successfully!");
  } catch (err) {
    console.error("❌ Test email failed:", err);
  }
};

export const sendWarehouseEmail = async (order: any) => {
  try {
    // Debug: Log EmailJS configuration
    console.log("🔍 EmailJS Configuration:");
    console.log("Service ID: service_lfndsjx");
    console.log("Template ID: template_xdvaj0r");
    console.log("Public Key: _PAsQMMBy-RHc5NZL ✅ Set");
    
    await emailjs.send(
      "service_lfndsjx", // 👈 Hardcoded for quick test
      "template_xdvaj0r", // 👈 Hardcoded for quick test
      {
        order_id: order.id,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        delivery_address: order.customerAddress,
        order_items: order.items.map((i: any) => `- ${i.name} x ${i.qty}`).join("\n"),
        total_price: order.totalPrice,
        payment_status: order.paymentStatus,
        delivery_date: order.deliveryDate,
      },
      "_PAsQMMBy-RHc5NZL" // 👈 Hardcoded for quick test
    );
    console.log("✅ Warehouse email sent");
  } catch (err) {
    console.error("❌ Error sending warehouse email:", err);
  }
};