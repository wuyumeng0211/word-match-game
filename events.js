// 事件总线：core 对外的唯一嘴巴（解耦第①步基建）
// 命名规范：名词:动词过去式，如 board:matched / word:completed / level:won
const GameEvents = {
    _handlers: {},
    on(name, fn) {
        (this._handlers[name] = this._handlers[name] || []).push(fn);
        return () => this.off(name, fn);
    },
    off(name, fn) {
        const a = this._handlers[name];
        if (a) { const i = a.indexOf(fn); if (i >= 0) a.splice(i, 1); }
    },
    emit(name, payload) {
        (this._handlers[name] || []).slice().forEach(fn => fn(payload));
    }
};
