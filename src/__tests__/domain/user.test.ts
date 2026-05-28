import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  supabaseServer: {
    from: vi.fn(),
  },
}));

import { findUserByAccountId, findUser, getActiveUsers } from "@/lib/domain/user/queries";
import { createUser, updateUserInfo } from "@/lib/domain/user/mutations";
import { supabaseServer } from "@/lib/supabase/server";

const mockFrom = vi.mocked(supabaseServer.from);

function createChain(data: unknown = null, error: unknown = null) {
  const resolved = { data, error };
  const chain: Record<string, unknown> = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(resolved),
    then: (onfulfilled: (v: typeof resolved) => unknown, onrejected?: (e: unknown) => unknown) =>
      Promise.resolve(resolved).then(onfulfilled, onrejected),
    catch: (onrejected: (e: unknown) => unknown) =>
      Promise.resolve(resolved).catch(onrejected),
    finally: (onfinally?: () => void) =>
      Promise.resolve(resolved).finally(onfinally),
  };
  return chain;
}

beforeEach(() => {
  vi.clearAllMocks();
});

// --- findUserByAccountId ---

describe("findUserByAccountId", () => {
  it("user 테이블을 조회한다", async () => {
    const userData = [{ accountId: "kakao-123", name: "홍길동" }];
    mockFrom.mockReturnValue(createChain(userData) as ReturnType<typeof supabaseServer.from>);

    const result = await findUserByAccountId("kakao-123");

    expect(mockFrom).toHaveBeenCalledWith("user");
    expect(result).toEqual(userData);
  });

  it("데이터가 없으면 빈 배열을 반환한다", async () => {
    mockFrom.mockReturnValue(createChain([]) as ReturnType<typeof supabaseServer.from>);
    const result = await findUserByAccountId("unknown");
    expect(result).toEqual([]);
  });

  it("에러가 발생하면 throw한다", async () => {
    const error = new Error("DB connection failed");
    mockFrom.mockReturnValue(createChain(null, error) as ReturnType<typeof supabaseServer.from>);
    await expect(findUserByAccountId("kakao-123")).rejects.toThrow("DB connection failed");
  });
});

// --- findUser ---

describe("findUser", () => {
  it("email과 name으로 사용자를 조회한다", async () => {
    const userData = [{ email: "hong@test.com", name: "홍길동" }];
    mockFrom.mockReturnValue(createChain(userData) as ReturnType<typeof supabaseServer.from>);

    const result = await findUser("hong@test.com", "홍길동");

    expect(mockFrom).toHaveBeenCalledWith("user");
    expect(result).toEqual(userData);
  });

  it("에러가 발생하면 throw한다", async () => {
    const error = new Error("Query error");
    mockFrom.mockReturnValue(createChain(null, error) as ReturnType<typeof supabaseServer.from>);
    await expect(findUser("hong@test.com", "홍길동")).rejects.toThrow("Query error");
  });
});

// --- getActiveUsers ---

describe("getActiveUsers", () => {
  it("활성 사용자 목록을 반환한다", async () => {
    const users = [
      { name: "홍길동", birthYear: "90" },
      { name: "김철수", birthYear: "92" },
    ];
    mockFrom.mockReturnValue(createChain(users) as ReturnType<typeof supabaseServer.from>);

    const result = await getActiveUsers();

    expect(mockFrom).toHaveBeenCalledWith("user");
    expect(result).toEqual(users);
  });

  it("에러가 발생하면 throw한다", async () => {
    const error = new Error("DB error");
    mockFrom.mockReturnValue(createChain(null, error) as ReturnType<typeof supabaseServer.from>);
    await expect(getActiveUsers()).rejects.toThrow("DB error");
  });
});

// --- createUser ---

describe("createUser", () => {
  const newUser = {
    name: "홍길동",
    birthYear: "90",
    email: "hong@test.com",
    accountId: "kakao-123",
  };

  it("user 테이블에 사용자를 upsert한다", async () => {
    mockFrom.mockReturnValue(createChain({ id: 1 }) as ReturnType<typeof supabaseServer.from>);

    await createUser(newUser);

    expect(mockFrom).toHaveBeenCalledWith("user");
  });

  it("에러가 발생하면 throw한다", async () => {
    const chain = createChain(null, new Error("Insert error"));
    // createUser는 .upsert(...).select().single() 체인 → single이 마지막
    chain.single = vi.fn().mockResolvedValue({ data: null, error: new Error("Insert error") });
    mockFrom.mockReturnValue(chain as ReturnType<typeof supabaseServer.from>);
    await expect(createUser(newUser)).rejects.toThrow("Insert error");
  });
});

// --- updateUserInfo ---

describe("updateUserInfo", () => {
  const userData = {
    name: "홍길동",
    birthYear: "92",
    email: "hong@test.com",
    accountId: "kakao-123",
  };

  it("user 테이블에서 사용자 정보를 업데이트한다", async () => {
    // 업데이트 성공 시 1행 반환 — accountId WHERE에만 매칭
    mockFrom.mockReturnValue(
      createChain([{ accountId: "kakao-123" }]) as ReturnType<typeof supabaseServer.from>
    );

    await updateUserInfo(userData);

    expect(mockFrom).toHaveBeenCalledWith("user");
  });

  it("매칭되는 행이 없으면 에러를 throw한다", async () => {
    mockFrom.mockReturnValue(createChain([]) as ReturnType<typeof supabaseServer.from>);
    await expect(updateUserInfo(userData)).rejects.toThrow(/no row matched/);
  });

  it("DB 에러가 발생하면 throw한다", async () => {
    const error = new Error("Update error");
    mockFrom.mockReturnValue(createChain(null, error) as ReturnType<typeof supabaseServer.from>);
    await expect(updateUserInfo(userData)).rejects.toThrow("Update error");
  });
});
