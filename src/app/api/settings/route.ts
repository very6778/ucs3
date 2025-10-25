import { NextResponse } from "next/server"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

// Create a function to initialize Supabase client only when needed
function getSupabaseClient(): SupabaseClient {
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

const providerUrlMap: Record<string, string> = {
  "default": "https://066e9a4f-a.b-cdn.net"
}

export async function GET() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("settings")
    .select("isCDNEnabled, CDNUrl")
    .eq("id", 1)
    .single()

  if (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }

  let cdnProvider: string | null = null
  if (data.CDNUrl) {
    for (const [provider, url] of Object.entries(providerUrlMap)) {
      if (data.CDNUrl === url) {
        cdnProvider = provider
        break
      }
    }
  }

  return NextResponse.json({
    cdnEnabled: data.isCDNEnabled,
    cdnUrl: data.CDNUrl || null,
    cdnProvider,
  })
}

export async function POST(request: Request) {
  // @ts-ignore AuthOptions Error
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseClient();
    const body = await request.json()
    
    let cdnUrl = ""
    if (body.cdnEnabled && body.cdnProvider) {
      cdnUrl = providerUrlMap[body.cdnProvider]
      if (!cdnUrl) {
        return NextResponse.json({ error: "Invalid CDN provider" }, { status: 400 })
      }
    }

    const { error } = await supabase
      .from("settings")
      .update({
        isCDNEnabled: !!body.cdnEnabled,
        CDNUrl: cdnUrl,
      })
      .eq("id", 1)

    if (error) {
      console.error("Error updating settings:", error)
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      settings: {
        cdnEnabled: !!body.cdnEnabled,
        cdnUrl: cdnUrl || null,
        cdnProvider: body.cdnEnabled ? body.cdnProvider : null,
      },
    })
  } catch (error) {
    console.error("Error in POST handler:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}