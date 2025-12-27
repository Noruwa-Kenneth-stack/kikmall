import nodemailer from 'nodemailer'

export function generateVerificationCode (length: number = 6): string {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10).toString()
  }
  return code
}

export async function sendVerificationEmail (email: string, code: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const mailOptions = {
    from: `"KIK Mall" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your KIK Mall Verification Code',
    html: `
     <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>
</head>
<body style="background-color:#f7f8fa; font-family:Arial, Helvetica, sans-serif; margin:0; padding:0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f7f8fa; padding:40px 0;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" 
          style="background:#ffffff; border-radius:8px; box-shadow:0 4px 16px rgba(0,0,0,0.08); padding:40px;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <img src="/images/Kik Logo.jpg" alt="KIK Logo" width="120" style="display:block;" />
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="font-size:22px; font-weight:bold; color:#333; padding-bottom:10px;">
              Your Verification Code
            </td>
          </tr>

          <!-- Code Box -->
          <tr>
            <td align="center" 
              style="background:#f5f5f5; padding:20px 30px; margin:20px 0; font-size:32px; 
              font-weight:bold; color:#000; border-radius:6px; letter-spacing:3px;">
              ${code}
            </td>
          </tr>

          <!-- Info Text -->
          <tr>
            <td align="center" style="font-size:14px; color:#555; padding-top:15px; line-height:22px;">
              This request was made from the <strong>KIK Mall</strong> app.<br/>
              If this wasn’t you, please ignore this email.
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="font-size:12px; color:#aaa; padding-top:25px;">
              &copy; ${new Date().getFullYear()} KIK Mall. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }

  await transporter.sendMail(mailOptions)
}
