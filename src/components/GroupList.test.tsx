import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { Session } from "next-auth";
import type { GroupWithMembers } from "@/types";
import GroupsList from "./GroupsList";
import { renderWithProviders } from "@/utils/test-utils";

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
    renderWithProviders(<GroupsList groups={[]} session={null} />, {
      preloadedState: {
        groups: { groups: [], pendingAction: null },
      },
    });
    expect(
      screen.getByText(/Nikt jeszcze nie stworzył ekipy/i)
    ).toBeInTheDocument();
  });

  it('should render the "Join" button for a logged-in user who is not a member', () => {
    const mockSession = createMockSession({ id: "user99" });
    renderWithProviders(
      <GroupsList groups={mockGroupsData} session={mockSession} />,
      {
        preloadedState: {
          groups: { groups: mockGroupsData, pendingAction: null },
        },
      }
    );

    expect(screen.getByRole("button", { name: /Dołącz/i })).toBeInTheDocument();
  });

  it('should render a disabled "Joining..." button when a join action is pending', () => {
    const mockSession = createMockSession({ id: "user99" });
    renderWithProviders(
      <GroupsList groups={mockGroupsData} session={mockSession} />,
      {
        preloadedState: {
          groups: {
            groups: mockGroupsData,
            pendingAction: { groupId: "group1", type: "join" },
          },
        },
      }
    );

    const loadingButton = screen.getByRole("button", {
      name: /Dołączanie.../i,
    });
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();
  });
});
