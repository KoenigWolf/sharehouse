import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResidentGrid } from "../ResidentGrid";
import type { ResidentWithRoom } from "@/src/shared/types";

const sampleResidents: ResidentWithRoom[] = [
  {
    id: "resident-1",
    user_id: "user-1",
    nickname: "Alice",
    room_number: "101",
    floor: "1F",
    photo_url: null,
    role: "resident",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    room: {
      id: "room-1",
      room_number: "101",
      floor: "1F",
      floor_plan_url: null,
      created_at: "2023-01-01T00:00:00Z",
    },
  },
  {
    id: "resident-2",
    user_id: "user-2",
    nickname: "Bob",
    room_number: "201",
    floor: "2F",
    photo_url: null,
    role: "resident",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    room: {
      id: "room-2",
      room_number: "201",
      floor: "2F",
      floor_plan_url: null,
      created_at: "2023-01-01T00:00:00Z",
    },
  },
  {
    id: "resident-3",
    user_id: "user-3",
    nickname: "Zoe",
    room_number: "202",
    floor: "2F",
    photo_url: null,
    role: "resident",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    room: {
      id: "room-3",
      room_number: "202",
      floor: "2F",
      floor_plan_url: null,
      created_at: "2023-01-01T00:00:00Z",
    },
  },
];

describe("ResidentGrid", () => {
  it("filters residents by floor tab", async () => {
    const user = userEvent.setup();
    render(<ResidentGrid residents={sampleResidents} isLoading={false} onRoomClick={vi.fn()} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /1F/i }));

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    expect(screen.queryByText("Zoe")).not.toBeInTheDocument();
  });

  it("filters residents by search query", async () => {
    const user = userEvent.setup();
    render(<ResidentGrid residents={sampleResidents} isLoading={false} onRoomClick={vi.fn()} />);

    const search = screen.getByLabelText(/search residents/i);
    await user.type(search, "Zoe");

    expect(screen.getByText("Zoe")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });
});
