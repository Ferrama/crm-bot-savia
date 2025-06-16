import { sign, SignOptions } from "jsonwebtoken";
import authConfig from "../config/auth";
import User from "../models/User";

export const createAccessToken = (user: User): string => {
  const { secret, expiresIn } = authConfig;

  if (!secret) {
    throw new Error("JWT secret not configured");
  }

  const options: SignOptions = {
    expiresIn: expiresIn as any
  };

  return sign(
    {
      username: user.name,
      profile: user.profile,
      super: user.super,
      id: user.id,
      companyId: user.companyId
    },
    secret,
    options
  );
};

export const createRefreshToken = (user: User): string => {
  const { refreshSecret, refreshExpiresIn } = authConfig;

  if (!refreshSecret) {
    throw new Error("JWT refresh secret not configured");
  }

  const options: SignOptions = {
    expiresIn: refreshExpiresIn as any
  };

  return sign(
    { id: user.id, tokenVersion: user.tokenVersion, companyId: user.companyId },
    refreshSecret,
    options
  );
};
