import { PrismaClient } from "@prisma/client";
import { prismaService } from "../../database/prisma";
import AppError from "../../errors/AppError";
import Company from "../../models/Company";
import User from "../../models/User";
import CreateUserService from "./CreateUserService";

interface Request {
  companyId: number;
}

interface MappedUser {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  position: string;
  enabled: boolean;
  userType: number;
  password: string;
}

interface Response {
  created: number;
  skipped: number;
  errors: string[];
}

const CreateUserFromSaviaService = async ({
  companyId
}: Request): Promise<Response> => {
  // Get company with saviaDbUrl
  const company = await Company.findByPk(companyId);

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  if (!company.saviaDbUrl) {
    throw new AppError(
      "Savia database URL not configured for this company",
      400
    );
  }

  try {
    // Use PrismaService to connect to the company's Savia database
    const saviaUsers = await prismaService.executeTaskNew(
      company.saviaDbUrl,
      async (prisma: PrismaClient) => {
        // Fetch all users from the Savia database
        console.log("Fetching users from Savia database...");

        const users = await prisma.usuario.findMany({
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            username: true,
            telefono: true,
            cargo: true,
            eliminado: true,
            idTipoUsuario: true,
            password: true
          },
          where: {
            eliminado: "N" // "N" means not deleted in Savia
          },
          orderBy: {
            nombre: "asc"
          }
        });

        console.log(`Raw Savia users found: ${users.length}`);
        console.log("Sample user data:", users.slice(0, 2));

        // Transform Savia users to our format
        const mappedUsers: MappedUser[] = users.map(user => ({
          id: Number(user.id),
          name:
            user.username ||
            `${user.nombre || ""} ${user.apellido || ""}`.trim(),
          email: user.email || "",
          username: user.username || "",
          phone: user.telefono || "",
          position: user.cargo || "",
          enabled: user.eliminado !== "Y", // "Y" means deleted in Savia
          userType: Number(user.idTipoUsuario) || 0,
          password: user.password || "123456" // Default password if not available
        }));

        return mappedUsers;
      },
      {
        retryAttempts: 3,
        retryDelay: 1000,
        timeout: 30000 // 30 seconds timeout
      }
    );

    console.log(`Fetched ${saviaUsers.length} users from Savia DB`);

    // Helper function to clean username for email generation
    const cleanUsernameForEmail = (username: string): string => {
      return username
        .toLowerCase()
        .replace(/\s+/g, "") // Remove all spaces
        .replace(/[^a-z0-9]/g, "") // Remove special characters, keep only letters and numbers
        .substring(0, 20); // Limit length to avoid very long emails
    };

    // Filter and validate users first
    const validUsers = saviaUsers.filter(saviaUser => {
      // Skip users with idTipoUsuario = 1
      if (saviaUser.userType === 1) {
        console.log(
          `Skipping user ${saviaUser.username} - idTipoUsuario = 1 (system user)`
        );
        return false;
      }

      // Validate required fields
      if (!saviaUser.email || !saviaUser.username || !saviaUser.password) {
        console.log(
          `Skipping user ${saviaUser.username} - missing required fields (email: ${!!saviaUser.email}, username: ${!!saviaUser.username}, password: ${!!saviaUser.password})`
        );
        return false;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(saviaUser.email)) {
        console.log(
          `Skipping user ${saviaUser.username} - invalid email format: ${saviaUser.email}`
        );
        return false;
      }

      // Validate password length (minimum 5 characters)
      if (saviaUser.password.length < 5) {
        console.log(
          `Skipping user ${saviaUser.username} - password too short (${saviaUser.password.length} chars)`
        );
        return false;
      }

      // Validate username length (minimum 2 characters)
      if (saviaUser.username.length < 2) {
        console.log(
          `Skipping user ${saviaUser.username} - username too short (${saviaUser.username.length} chars)`
        );
        return false;
      }

      return true;
    });

    console.log(`Valid users found: ${validUsers.length}`);

    // Group users by original email to handle duplicates
    const usersByEmail = new Map<string, typeof validUsers>();

    validUsers.forEach(user => {
      const email = user.email.toLowerCase();
      if (!usersByEmail.has(email)) {
        usersByEmail.set(email, []);
      }
      usersByEmail.get(email)!.push(user);
    });

    console.log(`Found ${usersByEmail.size} unique email groups`);

    // Process each email group to ensure unique emails (all in memory)
    const preparedUsers = [];
    const usedEmails = new Set<string>();

    // eslint-disable-next-line no-restricted-syntax
    for (const [originalEmail, users] of usersByEmail) {
      try {
        // If only one user with this email, use the original email
        if (users.length === 1) {
          const user = users[0];
          const profile = user.userType === 4 ? "admin" : "user";
          const enabled = user.userType === 4;

          preparedUsers.push({
            email: originalEmail,
            password: user.password,
            name: user.username.toLowerCase(),
            companyId,
            profile,
            enabled,
            originalEmail: user.email,
            username: user.username
          });

          usedEmails.add(originalEmail);
          console.log(
            `Using original email for single user: ${user.username} -> ${originalEmail}`
          );
        } else {
          // Multiple users with same email, need to modify them
          console.log(
            `Multiple users with email ${originalEmail}, modifying emails`
          );

          // Process each user in the group with unique modified emails
          for (let i = 0; i < users.length; i += 1) {
            const user = users[i];
            const emailParts = originalEmail.split("@");
            const domain = emailParts[1];
            let counter = 1;
            const cleanUsername = cleanUsernameForEmail(user.username);
            let finalEmail = `${cleanUsername}@${domain}`;

            // Keep trying until we find a unique email
            while (usedEmails.has(finalEmail)) {
              finalEmail = `${cleanUsername}${counter}@${domain}`;
              counter += 1;
            }

            console.log(
              `Modified email for user ${user.username}: ${originalEmail} -> ${finalEmail}`
            );

            // Determine profile and enabled status based on idTipoUsuario
            const profile = user.userType === 4 ? "admin" : "user";
            const enabled = user.userType === 4; // Only admin users are enabled

            preparedUsers.push({
              email: finalEmail,
              password: user.password,
              name: user.username.toLowerCase(),
              companyId,
              profile,
              enabled,
              originalEmail: user.email,
              username: user.username
            });

            usedEmails.add(finalEmail);
          }
        }
      } catch (error) {
        console.error(`Error processing email group ${originalEmail}:`, error);
      }
    }

    console.log(`Prepared ${preparedUsers.length} users for creation`);

    // Validate all prepared users before creation
    const finalUsersToCreate = preparedUsers.filter(userData => {
      // Additional validation before creation
      if (
        !userData.email ||
        !userData.password ||
        !userData.name ||
        !userData.companyId
      ) {
        console.error("Invalid user data for creation:", userData);
        return false;
      }
      return true;
    });

    console.log(`Final users to create: ${finalUsersToCreate.length}`);

    // Now create all users in parallel using Promise.all
    const results = await Promise.all(
      finalUsersToCreate.map(async userData => {
        try {
          // Create user in our system
          await CreateUserService({
            email: userData.email,
            password: userData.password,
            name: userData.name,
            companyId: userData.companyId,
            profile: userData.profile
          });

          // If user is not enabled, update the enabled field
          if (!userData.enabled) {
            const createdUser = await User.findOne({
              where: { email: userData.email }
            });
            if (createdUser) {
              await createdUser.update({ enabled: false });
            }
          }

          console.log(
            `Created user: ${userData.username} with email: ${userData.email}, profile: ${userData.profile}, enabled: ${userData.enabled}`
          );
          return { type: "created", user: userData.username };
        } catch (error) {
          const errorMsg = `Failed to create user ${userData.username}: ${error.message}`;
          console.error(errorMsg);
          console.error("User data that failed:", {
            email: userData.email,
            name: userData.username,
            password: userData.password ? "***" : "missing",
            companyId: userData.companyId,
            profile: userData.profile
          });
          console.error("Full error details:", error);
          return { type: "error", user: userData.username, error: errorMsg };
        }
      })
    );

    const created = results.filter(r => r.type === "created").length;
    const skipped = results.filter(r => r.type === "skipped").length;
    const errors = results
      .filter(r => r.type === "error")
      .map(r => r.error as string);

    return {
      created,
      skipped,
      errors
    };
  } catch (error) {
    console.error(
      `Error fetching users from Savia DB for company ${companyId}:`,
      error
    );

    if (
      error.message.includes("Unknown table") ||
      error.message.includes("doesn't exist")
    ) {
      throw new AppError("Users table not found in Savia database", 400);
    }

    if (
      error.message.includes("Access denied") ||
      error.message.includes("authentication")
    ) {
      throw new AppError(
        "Unable to connect to Savia database - check credentials",
        400
      );
    }

    throw new AppError(
      `Failed to fetch users from Savia database: ${error.message}`,
      500
    );
  }
};

export default CreateUserFromSaviaService;
