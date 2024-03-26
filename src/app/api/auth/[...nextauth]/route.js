import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
//import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import clientPromise from "@/app/lib/mongodb";
// import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import connect from "@/lib/db";
import bcrypt from "bcryptjs";

const handler = NextAuth({
 // adapter: MongoDBAdapter(clientPromise),
  providers: [
   // GoogleProvider({
   //   clientId: process.env.GOOGLE_ID,
   //   clientSecret: process.env.GOOGLE_SECRET,
   //     authorization: {
   //       params: {
   //         prompt: "consent",
   //         access_type: "offline",
   //         response_type: "code"
   //       }
   //     }
   // }), 
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

   //  credentials: {
   //    email: { label: "Kamu", type: "email" },
   //    password: { label: "Kontol", type: "password" },
   //  },

      async authorize(credentials) {
        // Check if the user exists.
        await connect();

        try {
          const user = await User.findOne({
            email: credentials.email,
          });

          if (!user) {
            throw new Error("User not found!");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordCorrect) {
            throw new Error("Wrong Credentials!");
          }

          // Include the user ID in the session object
          return user;
        } catch (err) {
          console.error("Authorization error:", err.message);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.userId = user._id;
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user.role = token.role;
      session.user._id = token.userId;

      return session;
    },
  },
});

export { handler as GET, handler as POST };
