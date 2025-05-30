// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const res = await fetch(
            `https://custom-gpt-backend-sigma.vercel.app/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Invalid email or password");
          }

          if (!data.user.isVerified) {
            throw new Error("Please verify your email before logging in");
          }

          if (data.user && data.token) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              active: data.user.active,
              isVerified: data.user.isVerified,
              token: data.token,
            };
          }

          throw new Error("No user or token returned from backend");
        } catch (error) {
          console.error("Authorize error:", error.message);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const checkRes = await fetch(
            `https://custom-gpt-backend-sigma.vercel.app/api/auth/check-user`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: user.email }),
            }
          );

          const checkData = await checkRes.json();

          if (checkRes.ok && checkData.user) {
            if (!checkData.user.isVerified) {
              return `/login?error=${encodeURIComponent(
                "Please verify your email before logging in"
              )}`;
            }
            user.id = checkData.user.id;
            user.token = checkData.token;
            user.role = checkData.user.role;
            user.active = checkData.user.active;
            user.isVerified = checkData.user.isVerified;
            return true;
          } else {
            const registerRes = await fetch(
              `https://custom-gpt-backend-sigma.vercel.app/api/auth/register`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: user.email,
                  name: user.name,
                  
                  googleId: account.providerAccountId,
                  image: user.image,
                  provider: "google",
                }),
              }
            );

            const registerData = await registerRes.json();
            if (!registerRes.ok) {
              return `/login?error=${encodeURIComponent(
                registerData.message || "Failed to register Google user"
              )}`;
            }

            // For Google users, no email verification is needed (isVerified: true)
            user.id = registerData.user.id;
            user.token = registerData.token;
            user.role = registerData.user.role;
            user.active = registerData.user.active;
            user.isVerified = registerData.user.isVerified;
            return true;
          }
        } catch (error) {
          console.error("Google sign-in error:", error);
          return `/login?error=${encodeURIComponent(error.message)}`;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
        token.role = user.role;
        token.active = user.active;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        token: token.accessToken,
        role: token.role,
        active: token.active,
        isVerified: token.isVerified,
      };
      session.sync = true;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };