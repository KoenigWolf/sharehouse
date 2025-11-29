import { renderHook, waitFor } from "@testing-library/react";
import { useResidents } from "../hooks";
import { mockResidents } from "../mocks";

vi.mock("@/src/config", () => ({
  env: {
    features: { useMockData: true },
  },
}));

describe("useResidents", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns mock residents after the mock delay when useMockData is enabled", async () => {
    const { result } = renderHook(() => useResidents());

    await vi.advanceTimersByTimeAsync(500);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.residents).toHaveLength(mockResidents.length);
  });
});
