import { API_ENDPOINTS } from '../config/api';

// WhatsApp service configuration
const TWILIO_CONFIG = {
  // These will be set in your environment variables
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '', // Server-side only
  whatsappNumber: import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886', // Twilio sandbox number
  warehouseNumber: '+917305391377', // Primary warehouse WhatsApp number
  secondaryNumber: '+919025085523', // Secondary WhatsApp number for order processing
  orderProcessingNumbers: [ // Array of all numbers to receive order notifications
    '+917305391377', // Primary warehouse
    '+919025085523'  // Secondary order processing
  ]
};

// Interface for order data
interface WhatsAppOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    name: string;
    qty: number;
    price?: number;
    weight?: string;
  }>;
  totalPrice: string | number;
  paymentStatus: string;
  deliveryDate: string;
}

// Format order details for WhatsApp message
export const formatWhatsAppMessage = (order: WhatsAppOrder): string => {
  const items = order.items.map((item, index) => {
    let itemText = `${index + 1}. ${item.name} x${item.qty}`;
    if (item.weight) {
      itemText += ` (${item.weight})`;
    }
    if (item.price && item.price > 0) {
      itemText += ` - ₹${item.price}`;
    } else {
      itemText += ' - Free Sample';
    }
    return itemText;
  }).join('\n');

  const message = `🛍️ *NEW ORDER RECEIVED*

📋 *Order Details:*
Order ID: ${order.id}
Customer: ${order.customerName}
Phone: ${order.customerPhone}
Payment: ${order.paymentStatus}
Expected Delivery: ${order.deliveryDate}

📦 *Items Ordered:*
${items}

💰 *Total Amount: ₹${order.totalPrice}*

📍 *Delivery Address:*
${order.customerAddress}

---
Please process this order and update the customer accordingly.`;

  return message;
};

// Send WhatsApp message using Twilio API (server-side)
export const sendWhatsAppToWarehouse = async (order: WhatsAppOrder) => {
  try {
    console.log('📱 Preparing to send WhatsApp message to warehouse...');
    
    // Format the message
    const message = formatWhatsAppMessage(order);
    console.log('📝 WhatsApp message formatted:', message);

    // Prepare the API request payload
    const whatsappPayload = {
      from: TWILIO_CONFIG.whatsappNumber,
      to: `whatsapp:${TWILIO_CONFIG.warehouseNumber}`,
      body: message,
      order: order // Include order details for backend processing
    };

    console.log('🚀 Sending WhatsApp via backend API...');
    
    // Check if WhatsApp endpoint is configured
    if (!API_ENDPOINTS.WHATSAPP || API_ENDPOINTS.WHATSAPP.includes('undefined')) {
      console.warn('⚠️ WhatsApp API endpoint not configured, skipping WhatsApp notification');
      return { success: false, error: 'WhatsApp API endpoint not configured' };
    }

    // Send via your backend API
    const response = await fetch(API_ENDPOINTS.WHATSAPP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(whatsappPayload)
    });

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ WhatsApp message sent successfully:', result);
    
    return { success: true, result };
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error);
    return { success: false, error };
  }
};

// Send WhatsApp messages to multiple numbers for order processing
export const sendWhatsAppToMultipleNumbers = async (order: WhatsAppOrder) => {
  try {
    console.log('📱 Preparing to send WhatsApp messages to multiple numbers...');
    
    // Check if WhatsApp endpoint is configured
    if (!API_ENDPOINTS.WHATSAPP || API_ENDPOINTS.WHATSAPP.includes('undefined')) {
      console.warn('⚠️ WhatsApp API endpoint not configured, skipping multiple WhatsApp notifications');
      return { 
        success: false, 
        error: 'WhatsApp API endpoint not configured',
        results: [],
        errors: [],
        summary: { total: 0, successful: 0, failed: 0 }
      };
    }
    
    // Format the message
    const message = formatWhatsAppMessage(order);
    console.log('📝 WhatsApp message formatted for multiple recipients');

    const results = [];
    const errors = [];

    // Send to all order processing numbers
    for (const phoneNumber of TWILIO_CONFIG.orderProcessingNumbers) {
      try {
        console.log(`📱 Sending WhatsApp to ${phoneNumber}...`);
        
        // Prepare the API request payload for each number
        const whatsappPayload = {
          from: TWILIO_CONFIG.whatsappNumber,
          to: `whatsapp:${phoneNumber}`,
          body: message,
          order: order,
          recipient: phoneNumber
        };

        // Send via your backend API
        const response = await fetch(API_ENDPOINTS.WHATSAPP, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(whatsappPayload)
        });

        if (!response.ok) {
          throw new Error(`WhatsApp API error for ${phoneNumber}: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log(`✅ WhatsApp message sent successfully to ${phoneNumber}:`, result);
        
        results.push({ 
          phoneNumber, 
          success: true, 
          result 
        });
        
        // Add a small delay between messages to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error sending WhatsApp message to ${phoneNumber}:`, error);
        errors.push({ 
          phoneNumber, 
          success: false, 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    const successCount = results.length;
    const totalCount = TWILIO_CONFIG.orderProcessingNumbers.length;
    
    console.log(`📊 WhatsApp delivery summary: ${successCount}/${totalCount} messages sent successfully`);
    
    return { 
      success: successCount > 0, // Success if at least one message was sent
      results,
      errors,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: errors.length
      }
    };
  } catch (error) {
    console.error('❌ Error in sendWhatsAppToMultipleNumbers:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      results: [],
      errors: [],
      summary: { total: 0, successful: 0, failed: 0 }
    };
  }
};

// Enhanced function that tries multiple numbers and falls back to single number
export const sendOrderNotificationWhatsApp = async (order: WhatsAppOrder) => {
  console.log('📱 Starting enhanced WhatsApp order notification...');
  
  // First try to send to multiple numbers
  const multipleResult = await sendWhatsAppToMultipleNumbers(order);
  
  if (multipleResult.success && multipleResult.summary.successful > 0) {
    console.log(`✅ Order notification sent successfully to ${multipleResult.summary.successful} WhatsApp numbers`);
    return multipleResult;
  }
  
  // If multiple number sending failed, fallback to original single number method
  console.log('⚠️ Multiple number sending failed, falling back to single number...');
  const singleResult = await sendWhatsAppToWarehouse(order);
  
  return {
    success: singleResult.success,
    fallback: true,
    singleResult,
    multipleResult
  };
};

// Test function to verify WhatsApp integration
export const testWhatsApp = async () => {
  const testOrder: WhatsAppOrder = {
    id: 'TEST-ORDER-' + Date.now(),
    customerName: 'Test Customer',
    customerPhone: '+91 9876543210',
    customerAddress: '123 Test Street, Test City, Test State - 123456',
    items: [
      { name: 'Turmeric Powder', qty: 1, price: 150, weight: '100g' },
      { name: 'Free Sample - Red Chili Powder', qty: 1, price: 0, weight: '50g' }
    ],
    totalPrice: 150,
    paymentStatus: 'Confirmed',
    deliveryDate: '3-5 business days'
  };

  console.log('🧪 Testing WhatsApp integration...');
  return await sendWhatsAppToWarehouse(testOrder);
};
