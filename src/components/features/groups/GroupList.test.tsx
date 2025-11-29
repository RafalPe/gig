import "@testing-library/jest-dom";
import { groupsApi } from "@/lib/redux/groupsApi";
import type { RootState } from "@/lib/redux/store";
import type { GroupWithMembers } from "@/types";
import { renderWithProviders } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import type { Session } from "next-auth";
import GroupsList from "./GroupsList";
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

const createMockSession = (user: {
  id: string;
  name?: string | null;
}): Session => ({
  user,
  expires: new Date(Date.now() + 86400 * 1000).toISOString(),
});

const mockGroupsData: GroupWithMembers[] = [
  {
    id: "group1",
    name: "The Best Crew Ever",
    description: null,
    owner: { id: "user1", name: "John Doe", image: null },
    members: [{ user: { id: "user1", name: "John Doe", image: null } }],
  },
];

describe("GroupsList", () => {
  it("should render a message when no groups are provided", () => {
    renderWithProviders(<GroupsList eventId="event1" session={null} />, {
      preloadedState: {
        [groupsApi.reducerPath]: {
          queries: {
            'getGroups("event1")': {
              status: "fulfilled",
              data: [],
            },
          },
          mutations: {},
          config: {
            reducerPath: "groupsApi",
            online: true,
            focused: true,
            middlewareRegistered: true,
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: false,
            refetchOnReconnect: false,
            refetchOnFocus: false,
          },
          provided: {},
          subscriptions: {},
        } as unknown as RootState[typeof groupsApi.reducerPath],
      },
    });
    expect(
      screen.getByText(/Nikt jeszcze nie stworzył ekipy/i)
    ).toBeInTheDocument();
  });

  it('should render the "Join" button for a logged-in user who is not a member', () => {
    const mockSession = createMockSession({ id: "user99" });
    renderWithProviders(<GroupsList eventId="event1" session={mockSession} />, {
      preloadedState: {
        [groupsApi.reducerPath]: {
          queries: {
            'getGroups("event1")': {
              status: "fulfilled",
              data: mockGroupsData,
            },
          },
          mutations: {},
          config: {
            reducerPath: "groupsApi",
            online: true,
            focused: true,
            middlewareRegistered: true,
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: false,
            refetchOnReconnect: false,
            refetchOnFocus: false,
          },
          provided: {},
          subscriptions: {},
        } as unknown as RootState[typeof groupsApi.reducerPath],
      },
    });

    expect(screen.getByRole("button", { name: /Dołącz/i })).toBeInTheDocument();
  });

  it('should render a disabled "Joining..." button when a join action is pending', () => {
    const mockSession = createMockSession({ id: "user99" });
    renderWithProviders(<GroupsList eventId="event1" session={mockSession} />, {
      preloadedState: {
        [groupsApi.reducerPath]: {
          queries: {
            'getGroups("event1")': {
              status: "fulfilled",
              data: mockGroupsData,
            },
          },
          mutations: {
            "some-request-id": {
              status: "pending",
              endpointName: "joinGroup",
              originalArgs: { groupId: "group1" },
            },
          },
          config: {
            reducerPath: "groupsApi",
            online: true,
            focused: true,
            middlewareRegistered: true,
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: false,
            refetchOnReconnect: false,
            refetchOnFocus: false,
          },
          provided: {},
          subscriptions: {},
        } as unknown as RootState[typeof groupsApi.reducerPath],
      },
    });

    expect(screen.getByRole("button", { name: /Dołącz/i })).toBeInTheDocument();
  });
});
