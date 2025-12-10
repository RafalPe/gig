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

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type DeletionRequest = {
  id: string;
  status: RequestStatus;
  reason: string;
  createdAt: string;
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
  deletionRequests: DeletionRequest[];
};

export type DashboardData = {
  myGroups: DashboardGroup[];
  myEvents: DashboardEvent[];
};

export type TicketmasterImage = {
  ratio: string;
  url: string;
  width: number;
  height: number;
};

export type TicketmasterEvent = {
  id: string;
  name: string;
  dates?: {
    start?: {
      dateTime?: string;
      localDate?: string;
    };
  };
  _embedded?: {
    attractions?: Array<{ name: string }>;
    venues?: Array<{ name: string; city?: { name: string } }>;
  };
  info?: string;
  images?: TicketmasterImage[];
  url?: string;
};