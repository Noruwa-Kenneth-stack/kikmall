import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, message: "No code provided" },
        { status: 400 }
      );
    }

    // 1. Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    const { access_token } = tokenData;

    if (!access_token) {
      return NextResponse.json(
        { success: false, message: "Failed to get Google tokens" },
        { status: 400 }
      );
    }

    // 2. Get Google user profile
    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const profile = await profileRes.json();

    await connectDB();

    // 3. Find or create user
    let user = await User.findOne({ email: profile.email });

    if (!user) {
      user = await User.create({
        email: profile.email,
        password: null,
        name: profile.name,
        picture: profile.picture,
        isVerified: true,
        termsAccepted: true,
        provider: "google",
      });

      // New Google user = must accept terms
      user.termsAccepted = true;
      await user.save();
    } else {
      let updated = false;

      if (!user.name) {
        user.name = profile.name;
        updated = true;
      }

      if (!user.picture) {
        user.picture = profile.picture;
        updated = true;
      }

      if (updated) await user.save();
    }

    // 5. Issue JWT
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET missing in env");
      return NextResponse.json(
        { success: false, message: "Server config error" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        termsAccepted: user.termsAccepted,

      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

console.log("TOKEN DATA:", tokenData);
console.log("PROFILE RESPONSE STATUS:", profileRes.status);
console.log("PROFILE:", profile);


    // 6. Prepare response and set cookie
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/success`
    );

    response.headers.append(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }; SameSite=Strict${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );

    return response;
  } catch (error) {
    console.error("GOOGLE OAUTH ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Google login failed" },
      { status: 500 }
    );
  }
}
