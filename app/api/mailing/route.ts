// app/api/mailing/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role for inserts
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email } = body;

    if (!firstName || !email) {
      return NextResponse.json(
        { error: "First name (or business name) and email are required" },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { error } = await supabase.from("mailing_list").insert([
      {
        first_name: firstName,
        last_name: lastName || null,
        email,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);

      // Friendly error messages
      if (
        error.message.includes("duplicate key value") ||
        error.code === "23505" // Postgres unique violation
      ) {
        return NextResponse.json(
          { error: "This email is already subscribed." },
          { status: 400 }
        );
      }

      if (error.message.includes("Could not find the table")) {
        return NextResponse.json(
          { error: "Subscription service is not set up. Please try again later." },
          { status: 500 }
        );
      }

      // fallback
      return NextResponse.json(
        { error: "Something went wrong. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Subscribed successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Mailing API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
