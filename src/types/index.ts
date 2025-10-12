export type Event = {
  id: string;
  name: string;
  artist: string;
  date: string;
  location: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GroupWithMembers = {
  id: string;
  name: string;
  description: string | null;
  owner: {
    name: string | null;
    image: string | null;
  };
  members: {
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }[];
};
