// 存储适配器 wx 实现（解耦第④步）：接口与 Web 版 adapter-storage.js 完全一致。
// 差异点：wx.getStorageSync 对不存在的 key 返回 ''（空串），而 localStorage.getItem
// 返回 null —— core 里有 `=== null` 的判断（首次进入检测），必须把 '' 归一化为 null。
// 存的值恒为 JSON 字符串，不会是合法空串，归一化无副作用。
const StorageAdapter = {
    get(key) {
        try {
            const v = wx.getStorageSync(key);
            return (v === '' || v === null || v === undefined) ? null : v;
        } catch (e) { return null; }
    },
    set(key, value) {
        try { wx.setStorageSync(key, String(value)); } catch (e) {}
    },
    remove(key) {
        try { wx.removeStorageSync(key); } catch (e) {}
    }
};

GameGlobal.StorageAdapter = StorageAdapter;   // core bundle 以裸标识符引用
module.exports = StorageAdapter;
