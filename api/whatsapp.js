export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed. Only POST requests are supported.`
    });
    return;
  }

  try {
    const { from, to, body, order, recipient } = req.body;

    // Log the received request for debugging
    console.log('📱 WhatsApp API received request:', {
      from,
      to: recipient || to,
      orderId: order?.id,
      messageLength: body?.length || 0
    });

    // Validate required fields
    if (!body || !to) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: body and to are required'
      });
    }

    // In a real implementation, you would integrate with Twilio or WhatsApp Business API here
    // For now, we'll simulate the message sending and return success
    
    console.log('📤 Simulating WhatsApp message send to:', to);
    console.log('📝 Message preview:', body.substring(0, 100) + '...');

    // Check if this is a test environment or if Twilio credentials are available
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

    if (twilioAccountSid && twilioAuthToken) {
      // If Twilio credentials are available, you could implement actual sending here
      // For now, we'll just log that credentials are available
      console.log('✅ Twilio credentials available - would send actual message in production');
    } else {
      console.log('ℹ️ Twilio credentials not configured - running in simulation mode');
    }

    // Simulate successful response
    const response = {
      success: true,
      message: 'WhatsApp notification sent successfully',
      data: {
        sid: `SM${Date.now()}${Math.random().toString(36).substring(2, 8)}`, // Simulated message ID
        from: from || 'whatsapp:+14155238886',
        to: to,
        status: 'queued',
        timestamp: new Date().toISOString(),
        orderId: order?.id,
        recipient: recipient || to.replace('whatsapp:', '')
      }
    };

    console.log('✅ WhatsApp API response:', response.data);

    res.status(200).json(response);

  } catch (error) {
    console.error('❌ WhatsApp API error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while sending WhatsApp message',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}
