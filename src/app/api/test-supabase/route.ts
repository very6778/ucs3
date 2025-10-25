import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ 
        error: "NEXT_PUBLIC_SUPABASE_URL is missing",
        env: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
      }, { status: 500 });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        error: "SUPABASE_SERVICE_ROLE_KEY is missing",
        env: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
      }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Test connection by trying to fetch from galleries table
    const { data, error } = await supabase
      .from("galleries")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ 
        error: "Supabase query failed", 
        details: error.message,
        hint: error.hint,
        code: error.code
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Supabase connection working", 
      dataCount: data?.length || 0,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL
    });

  } catch (err: any) {
    console.error("Test Supabase Error:", err);
    return NextResponse.json({ 
      error: "Internal server error",
      message: err.message,
      stack: err.stack
    }, { status: 500 });
  }
}