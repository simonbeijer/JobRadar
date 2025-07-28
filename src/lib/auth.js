import * as jose from "jose";

const SECRET = process.env.JWT_SECRET;

export async function verifyAuth(token) {
  if (!token) throw new Error("Missing token");

  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(SECRET)
    );
    return payload;
  } catch (err) {
    throw new Error("Invalid or expired token", err);
  }
}
