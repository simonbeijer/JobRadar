import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";

const SECRET = process.env.JWT_SECRET!;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(SECRET)
    );
    return NextResponse.json({ user: payload }, { status: 200 });
  } catch (error) {
    console.log("Error auth user ", error);
    return NextResponse.json(
      { user: null, message: "Invalid token" },
      { status: 401 }
    );
  }
}
