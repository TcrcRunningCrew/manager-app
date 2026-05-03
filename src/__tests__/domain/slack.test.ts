import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendSlackNotification } from "@/lib/domain/slack/notifications";

describe("sendSlackNotification", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    mockFetch.mockClear();
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("POST 요청으로 메시지를 전송한다", async () => {
    mockFetch.mockResolvedValue({ ok: true });
    await sendSlackNotification("테스트 메시지");

    expect(mockFetch).toHaveBeenCalledOnce();
    const [, options] = mockFetch.mock.calls[0];
    expect(options.method).toBe("POST");
  });

  it("메시지를 JSON body에 포함한다", async () => {
    mockFetch.mockResolvedValue({ ok: true });
    await sendSlackNotification("출석/2025-01-15/홍길동");

    const [, options] = mockFetch.mock.calls[0];
    expect(JSON.parse(options.body)).toEqual({ text: "출석/2025-01-15/홍길동" });
  });

  it("Content-Type: application/json 헤더를 포함한다", async () => {
    mockFetch.mockResolvedValue({ ok: true });
    await sendSlackNotification("메시지");

    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers["Content-Type"]).toBe("application/json");
  });

  it("응답이 ok가 아니면 에러를 던진다", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    await expect(sendSlackNotification("메시지")).rejects.toThrow(
      "Slack notification failed"
    );
  });

  it("응답이 ok이면 에러를 던지지 않는다", async () => {
    mockFetch.mockResolvedValue({ ok: true });
    await expect(sendSlackNotification("메시지")).resolves.toBeUndefined();
  });
});
