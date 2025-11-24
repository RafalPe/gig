export type Event = {
  id: string;
  name: string;
  artist: string;
  date: string;
  location: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  imageUrl: string | null;
};

export type GroupWithMembers = {
  id: string;
  name: string;
  description: string | null;
  owner: {
    id: string;
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

export type DashboardGroup = {
  id: string;
  name: string;
  description: string | null;
  event: {
    id: string;
    name: string;
    date: string;
    location: string;
    imageUrl: string | null;
  };
};

export type DashboardEvent = {
  id: string;
  name: string;
  date: string;
  isVerified: boolean;
  createdAt: string;
  _count: {
    groups: number;
  };
};

export type DashboardData = {
  myGroups: DashboardGroup[];
  myEvents: DashboardEvent[];
};
