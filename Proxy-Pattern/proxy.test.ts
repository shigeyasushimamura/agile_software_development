import {
  expect,
  vi,
  describe,
  it,
  beforeAll,
  beforeEach,
  afterEach,
} from "vitest";
import { AIManager, AIProxy } from "./proxy.js";

describe("proxy", () => {
  let spyLog: ReturnType<typeof vi.spyOn>;

  beforeAll(() => {
    // タイマーをモック化
    vi.useFakeTimers();
  });

  beforeEach(() => {
    // console.log をモック化
    spyLog = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    // モックをクリア
    spyLog.mockRestore();
  });

  it("敵に会えないパターン（全ての敵が遠く、Proxy のまま）", async () => {
    const game = new AIManager();
    game.addAI(new AIProxy("ゴブリン", 50, 50));
    game.addAI(new AIProxy("オーク", 100, 100));
    game.addAI(new AIProxy("スケルトン", 150, 150));

    game.updateWorld();

    // setTimeout(() => game.movePlayer(0, 0), 2000);

    // setTimeout(() => game.movePlayer(150, 150), 6000);

    // 想定されるログ出力
    expect(spyLog).toHaveBeenCalledWith("🌍 ゲーム世界の更新...");
    // console.log("aiEntity", game.aiEntities);
    expect(spyLog).toHaveBeenCalledWith("🔄 ゴブリン をProxyに戻す");
    expect(spyLog).toHaveBeenCalledWith("🔄 オーク をProxyに戻す");
    expect(spyLog).toHaveBeenCalledWith("🔄 スケルトン をProxyに戻す");
    expect(spyLog).toHaveBeenCalledWith("🚧 ゴブリン は簡易処理中");
    expect(spyLog).toHaveBeenCalledWith("🚧 オーク は簡易処理中");
    expect(spyLog).toHaveBeenCalledWith("🚧 スケルトン は簡易処理中");

    setTimeout(() => game.movePlayer(100, 100), 4000);
    // タイマーを進めて実行
    await vi.advanceTimersByTime(6000);
    await vi.runAllTimersAsync();

    // // 敵が詳細AIに切り替わっていないことを確認
    expect(spyLog).not.toHaveBeenCalledWith(
      "⚡ ゴブリン の詳細AIがアクティブ化！"
    );
    expect(spyLog).toHaveBeenCalledWith("⚡ オーク の詳細AIがアクティブ化！");
  });
});
