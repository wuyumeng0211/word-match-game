// 存储适配器（解耦第②步）：core 只见此接口。
// Web 实现 = localStorage；微信小游戏实现 = wx.setStorageSync（第④步提供）。
const StorageAdapter = {
    get(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
        try { localStorage.setItem(key, value); } catch (e) {}
    },
    remove(key) {
        try { localStorage.removeItem(key); } catch (e) {}
    }
};
