import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { Session } from "next-auth";
import type { GroupWithMembers } from "@/types";
import GroupsList from "./GroupsList";

// Mock the Next.js router, as it's not available in the test environment.
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

// Mock the global fetch function to simulate API calls.
const mockFetch = jest.fn();
global.fetch = mockFetch;

/**
 * A helper function to create a properly typed mock Session object.
 * This eliminates the need for `as any`.
 */
const createMockSession = (user: {
  id: string;
  name?: string | null;
}): Session => ({
  user,
  expires: new Date(Date.now() + 86400 * 1000).toISOString(),
});

// Reusable mock data for the tests.
const mockGroupsData: GroupWithMembers[] = [
  {
    id: "group1",
    name: "The Best Crew Ever",
    description: "Looking for fun people!",
    owner: { id: "user1", name: "John Doe", image: null },
    members: [
      { user: { id: "user1", name: "John Doe", image: null } },
      { user: { id: "user2", name: "Jane Smith", image: null } },
    ],
  },
  {
    id: "group2",
    name: "Concert Team",
    description: null,
    owner: { id: "user3", name: "Peter Jones", image: null },
    members: [{ user: { id: "user3", name: "Peter Jones", image: null } }],
  },
];

describe("GroupsList", () => {
  // Clear all mocks before each test to ensure test isolation.
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should render a message when no groups are provided", () => {
    render(<GroupsList groups={[]} session={null} />);
    expect(
      screen.getByText(/Nikt jeszcze nie stworzył ekipy/i)
    ).toBeInTheDocument();
  });

  describe("when groups are provided", () => {
    it("should render the list of groups correctly for a guest user", () => {
      render(<GroupsList groups={mockGroupsData} session={null} />);

      expect(screen.getByText("The Best Crew Ever")).toBeInTheDocument();
      expect(screen.getByText("Concert Team")).toBeInTheDocument();
      expect(screen.getByText(/Członkowie: 2/i)).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /Dołącz/i })
      ).not.toBeInTheDocument();
    });

    it('should render a "Join" button for a logged-in user who is not a member', () => {
      const mockSession = createMockSession({
        id: "user99",
        name: "Test User",
      });
      render(<GroupsList groups={[mockGroupsData[0]]} session={mockSession} />);

      expect(
        screen.getByRole("button", { name: /Dołącz/i })
      ).toBeInTheDocument();
    });

    it('should not render a "Join" button and show a chip for a user who is already a member', () => {
      const mockSession = createMockSession({ id: "user1", name: "John Doe" });
      render(<GroupsList groups={[mockGroupsData[0]]} session={mockSession} />);

      expect(
        screen.queryByRole("button", { name: /Dołącz/i })
      ).not.toBeInTheDocument();
      expect(screen.getByText("Jesteś w tej ekipie")).toBeInTheDocument();
    });

    it('should call the join API when the "Join" button is clicked', () => {
      mockFetch.mockResolvedValue({ ok: true });
      const mockSession = createMockSession({
        id: "user99",
        name: "Test User",
      });

      render(<GroupsList groups={[mockGroupsData[0]]} session={mockSession} />);

      const joinButton = screen.getByRole("button", { name: /Dołącz/i });
      fireEvent.click(joinButton);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith("/api/groups/group1/join", {
        method: "POST",
      });
    });
  });
});
