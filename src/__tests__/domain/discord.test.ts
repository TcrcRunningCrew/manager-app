import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendDiscordNotification } from "@/lib/domain/discord/notifications";

describe("sendDiscordNotification", () => {
  const mockFetch = vi.fn();
  const ORIGINAL_URL = process.env.DISCORD_WEBHOOK_URL;

  beforeEach(() => {
    mockFetch.mockClear();
    vi.stubGlobal("fetch", mockFetch);
    process.env.DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/test";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env.DISCORD_WEBHOOK_URL = ORIGINAL_URL;
  });

  it("POST 요청으로 메시지를 전송한다", async () => {
    mockFetch.mockResolvedValue({ ok: true });
    await sendDiscordNotification("테스트 메시지");

    expect(mockFetch).toHaveBeenCalledOnce();
    const [, options] = mockFetch.mock.calls[0];
    expect(options.method).toBe("POST");
  });

  it("Discord 형식({ content })으로 JSON body를 보낸다", async () => {
    mockFetch.mockResolvedValue({ ok: true });
    await sendDiscordNotification("출석/2025-01-15/홍길동");

    const [, options] = mockFetch.mock.calls[0];
    expect(JSON.parse(options.body)).toEqual({ content: "출석/2025-01-15/홍길동" });
  });

  it("Content-Type: application/json 헤더를 포함한다", async () => {
    mockFetch.mockResolvedValue({ ok: true });
    await sendDiscordNotification("메시지");

    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers["Content-Type"]).toBe("application/json");
  });

  it("응답이 ok가 아니면 에러를 던진다", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    await expect(sendDiscordNotification("메시지")).rejects.toThrow(
      "Discord notification failed"
    );
  });

  it("응답이 ok이면 에러를 던지지 않는다", async () => {
    mockFetch.mockResolvedValue({ ok: true });
    await expect(sendDiscordNotification("메시지")).resolves.toBeUndefined();
  });

  it("2000자 초과 메시지를 자른다", async () => {
    mockFetch.mockResolvedValue({ ok: true });
    const long = "x".repeat(3000);
    await sendDiscordNotification(long);

    const [, options] = mockFetch.mock.calls[0];
    const parsed = JSON.parse(options.body);
    expect(parsed.content.length).toBeLessThanOrEqual(2000);
    expect(parsed.content.endsWith("…")).toBe(true);
  });
});
