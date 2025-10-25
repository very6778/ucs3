import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

// Create a function to initialize Supabase client only when needed
function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

async function authenticate(req: Request) {
  // @ts-ignore AuthOptions Error
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}


export async function GET(req: Request) {
  const session = await authenticate(req);
  if (session instanceof NextResponse) return session;

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("admins").select("id, email");

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await authenticate(req);
  if (session instanceof NextResponse) return session;

  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase.from("admins").update({ password: hashedPassword }).eq("email", email);

    if (error) throw error;

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await authenticate(req);
  if (session instanceof NextResponse) return session;

  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.from("admins").delete().eq("email", email);
    if (error) throw error;

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await authenticate(req);
  if (session instanceof NextResponse) return session;

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase.from("admins").insert([{ email, password: hashedPassword }]);

    if (error) throw error;

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}