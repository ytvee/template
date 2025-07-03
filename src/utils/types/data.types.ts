import { User } from "./user.types";

type ArtistsData = {
  artists: User[];
  page: number;
  time?: number;
  isOudated?: boolean;
};

type ArtistData = {
  artist: User;
  time?: number;
  isOudated?: boolean;
};

export type { ArtistsData, ArtistData };
