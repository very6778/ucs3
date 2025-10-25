import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = new SupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                
                const { data: user, error } = await supabase
                    .from("admins")
                    .select("*")
                    .eq("email", credentials.email)
                    .single();

                if (error || !user) {
                    throw new Error("Invalid credentials");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("Invalid credentials");
                }

                return { id: user.id, email: user.email };
            },
        }),
    ],
    callbacks: {
        // @ts-ignore AuthOptions Error

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        // @ts-ignore AuthOptions Error

        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
};