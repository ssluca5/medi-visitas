import { createClerkClient } from "@clerk/backend";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../.env") });

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function clearClerkUsers() {
  console.log("Fetching users from Clerk...");
  try {
    let hasMore = true;
    let offset = 0;
    const limit = 10;

    while (hasMore) {
      const response = await clerkClient.users.getUserList({
        limit,
        offset,
      });

      const users = response.data;
      if (users.length === 0) {
        hasMore = false;
        break;
      }

      console.log(`Found ${users.length} users. Deleting...`);
      for (const user of users) {
        await clerkClient.users.deleteUser(user.id);
        console.log(
          `Deleted user ${user.id} (${user.emailAddresses[0]?.emailAddress})`,
        );
      }

      // We don't increment offset because we deleted the current page, so the next page shifts down to offset 0
    }

    console.log("All Clerk users deleted successfully.");
  } catch (error) {
    console.error("Error deleting Clerk users:", error);
  }
}

clearClerkUsers();
