export interface Track {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  shortDescription: string;
  archived?: boolean;
  createdAt: number;
  updatedAt: number;
}

export const TRACKS_COLLECTION = "tracks";
