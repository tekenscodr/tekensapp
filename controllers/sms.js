const sendSms = async (msg, phoneNumber) => {
    try {
      const url = `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${process.env.SMS_API_KEY}&to=${phoneNumber}&from=Tekens&sms=${msg}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error sending SMS: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  
  const sendScannerCode = async (phoneNumber, otp, eventName) => {
    try {
      const msg = `You have been selected to be a scanning agent for ${eventName}. \n Your code is ${otp}`;
      await sendSms(msg, phoneNumber);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };