import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// @ts-ignore AuthOptions Error

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };