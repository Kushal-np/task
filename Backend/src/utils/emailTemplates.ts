export const emailTemplates = {
  verificationOtp: (otp: string) => ({
    subject: "Verify Your Feddit Account",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff4500; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .otp { font-size: 32px; font-weight: bold; color: #ff4500; text-align: center; letter-spacing: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Feddit!</h1>
            </div>
            <div class="content">
              <p>Thank you for registering! Please use the following OTP to verify your email:</p>
              <p class="otp">${otp}</p>
              <p>This OTP will expire in 10 minutes.</p>
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Feddit. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  resetPasswordOtp: (otp: string) => ({
    subject: "Reset Your Feddit Password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff4500; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .otp { font-size: 32px; font-weight: bold; color: #ff4500; text-align: center; letter-spacing: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>We received a request to reset your password. Use the following OTP:</p>
              <p class="otp">${otp}</p>
              <p>This OTP will expire in 10 minutes.</p>
              <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Feddit. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

