
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { Resend } from "resend";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing in .env.local");
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

// const resend = new Resend(process.env.RESEND_API_KEY);

async sendVerificationEmail({ user, url }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing");
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from:
      process.env.EMAIL_FROM ||
      "BazarDor <onboarding@resend.dev>",
    to: user.email,
    subject: "Verify your BazarDor email",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to BazarDor!</h2>
        <p>Please verify your email address to activate your account.</p>
        <p><a href="${url}">Verify Email</a></p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error.message);
    throw new Error("Could not send verification email.");
  }
},


export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  database: pool,

  emailAndPassword: {
    enabled: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    async sendVerificationEmail({ user, url }) {
      if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is missing in .env.local");
      }

      const { error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || "BazarDor <onboarding@resend.dev>",
        to: user.email,
        subject: "Verify your BazarDor email",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Welcome to BazarDor!</h2>
            <p>Please verify your email address to activate your account.</p>
            <p>
              <a href="${url}"
                 style="display:inline-block;padding:12px 20px;background:#15803d;color:#fff;text-decoration:none;border-radius:8px;">
                Verify Email
              </a>
            </p>
            <p>If you did not create this account, you can ignore this email.</p>
          </div>
        `,
      });

      if (error) {
        throw new Error("Could not send verification email.");
      }
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      disableImplicitLinking: false,
    },
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),

    ...(process.env.GITHUB_CLIENT_ID &&
    process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },
});
