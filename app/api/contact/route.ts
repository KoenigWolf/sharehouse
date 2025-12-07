import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, type } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("RESEND_API_KEY not configured. Message details:", { name, email, type });
      return NextResponse.json(
        { error: "メール送信サービスが設定されていません。管理者に直接連絡してください。" },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);

    const subject =
      type === "invite"
        ? `【シェアハウス】アカウント登録依頼: ${name}`
        : `【シェアハウス】お問い合わせ: ${name}`;

    const { error } = await resend.emails.send({
      from: "ShareHouse <noreply@resend.dev>",
      to: "creatorsoasis@outlook.com",
      subject,
      replyTo: email,
      text: `
名前: ${name}
メールアドレス: ${email}
種別: ${type === "invite" ? "アカウント登録依頼" : "お問い合わせ"}

メッセージ:
${message}
      `.trim(),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json(
      { error: "メッセージの送信に失敗しました" },
      { status: 500 }
    );
  }
}
