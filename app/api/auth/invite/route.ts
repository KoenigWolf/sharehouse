import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/src/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: resident } = await supabase
      .from("residents")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!resident || resident.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can invite users" },
        { status: 403 }
      );
    }

    const { email, roomNumber, floor } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    const { data, error } = await adminClient.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: `${request.nextUrl.origin}/auth/accept-invite`,
        data: {
          room_number: roomNumber,
          floor: floor,
        },
      }
    );

    if (error) {
      console.error("Invite error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: data.user,
    });
  } catch (error) {
    console.error("Invite error:", error);
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    );
  }
}
