import "@testing-library/jest-dom";
import {
  useGetGroupsQuery,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  useDeleteGroupMutation,
} from "@/lib/redux/groupsApi";
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

jest.mock("./MessageBoard", () => {
  return function MockMessageBoard() {
    return <div data-testid="message-board">Mock Message Board</div>;
  };
});

jest.mock("@/lib/redux/groupsApi", () => ({
  ...jest.requireActual("@/lib/redux/groupsApi"),
  useGetGroupsQuery: jest.fn(),
  useJoinGroupMutation: jest.fn(),
  useLeaveGroupMutation: jest.fn(),
  useDeleteGroupMutation: jest.fn(),
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
  const mockJoin = jest.fn();
  const mockLeave = jest.fn();
  const mockDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useJoinGroupMutation as jest.Mock).mockReturnValue([
      mockJoin,
      { isLoading: false },
    ]);
    (useLeaveGroupMutation as jest.Mock).mockReturnValue([
      mockLeave,
      { isLoading: false },
    ]);
    (useDeleteGroupMutation as jest.Mock).mockReturnValue([
      mockDelete,
      { isLoading: false },
    ]);
  });

  it("should render a message when no groups are provided", () => {
    (useGetGroupsQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<GroupsList eventId="event-1" session={null} />);

    expect(
      screen.getByText(/Nikt jeszcze nie stworzył ekipy/i)
    ).toBeInTheDocument();
  });

  it('should render the "Join" button for a logged-in user who is not a member', () => {
    (useGetGroupsQuery as jest.Mock).mockReturnValue({
      data: mockGroupsData,
      isLoading: false,
      isError: false,
    });

    const mockSession = createMockSession({ id: "user99" });

    renderWithProviders(<GroupsList eventId="event-1" session={mockSession} />);

    expect(screen.getByRole("button", { name: /Dołącz/i })).toBeInTheDocument();
  });

  it('should render a disabled "Joining..." button when a join action is pending', () => {
    (useGetGroupsQuery as jest.Mock).mockReturnValue({
      data: mockGroupsData,
      isLoading: false,
      isError: false,
    });

    (useJoinGroupMutation as jest.Mock).mockReturnValue([
      mockJoin,
      { isLoading: true },
    ]);

    const mockSession = createMockSession({ id: "user99" });

    renderWithProviders(<GroupsList eventId="event-1" session={mockSession} />);

    const loadingButton = screen.getByRole("button", {
      name: /Dołączanie.../i,
    });
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();
  });
});
