/** @type { import("drizzle-kit").Config } */
export default {
    dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
    schema: "./utils/schema.js",
    out: "./drizzle",
    dbCredentials: {
      url: "postgresql://neondb_owner:W8wciFJU1mEN@ep-steep-darkness-a5qevi3z.us-east-2.aws.neon.tech/MockInterviewer_db?sslmode=require",
    },
};