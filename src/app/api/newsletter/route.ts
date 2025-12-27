import { NextResponse } from "next/server";
import { ContactsApi, CreateContact } from "@getbrevo/brevo";
import nodemailer from "nodemailer";

// ---------------------------
// Welcome Email Template
// ---------------------------
const welcomeEmailTemplate = () => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Welcome to Kikmall</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f7fb;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.05);padding:30px;">
          <tr>
            <td align="center">
              <img src="https://kikmall.com/logo/kikhub.png" alt="Kikmall Logo" width="120" style="margin-bottom:20px;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="color:#203289;font-size:26px;font-weight:bold;padding-bottom:10px;">
              🎉 Welcome to Kikmall!
            </td>
          </tr>
          <tr>
            <td align="center" style="color:#555;font-size:16px;padding-bottom:20px;">
              Hi there 👋, thanks for subscribing to our newsletter!
            </td>
          </tr>
          <tr>
            <td align="center" style="color:#444;font-size:15px;line-height:24px;padding:0 30px;">
              You’re now part of the Kikmall family! 🎊<br/>
              From now on, you’ll get <b>exclusive discounts</b>, early access to sales, and <b>special promotions</b> straight to your inbox.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:30px 0;">
              <a href="https://kikmall.com" target="_blank" style="background-color:#203289;color:#fff;padding:12px 25px;border-radius:6px;text-decoration:none;font-size:16px;font-weight:bold;">
                🛍 Start Shopping
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:15px 0;border-top:1px solid #eee;"></td>
          </tr>
          <tr>
            <td align="center" style="color:#999;font-size:12px;padding-top:10px;">
              You are receiving this email because you subscribed on our website.<br/>
              If this wasn't you, you can safely ignore this email.
            </td>
          </tr>
          <tr>
            <td align="center" style="color:#aaa;font-size:11px;padding-top:10px;">
              &copy; ${new Date().getFullYear()} Kikmall. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ---------------------------
// POST /api/subscribe
// ---------------------------
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : null;

    if (!normalizedEmail || !normalizedEmail.includes("@") || !normalizedEmail.includes(".")) {
      return NextResponse.json({ message: "Please provide a valid email address" }, { status: 400 });
    }

    const contactsApi = new ContactsApi();
    contactsApi.setApiKey(0, process.env.BREVO_API_KEY!);
    const listId = Number(process.env.BREVO_LIST_ID);

    let isNewSubscriber = false;

    // ---------------------------
    // Check if contact exists
    // ---------------------------
    try {
      const existing = await contactsApi.getContactInfo(normalizedEmail);
      if (!existing.body.listIds?.includes(listId)) {
        isNewSubscriber = true;
        console.log("Existing contact, not in list → will be added");
      } else {
        console.log("Email already subscribed");
      }
      //eslint-disable-next-line
    } catch (err: any) {
      if (err.response?.status === 404) {
        isNewSubscriber = true;
        console.log("New subscriber");
      } else {
        console.error("Brevo API check failed:", err);
        return NextResponse.json({ message: "Failed to verify subscription." }, { status: 500 });
      }
    }

    // ---------------------------
    // Add contact to list
    // ---------------------------
    const contact = new CreateContact();
    contact.email = normalizedEmail;
    contact.listIds = [listId];

    try {
      await contactsApi.createContact(contact);
      console.log("Contact added to Brevo list");
      //eslint-disable-next-line
    } catch (err: any) {
      if (err.response?.body?.code === "duplicate_parameter") {
        console.log("Email already exists, skipping create");
      } else {
        throw err;
      }
    }

    // ---------------------------
    // Send welcome email ONLY to new subscribers
    // ---------------------------
    if (isNewSubscriber) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST!,
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        auth: { user: process.env.EMAIL_USER!, pass: process.env.EMAIL_PASS! },
      });

      await transporter.sendMail({
        from: `"Kikmall" <${process.env.EMAIL_USER}>`,
        to: normalizedEmail,
        subject: "🎉 Welcome to Kikmall!",
        html: welcomeEmailTemplate(),
      });

      console.log("Welcome email sent to:", normalizedEmail);
    }

    return NextResponse.json({
      message: isNewSubscriber
        ? "Welcome! You're subscribed and email sent 🎉"
        : "You're already subscribed — welcome back! 👋",
    }, { status: 200 });
//eslint-disable-next-line
  } catch (error: any) {
    console.error("Subscription route error:", error);
    return NextResponse.json({ message: "Email already subscribed." }, { status: 500 });
  }
}
