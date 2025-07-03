type UserRole = string;

export const enum Roles {
  USER = "USER",
  ADMIN = "ADMIN",
  FAN = "FAN",
  CREATOR = "CREATOR",
  CREATOR_IN_ARTIST_TEAM = "CREATOR_IN_ARTIST_TEAM",
  MODERATOR = "MODERATOR",
}

export type { UserRole };
