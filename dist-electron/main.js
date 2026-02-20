var v$ = Object.defineProperty;
var Gd = (e) => {
  throw TypeError(e);
};
var _$ = (e, t, r) => t in e ? v$(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Xi = (e, t, r) => _$(e, typeof t != "symbol" ? t + "" : t, r), bc = (e, t, r) => t.has(e) || Gd("Cannot " + r);
var ce = (e, t, r) => (bc(e, t, "read from private field"), r ? r.call(e) : t.get(e)), ar = (e, t, r) => t.has(e) ? Gd("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Ct = (e, t, r, n) => (bc(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), br = (e, t, r) => (bc(e, t, "access private method"), r);
import Cr, { ipcMain as ht, BrowserWindow as Ds, app as Pe } from "electron";
import { fileURLToPath as Zm } from "node:url";
import ie from "node:path";
import Ie from "node:process";
import { promisify as tt, isDeepStrictEqual as Kd } from "node:util";
import se from "node:fs";
import Pr from "node:crypto";
import Wd from "node:assert";
import ru from "node:os";
import "node:events";
import "node:stream";
import Si from "child_process";
import xn from "crypto";
import pn from "fs";
import $$ from "constants";
import zo from "stream";
import nu from "util";
import ey from "assert";
import ke from "path";
import ty from "events";
import ry from "tty";
import ks from "os";
import Di from "url";
import w$ from "string_decoder";
import ny from "zlib";
import E$ from "http";
const Vn = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, iy = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), oy = 1e6, b$ = (e) => e >= "0" && e <= "9";
function ay(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= oy;
  }
  return !1;
}
function Sc(e, t) {
  return iy.has(e) ? !1 : (e && ay(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function S$(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  const t = [];
  let r = "", n = "start", i = !1, o = 0;
  for (const a of e) {
    if (o++, i) {
      r += a, i = !1;
      continue;
    }
    if (a === "\\") {
      if (n === "index")
        throw new Error(`Invalid character '${a}' in an index at position ${o}`);
      if (n === "indexEnd")
        throw new Error(`Invalid character '${a}' after an index at position ${o}`);
      i = !0, n = n === "start" ? "property" : n;
      continue;
    }
    switch (a) {
      case ".": {
        if (n === "index")
          throw new Error(`Invalid character '${a}' in an index at position ${o}`);
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (!Sc(r, t))
          return [];
        r = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error(`Invalid character '${a}' in an index at position ${o}`);
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (n === "property" || n === "start") {
          if ((r || n === "property") && !Sc(r, t))
            return [];
          r = "";
        }
        n = "index";
        break;
      }
      case "]": {
        if (n === "index") {
          if (r === "")
            r = (t.pop() || "") + "[]", n = "property";
          else {
            const s = Number.parseInt(r, 10);
            !Number.isNaN(s) && Number.isFinite(s) && s >= 0 && s <= Number.MAX_SAFE_INTEGER && s <= oy && r === String(s) ? t.push(s) : t.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${a}' after an index at position ${o}`);
        r += a;
        break;
      }
      default: {
        if (n === "index" && !b$(a))
          throw new Error(`Invalid character '${a}' in an index at position ${o}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${a}' after an index at position ${o}`);
        n === "start" && (n = "property"), r += a;
      }
    }
  }
  switch (i && (r += "\\"), n) {
    case "property": {
      if (!Sc(r, t))
        return [];
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function js(e) {
  if (typeof e == "string")
    return S$(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [r, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (iy.has(n))
        return [];
      typeof n == "string" && ay(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function Yd(e, t, r) {
  if (!Vn(e) || typeof t != "string" && !Array.isArray(t))
    return r === void 0 ? e : r;
  const n = js(t);
  if (n.length === 0)
    return r;
  for (let i = 0; i < n.length; i++) {
    const o = n[i];
    if (e = e[o], e == null) {
      if (i !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function ma(e, t, r) {
  if (!Vn(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, i = js(t);
  if (i.length === 0)
    return e;
  for (let o = 0; o < i.length; o++) {
    const a = i[o];
    if (o === i.length - 1)
      e[a] = r;
    else if (!Vn(e[a])) {
      const c = typeof i[o + 1] == "number";
      e[a] = c ? [] : {};
    }
    e = e[a];
  }
  return n;
}
function P$(e, t) {
  if (!Vn(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = js(t);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const i = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(e, i) ? (delete e[i], !0) : !1;
    if (e = e[i], !Vn(e))
      return !1;
  }
}
function Pc(e, t) {
  if (!Vn(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = js(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!Vn(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const Qr = ru.homedir(), iu = ru.tmpdir(), { env: ui } = Ie, T$ = (e) => {
  const t = ie.join(Qr, "Library");
  return {
    data: ie.join(t, "Application Support", e),
    config: ie.join(t, "Preferences", e),
    cache: ie.join(t, "Caches", e),
    log: ie.join(t, "Logs", e),
    temp: ie.join(iu, e)
  };
}, O$ = (e) => {
  const t = ui.APPDATA || ie.join(Qr, "AppData", "Roaming"), r = ui.LOCALAPPDATA || ie.join(Qr, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: ie.join(r, e, "Data"),
    config: ie.join(t, e, "Config"),
    cache: ie.join(r, e, "Cache"),
    log: ie.join(r, e, "Log"),
    temp: ie.join(iu, e)
  };
}, A$ = (e) => {
  const t = ie.basename(Qr);
  return {
    data: ie.join(ui.XDG_DATA_HOME || ie.join(Qr, ".local", "share"), e),
    config: ie.join(ui.XDG_CONFIG_HOME || ie.join(Qr, ".config"), e),
    cache: ie.join(ui.XDG_CACHE_HOME || ie.join(Qr, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: ie.join(ui.XDG_STATE_HOME || ie.join(Qr, ".local", "state"), e),
    temp: ie.join(iu, t, e)
  };
};
function N$(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), Ie.platform === "darwin" ? T$(e) : Ie.platform === "win32" ? O$(e) : A$(e);
}
const xr = (e, t) => {
  const { onError: r } = t;
  return function(...i) {
    return e.apply(void 0, i).catch(r);
  };
}, Sr = (e, t) => {
  const { onError: r } = t;
  return function(...i) {
    try {
      return e.apply(void 0, i);
    } catch (o) {
      return r(o);
    }
  };
}, I$ = 250, Vr = (e, t) => {
  const { isRetriable: r } = t;
  return function(i) {
    const { timeout: o } = i, a = i.interval ?? I$, s = Date.now() + o;
    return function c(...u) {
      return e.apply(void 0, u).catch((l) => {
        if (!r(l) || Date.now() >= s)
          throw l;
        const f = Math.round(a * Math.random());
        return f > 0 ? new Promise((p) => setTimeout(p, f)).then(() => c.apply(void 0, u)) : c.apply(void 0, u);
      });
    };
  };
}, qr = (e, t) => {
  const { isRetriable: r } = t;
  return function(i) {
    const { timeout: o } = i, a = Date.now() + o;
    return function(...c) {
      for (; ; )
        try {
          return e.apply(void 0, c);
        } catch (u) {
          if (!r(u) || Date.now() >= a)
            throw u;
          continue;
        }
    };
  };
}, fi = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!fi.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !C$ && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!fi.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!fi.isNodeError(e))
      throw e;
    if (!fi.isChangeErrorOk(e))
      throw e;
  }
}, ya = {
  onError: fi.onChangeError
}, Rt = {
  onError: () => {
  }
}, C$ = Ie.getuid ? !Ie.getuid() : !1, rt = {
  isRetriable: fi.isRetriableError
}, ot = {
  attempt: {
    /* ASYNC */
    chmod: xr(tt(se.chmod), ya),
    chown: xr(tt(se.chown), ya),
    close: xr(tt(se.close), Rt),
    fsync: xr(tt(se.fsync), Rt),
    mkdir: xr(tt(se.mkdir), Rt),
    realpath: xr(tt(se.realpath), Rt),
    stat: xr(tt(se.stat), Rt),
    unlink: xr(tt(se.unlink), Rt),
    /* SYNC */
    chmodSync: Sr(se.chmodSync, ya),
    chownSync: Sr(se.chownSync, ya),
    closeSync: Sr(se.closeSync, Rt),
    existsSync: Sr(se.existsSync, Rt),
    fsyncSync: Sr(se.fsync, Rt),
    mkdirSync: Sr(se.mkdirSync, Rt),
    realpathSync: Sr(se.realpathSync, Rt),
    statSync: Sr(se.statSync, Rt),
    unlinkSync: Sr(se.unlinkSync, Rt)
  },
  retry: {
    /* ASYNC */
    close: Vr(tt(se.close), rt),
    fsync: Vr(tt(se.fsync), rt),
    open: Vr(tt(se.open), rt),
    readFile: Vr(tt(se.readFile), rt),
    rename: Vr(tt(se.rename), rt),
    stat: Vr(tt(se.stat), rt),
    write: Vr(tt(se.write), rt),
    writeFile: Vr(tt(se.writeFile), rt),
    /* SYNC */
    closeSync: qr(se.closeSync, rt),
    fsyncSync: qr(se.fsyncSync, rt),
    openSync: qr(se.openSync, rt),
    readFileSync: qr(se.readFileSync, rt),
    renameSync: qr(se.renameSync, rt),
    statSync: qr(se.statSync, rt),
    writeSync: qr(se.writeSync, rt),
    writeFileSync: qr(se.writeFileSync, rt)
  }
}, R$ = "utf8", Xd = 438, D$ = 511, k$ = {}, j$ = Ie.geteuid ? Ie.geteuid() : -1, F$ = Ie.getegid ? Ie.getegid() : -1, L$ = 1e3, U$ = !!Ie.getuid;
Ie.getuid && Ie.getuid();
const Jd = 128, M$ = (e) => e instanceof Error && "code" in e, Qd = (e) => typeof e == "string", Tc = (e) => e === void 0, x$ = Ie.platform === "linux", sy = Ie.platform === "win32", ou = ["SIGHUP", "SIGINT", "SIGTERM"];
sy || ou.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
x$ && ou.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class V$ {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (sy && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? Ie.kill(Ie.pid, "SIGTERM") : Ie.kill(Ie.pid, t));
      }
    }, this.hook = () => {
      Ie.once("exit", () => this.exit());
      for (const t of ou)
        try {
          Ie.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const q$ = new V$(), B$ = q$.register, at = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), i = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${i}`;
  },
  get: (e, t, r = !0) => {
    const n = at.truncate(t(e));
    return n in at.store ? at.get(e, t, r) : (at.store[n] = r, [n, () => delete at.store[n]]);
  },
  purge: (e) => {
    at.store[e] && (delete at.store[e], ot.attempt.unlink(e));
  },
  purgeSync: (e) => {
    at.store[e] && (delete at.store[e], ot.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in at.store)
      at.purgeSync(e);
  },
  truncate: (e) => {
    const t = ie.basename(e);
    if (t.length <= Jd)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - Jd;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
B$(at.purgeSyncAll);
function cy(e, t, r = k$) {
  if (Qd(r))
    return cy(e, t, { encoding: r });
  const i = { timeout: r.timeout ?? L$ };
  let o = null, a = null, s = null;
  try {
    const c = ot.attempt.realpathSync(e), u = !!c;
    e = c || e, [a, o] = at.get(e, r.tmpCreate || at.create, r.tmpPurge !== !1);
    const l = U$ && Tc(r.chown), f = Tc(r.mode);
    if (u && (l || f)) {
      const h = ot.attempt.statSync(e);
      h && (r = { ...r }, l && (r.chown = { uid: h.uid, gid: h.gid }), f && (r.mode = h.mode));
    }
    if (!u) {
      const h = ie.dirname(e);
      ot.attempt.mkdirSync(h, {
        mode: D$,
        recursive: !0
      });
    }
    s = ot.retry.openSync(i)(a, "w", r.mode || Xd), r.tmpCreated && r.tmpCreated(a), Qd(t) ? ot.retry.writeSync(i)(s, t, 0, r.encoding || R$) : Tc(t) || ot.retry.writeSync(i)(s, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? ot.retry.fsyncSync(i)(s) : ot.attempt.fsync(s)), ot.retry.closeSync(i)(s), s = null, r.chown && (r.chown.uid !== j$ || r.chown.gid !== F$) && ot.attempt.chownSync(a, r.chown.uid, r.chown.gid), r.mode && r.mode !== Xd && ot.attempt.chmodSync(a, r.mode);
    try {
      ot.retry.renameSync(i)(a, e);
    } catch (h) {
      if (!M$(h) || h.code !== "ENAMETOOLONG")
        throw h;
      ot.retry.renameSync(i)(a, at.truncate(e));
    }
    o(), a = null;
  } finally {
    s && ot.attempt.closeSync(s), a && at.purge(a);
  }
}
var ct = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ly(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var El = { exports: {} }, uy = {}, tr = {}, Pi = {}, Go = {}, le = {}, Ao = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(E) {
      if (super(), !e.IDENTIFIER.test(E))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(E) {
      super(), this._items = typeof E == "string" ? [E] : E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const E = this._items[0];
      return E === "" || E === '""';
    }
    get str() {
      var E;
      return (E = this._str) !== null && E !== void 0 ? E : this._str = this._items.reduce((A, C) => `${A}${C}`, "");
    }
    get names() {
      var E;
      return (E = this._names) !== null && E !== void 0 ? E : this._names = this._items.reduce((A, C) => (C instanceof r && (A[C.str] = (A[C.str] || 0) + 1), A), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function i(y, ...E) {
    const A = [y[0]];
    let C = 0;
    for (; C < E.length; )
      s(A, E[C]), A.push(y[++C]);
    return new n(A);
  }
  e._ = i;
  const o = new n("+");
  function a(y, ...E) {
    const A = [p(y[0])];
    let C = 0;
    for (; C < E.length; )
      A.push(o), s(A, E[C]), A.push(o, p(y[++C]));
    return c(A), new n(A);
  }
  e.str = a;
  function s(y, E) {
    E instanceof n ? y.push(...E._items) : E instanceof r ? y.push(E) : y.push(f(E));
  }
  e.addCodeArg = s;
  function c(y) {
    let E = 1;
    for (; E < y.length - 1; ) {
      if (y[E] === o) {
        const A = u(y[E - 1], y[E + 1]);
        if (A !== void 0) {
          y.splice(E - 1, 3, A);
          continue;
        }
        y[E++] = "+";
      }
      E++;
    }
  }
  function u(y, E) {
    if (E === '""')
      return y;
    if (y === '""')
      return E;
    if (typeof y == "string")
      return E instanceof r || y[y.length - 1] !== '"' ? void 0 : typeof E != "string" ? `${y.slice(0, -1)}${E}"` : E[0] === '"' ? y.slice(0, -1) + E.slice(1) : void 0;
    if (typeof E == "string" && E[0] === '"' && !(y instanceof r))
      return `"${y}${E.slice(1)}`;
  }
  function l(y, E) {
    return E.emptyStr() ? y : y.emptyStr() ? E : a`${y}${E}`;
  }
  e.strConcat = l;
  function f(y) {
    return typeof y == "number" || typeof y == "boolean" || y === null ? y : p(Array.isArray(y) ? y.join(",") : y);
  }
  function h(y) {
    return new n(p(y));
  }
  e.stringify = h;
  function p(y) {
    return JSON.stringify(y).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = p;
  function g(y) {
    return typeof y == "string" && e.IDENTIFIER.test(y) ? new n(`.${y}`) : i`[${y}]`;
  }
  e.getProperty = g;
  function $(y) {
    if (typeof y == "string" && e.IDENTIFIER.test(y))
      return new n(`${y}`);
    throw new Error(`CodeGen: invalid export name: ${y}, use explicit $id name mapping`);
  }
  e.getEsmExportName = $;
  function v(y) {
    return new n(y.toString());
  }
  e.regexpCode = v;
})(Ao);
var bl = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = Ao;
  class r extends Error {
    constructor(u) {
      super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class i {
    constructor({ prefixes: u, parent: l } = {}) {
      this._names = {}, this._prefixes = u, this._parent = l;
    }
    toName(u) {
      return u instanceof t.Name ? u : this.name(u);
    }
    name(u) {
      return new t.Name(this._newName(u));
    }
    _newName(u) {
      const l = this._names[u] || this._nameGroup(u);
      return `${u}${l.index++}`;
    }
    _nameGroup(u) {
      var l, f;
      if (!((f = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || f === void 0) && f.has(u) || this._prefixes && !this._prefixes.has(u))
        throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
      return this._names[u] = { prefix: u, index: 0 };
    }
  }
  e.Scope = i;
  class o extends t.Name {
    constructor(u, l) {
      super(l), this.prefix = u;
    }
    setValue(u, { property: l, itemIndex: f }) {
      this.value = u, this.scopePath = (0, t._)`.${new t.Name(l)}[${f}]`;
    }
  }
  e.ValueScopeName = o;
  const a = (0, t._)`\n`;
  class s extends i {
    constructor(u) {
      super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? a : t.nil };
    }
    get() {
      return this._scope;
    }
    name(u) {
      return new o(u, this._newName(u));
    }
    value(u, l) {
      var f;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const h = this.toName(u), { prefix: p } = h, g = (f = l.key) !== null && f !== void 0 ? f : l.ref;
      let $ = this._values[p];
      if ($) {
        const E = $.get(g);
        if (E)
          return E;
      } else
        $ = this._values[p] = /* @__PURE__ */ new Map();
      $.set(g, h);
      const v = this._scope[p] || (this._scope[p] = []), y = v.length;
      return v[y] = l.ref, h.setValue(l, { property: p, itemIndex: y }), h;
    }
    getValue(u, l) {
      const f = this._values[u];
      if (f)
        return f.get(l);
    }
    scopeRefs(u, l = this._values) {
      return this._reduceValues(l, (f) => {
        if (f.scopePath === void 0)
          throw new Error(`CodeGen: name "${f}" has no value`);
        return (0, t._)`${u}${f.scopePath}`;
      });
    }
    scopeCode(u = this._values, l, f) {
      return this._reduceValues(u, (h) => {
        if (h.value === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return h.value.code;
      }, l, f);
    }
    _reduceValues(u, l, f = {}, h) {
      let p = t.nil;
      for (const g in u) {
        const $ = u[g];
        if (!$)
          continue;
        const v = f[g] = f[g] || /* @__PURE__ */ new Map();
        $.forEach((y) => {
          if (v.has(y))
            return;
          v.set(y, n.Started);
          let E = l(y);
          if (E) {
            const A = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            p = (0, t._)`${p}${A} ${y} = ${E};${this.opts._n}`;
          } else if (E = h == null ? void 0 : h(y))
            p = (0, t._)`${p}${E}${this.opts._n}`;
          else
            throw new r(y);
          v.set(y, n.Completed);
        });
      }
      return p;
    }
  }
  e.ValueScope = s;
})(bl);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Ao, r = bl;
  var n = Ao;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var i = bl;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return i.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return i.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return i.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return i.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class o {
    optimizeNodes() {
      return this;
    }
    optimizeNames(d, m) {
      return this;
    }
  }
  class a extends o {
    constructor(d, m, P) {
      super(), this.varKind = d, this.name = m, this.rhs = P;
    }
    render({ es5: d, _n: m }) {
      const P = d ? r.varKinds.var : this.varKind, w = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${P} ${this.name}${w};` + m;
    }
    optimizeNames(d, m) {
      if (d[this.name.str])
        return this.rhs && (this.rhs = F(this.rhs, d, m)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class s extends o {
    constructor(d, m, P) {
      super(), this.lhs = d, this.rhs = m, this.sideEffects = P;
    }
    render({ _n: d }) {
      return `${this.lhs} = ${this.rhs};` + d;
    }
    optimizeNames(d, m) {
      if (!(this.lhs instanceof t.Name && !d[this.lhs.str] && !this.sideEffects))
        return this.rhs = F(this.rhs, d, m), this;
    }
    get names() {
      const d = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return J(d, this.rhs);
    }
  }
  class c extends s {
    constructor(d, m, P, w) {
      super(d, P, w), this.op = m;
    }
    render({ _n: d }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + d;
    }
  }
  class u extends o {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `${this.label}:` + d;
    }
  }
  class l extends o {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `break${this.label ? ` ${this.label}` : ""};` + d;
    }
  }
  class f extends o {
    constructor(d) {
      super(), this.error = d;
    }
    render({ _n: d }) {
      return `throw ${this.error};` + d;
    }
    get names() {
      return this.error.names;
    }
  }
  class h extends o {
    constructor(d) {
      super(), this.code = d;
    }
    render({ _n: d }) {
      return `${this.code};` + d;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(d, m) {
      return this.code = F(this.code, d, m), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class p extends o {
    constructor(d = []) {
      super(), this.nodes = d;
    }
    render(d) {
      return this.nodes.reduce((m, P) => m + P.render(d), "");
    }
    optimizeNodes() {
      const { nodes: d } = this;
      let m = d.length;
      for (; m--; ) {
        const P = d[m].optimizeNodes();
        Array.isArray(P) ? d.splice(m, 1, ...P) : P ? d[m] = P : d.splice(m, 1);
      }
      return d.length > 0 ? this : void 0;
    }
    optimizeNames(d, m) {
      const { nodes: P } = this;
      let w = P.length;
      for (; w--; ) {
        const _ = P[w];
        _.optimizeNames(d, m) || (L(d, _.names), P.splice(w, 1));
      }
      return P.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((d, m) => x(d, m.names), {});
    }
  }
  class g extends p {
    render(d) {
      return "{" + d._n + super.render(d) + "}" + d._n;
    }
  }
  class $ extends p {
  }
  class v extends g {
  }
  v.kind = "else";
  class y extends g {
    constructor(d, m) {
      super(m), this.condition = d;
    }
    render(d) {
      let m = `if(${this.condition})` + super.render(d);
      return this.else && (m += "else " + this.else.render(d)), m;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const d = this.condition;
      if (d === !0)
        return this.nodes;
      let m = this.else;
      if (m) {
        const P = m.optimizeNodes();
        m = this.else = Array.isArray(P) ? new v(P) : P;
      }
      if (m)
        return d === !1 ? m instanceof y ? m : m.nodes : this.nodes.length ? this : new y(H(d), m instanceof y ? [m] : m.nodes);
      if (!(d === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(d, m) {
      var P;
      if (this.else = (P = this.else) === null || P === void 0 ? void 0 : P.optimizeNames(d, m), !!(super.optimizeNames(d, m) || this.else))
        return this.condition = F(this.condition, d, m), this;
    }
    get names() {
      const d = super.names;
      return J(d, this.condition), this.else && x(d, this.else.names), d;
    }
  }
  y.kind = "if";
  class E extends g {
  }
  E.kind = "for";
  class A extends E {
    constructor(d) {
      super(), this.iteration = d;
    }
    render(d) {
      return `for(${this.iteration})` + super.render(d);
    }
    optimizeNames(d, m) {
      if (super.optimizeNames(d, m))
        return this.iteration = F(this.iteration, d, m), this;
    }
    get names() {
      return x(super.names, this.iteration.names);
    }
  }
  class C extends E {
    constructor(d, m, P, w) {
      super(), this.varKind = d, this.name = m, this.from = P, this.to = w;
    }
    render(d) {
      const m = d.es5 ? r.varKinds.var : this.varKind, { name: P, from: w, to: _ } = this;
      return `for(${m} ${P}=${w}; ${P}<${_}; ${P}++)` + super.render(d);
    }
    get names() {
      const d = J(super.names, this.from);
      return J(d, this.to);
    }
  }
  class D extends E {
    constructor(d, m, P, w) {
      super(), this.loop = d, this.varKind = m, this.name = P, this.iterable = w;
    }
    render(d) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(d);
    }
    optimizeNames(d, m) {
      if (super.optimizeNames(d, m))
        return this.iterable = F(this.iterable, d, m), this;
    }
    get names() {
      return x(super.names, this.iterable.names);
    }
  }
  class V extends g {
    constructor(d, m, P) {
      super(), this.name = d, this.args = m, this.async = P;
    }
    render(d) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(d);
    }
  }
  V.kind = "func";
  class z extends p {
    render(d) {
      return "return " + super.render(d);
    }
  }
  z.kind = "return";
  class G extends g {
    render(d) {
      let m = "try" + super.render(d);
      return this.catch && (m += this.catch.render(d)), this.finally && (m += this.finally.render(d)), m;
    }
    optimizeNodes() {
      var d, m;
      return super.optimizeNodes(), (d = this.catch) === null || d === void 0 || d.optimizeNodes(), (m = this.finally) === null || m === void 0 || m.optimizeNodes(), this;
    }
    optimizeNames(d, m) {
      var P, w;
      return super.optimizeNames(d, m), (P = this.catch) === null || P === void 0 || P.optimizeNames(d, m), (w = this.finally) === null || w === void 0 || w.optimizeNames(d, m), this;
    }
    get names() {
      const d = super.names;
      return this.catch && x(d, this.catch.names), this.finally && x(d, this.finally.names), d;
    }
  }
  class N extends g {
    constructor(d) {
      super(), this.error = d;
    }
    render(d) {
      return `catch(${this.error})` + super.render(d);
    }
  }
  N.kind = "catch";
  class W extends g {
    render(d) {
      return "finally" + super.render(d);
    }
  }
  W.kind = "finally";
  class M {
    constructor(d, m = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...m, _n: m.lines ? `
` : "" }, this._extScope = d, this._scope = new r.Scope({ parent: d }), this._nodes = [new $()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(d) {
      return this._scope.name(d);
    }
    // reserves unique name in the external scope
    scopeName(d) {
      return this._extScope.name(d);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(d, m) {
      const P = this._extScope.value(d, m);
      return (this._values[P.prefix] || (this._values[P.prefix] = /* @__PURE__ */ new Set())).add(P), P;
    }
    getScopeValue(d, m) {
      return this._extScope.getValue(d, m);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(d) {
      return this._extScope.scopeRefs(d, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(d, m, P, w) {
      const _ = this._scope.toName(m);
      return P !== void 0 && w && (this._constants[_.str] = P), this._leafNode(new a(d, _, P)), _;
    }
    // `const` declaration (`var` in es5 mode)
    const(d, m, P) {
      return this._def(r.varKinds.const, d, m, P);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(d, m, P) {
      return this._def(r.varKinds.let, d, m, P);
    }
    // `var` declaration with optional assignment
    var(d, m, P) {
      return this._def(r.varKinds.var, d, m, P);
    }
    // assignment code
    assign(d, m, P) {
      return this._leafNode(new s(d, m, P));
    }
    // `+=` code
    add(d, m) {
      return this._leafNode(new c(d, e.operators.ADD, m));
    }
    // appends passed SafeExpr to code or executes Block
    code(d) {
      return typeof d == "function" ? d() : d !== t.nil && this._leafNode(new h(d)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...d) {
      const m = ["{"];
      for (const [P, w] of d)
        m.length > 1 && m.push(","), m.push(P), (P !== w || this.opts.es5) && (m.push(":"), (0, t.addCodeArg)(m, w));
      return m.push("}"), new t._Code(m);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(d, m, P) {
      if (this._blockNode(new y(d)), m && P)
        this.code(m).else().code(P).endIf();
      else if (m)
        this.code(m).endIf();
      else if (P)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(d) {
      return this._elseNode(new y(d));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new v());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(y, v);
    }
    _for(d, m) {
      return this._blockNode(d), m && this.code(m).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(d, m) {
      return this._for(new A(d), m);
    }
    // `for` statement for a range of values
    forRange(d, m, P, w, _ = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const k = this._scope.toName(d);
      return this._for(new C(_, k, m, P), () => w(k));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(d, m, P, w = r.varKinds.const) {
      const _ = this._scope.toName(d);
      if (this.opts.es5) {
        const k = m instanceof t.Name ? m : this.var("_arr", m);
        return this.forRange("_i", 0, (0, t._)`${k}.length`, (I) => {
          this.var(_, (0, t._)`${k}[${I}]`), P(_);
        });
      }
      return this._for(new D("of", w, _, m), () => P(_));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(d, m, P, w = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(d, (0, t._)`Object.keys(${m})`, P);
      const _ = this._scope.toName(d);
      return this._for(new D("in", w, _, m), () => P(_));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(E);
    }
    // `label` statement
    label(d) {
      return this._leafNode(new u(d));
    }
    // `break` statement
    break(d) {
      return this._leafNode(new l(d));
    }
    // `return` statement
    return(d) {
      const m = new z();
      if (this._blockNode(m), this.code(d), m.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(z);
    }
    // `try` statement
    try(d, m, P) {
      if (!m && !P)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const w = new G();
      if (this._blockNode(w), this.code(d), m) {
        const _ = this.name("e");
        this._currNode = w.catch = new N(_), m(_);
      }
      return P && (this._currNode = w.finally = new W(), this.code(P)), this._endBlockNode(N, W);
    }
    // `throw` statement
    throw(d) {
      return this._leafNode(new f(d));
    }
    // start self-balancing block
    block(d, m) {
      return this._blockStarts.push(this._nodes.length), d && this.code(d).endBlock(m), this;
    }
    // end the current self-balancing block
    endBlock(d) {
      const m = this._blockStarts.pop();
      if (m === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const P = this._nodes.length - m;
      if (P < 0 || d !== void 0 && P !== d)
        throw new Error(`CodeGen: wrong number of nodes: ${P} vs ${d} expected`);
      return this._nodes.length = m, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(d, m = t.nil, P, w) {
      return this._blockNode(new V(d, m, P)), w && this.code(w).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(V);
    }
    optimize(d = 1) {
      for (; d-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(d) {
      return this._currNode.nodes.push(d), this;
    }
    _blockNode(d) {
      this._currNode.nodes.push(d), this._nodes.push(d);
    }
    _endBlockNode(d, m) {
      const P = this._currNode;
      if (P instanceof d || m && P instanceof m)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${m ? `${d.kind}/${m.kind}` : d.kind}"`);
    }
    _elseNode(d) {
      const m = this._currNode;
      if (!(m instanceof y))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = m.else = d, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const d = this._nodes;
      return d[d.length - 1];
    }
    set _currNode(d) {
      const m = this._nodes;
      m[m.length - 1] = d;
    }
  }
  e.CodeGen = M;
  function x(S, d) {
    for (const m in d)
      S[m] = (S[m] || 0) + (d[m] || 0);
    return S;
  }
  function J(S, d) {
    return d instanceof t._CodeOrName ? x(S, d.names) : S;
  }
  function F(S, d, m) {
    if (S instanceof t.Name)
      return P(S);
    if (!w(S))
      return S;
    return new t._Code(S._items.reduce((_, k) => (k instanceof t.Name && (k = P(k)), k instanceof t._Code ? _.push(...k._items) : _.push(k), _), []));
    function P(_) {
      const k = m[_.str];
      return k === void 0 || d[_.str] !== 1 ? _ : (delete d[_.str], k);
    }
    function w(_) {
      return _ instanceof t._Code && _._items.some((k) => k instanceof t.Name && d[k.str] === 1 && m[k.str] !== void 0);
    }
  }
  function L(S, d) {
    for (const m in d)
      S[m] = (S[m] || 0) - (d[m] || 0);
  }
  function H(S) {
    return typeof S == "boolean" || typeof S == "number" || S === null ? !S : (0, t._)`!${O(S)}`;
  }
  e.not = H;
  const U = b(e.operators.AND);
  function K(...S) {
    return S.reduce(U);
  }
  e.and = K;
  const B = b(e.operators.OR);
  function R(...S) {
    return S.reduce(B);
  }
  e.or = R;
  function b(S) {
    return (d, m) => d === t.nil ? m : m === t.nil ? d : (0, t._)`${O(d)} ${S} ${O(m)}`;
  }
  function O(S) {
    return S instanceof t.Name ? S : (0, t._)`(${S})`;
  }
})(le);
var X = {};
Object.defineProperty(X, "__esModule", { value: !0 });
X.checkStrictMode = X.getErrorPath = X.Type = X.useFunc = X.setEvaluated = X.evaluatedPropsToName = X.mergeEvaluated = X.eachItem = X.unescapeJsonPointer = X.escapeJsonPointer = X.escapeFragment = X.unescapeFragment = X.schemaRefOrVal = X.schemaHasRulesButRef = X.schemaHasRules = X.checkUnknownRules = X.alwaysValidSchema = X.toHash = void 0;
const Ee = le, H$ = Ao;
function z$(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
X.toHash = z$;
function G$(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (fy(e, t), !dy(t, e.self.RULES.all));
}
X.alwaysValidSchema = G$;
function fy(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const o in t)
    i[o] || my(e, `unknown keyword: "${o}"`);
}
X.checkUnknownRules = fy;
function dy(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
X.schemaHasRules = dy;
function K$(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
X.schemaHasRulesButRef = K$;
function W$({ topSchemaRef: e, schemaPath: t }, r, n, i) {
  if (!i) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, Ee._)`${r}`;
  }
  return (0, Ee._)`${e}${t}${(0, Ee.getProperty)(n)}`;
}
X.schemaRefOrVal = W$;
function Y$(e) {
  return hy(decodeURIComponent(e));
}
X.unescapeFragment = Y$;
function X$(e) {
  return encodeURIComponent(au(e));
}
X.escapeFragment = X$;
function au(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
X.escapeJsonPointer = au;
function hy(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
X.unescapeJsonPointer = hy;
function J$(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
X.eachItem = J$;
function Zd({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (i, o, a, s) => {
    const c = a === void 0 ? o : a instanceof Ee.Name ? (o instanceof Ee.Name ? e(i, o, a) : t(i, o, a), a) : o instanceof Ee.Name ? (t(i, a, o), o) : r(o, a);
    return s === Ee.Name && !(c instanceof Ee.Name) ? n(i, c) : c;
  };
}
X.mergeEvaluated = {
  props: Zd({
    mergeNames: (e, t, r) => e.if((0, Ee._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, Ee._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, Ee._)`${r} || {}`).code((0, Ee._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, Ee._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, Ee._)`${r} || {}`), su(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: py
  }),
  items: Zd({
    mergeNames: (e, t, r) => e.if((0, Ee._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, Ee._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, Ee._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, Ee._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function py(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, Ee._)`{}`);
  return t !== void 0 && su(e, r, t), r;
}
X.evaluatedPropsToName = py;
function su(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, Ee._)`${t}${(0, Ee.getProperty)(n)}`, !0));
}
X.setEvaluated = su;
const eh = {};
function Q$(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: eh[t.code] || (eh[t.code] = new H$._Code(t.code))
  });
}
X.useFunc = Q$;
var Sl;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Sl || (X.Type = Sl = {}));
function Z$(e, t, r) {
  if (e instanceof Ee.Name) {
    const n = t === Sl.Num;
    return r ? n ? (0, Ee._)`"[" + ${e} + "]"` : (0, Ee._)`"['" + ${e} + "']"` : n ? (0, Ee._)`"/" + ${e}` : (0, Ee._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, Ee.getProperty)(e).toString() : "/" + au(e);
}
X.getErrorPath = Z$;
function my(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
X.checkStrictMode = my;
var Dt = {};
Object.defineProperty(Dt, "__esModule", { value: !0 });
const nt = le, ew = {
  // validation function arguments
  data: new nt.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new nt.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new nt.Name("instancePath"),
  parentData: new nt.Name("parentData"),
  parentDataProperty: new nt.Name("parentDataProperty"),
  rootData: new nt.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new nt.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new nt.Name("vErrors"),
  // null or array of validation errors
  errors: new nt.Name("errors"),
  // counter of validation errors
  this: new nt.Name("this"),
  // "globals"
  self: new nt.Name("self"),
  scope: new nt.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new nt.Name("json"),
  jsonPos: new nt.Name("jsonPos"),
  jsonLen: new nt.Name("jsonLen"),
  jsonPart: new nt.Name("jsonPart")
};
Dt.default = ew;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = le, r = X, n = Dt;
  e.keywordError = {
    message: ({ keyword: v }) => (0, t.str)`must pass "${v}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: v, schemaType: y }) => y ? (0, t.str)`"${v}" keyword must be ${y} ($data)` : (0, t.str)`"${v}" keyword is invalid ($data)`
  };
  function i(v, y = e.keywordError, E, A) {
    const { it: C } = v, { gen: D, compositeRule: V, allErrors: z } = C, G = f(v, y, E);
    A ?? (V || z) ? c(D, G) : u(C, (0, t._)`[${G}]`);
  }
  e.reportError = i;
  function o(v, y = e.keywordError, E) {
    const { it: A } = v, { gen: C, compositeRule: D, allErrors: V } = A, z = f(v, y, E);
    c(C, z), D || V || u(A, n.default.vErrors);
  }
  e.reportExtraError = o;
  function a(v, y) {
    v.assign(n.default.errors, y), v.if((0, t._)`${n.default.vErrors} !== null`, () => v.if(y, () => v.assign((0, t._)`${n.default.vErrors}.length`, y), () => v.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function s({ gen: v, keyword: y, schemaValue: E, data: A, errsCount: C, it: D }) {
    if (C === void 0)
      throw new Error("ajv implementation error");
    const V = v.name("err");
    v.forRange("i", C, n.default.errors, (z) => {
      v.const(V, (0, t._)`${n.default.vErrors}[${z}]`), v.if((0, t._)`${V}.instancePath === undefined`, () => v.assign((0, t._)`${V}.instancePath`, (0, t.strConcat)(n.default.instancePath, D.errorPath))), v.assign((0, t._)`${V}.schemaPath`, (0, t.str)`${D.errSchemaPath}/${y}`), D.opts.verbose && (v.assign((0, t._)`${V}.schema`, E), v.assign((0, t._)`${V}.data`, A));
    });
  }
  e.extendErrors = s;
  function c(v, y) {
    const E = v.const("err", y);
    v.if((0, t._)`${n.default.vErrors} === null`, () => v.assign(n.default.vErrors, (0, t._)`[${E}]`), (0, t._)`${n.default.vErrors}.push(${E})`), v.code((0, t._)`${n.default.errors}++`);
  }
  function u(v, y) {
    const { gen: E, validateName: A, schemaEnv: C } = v;
    C.$async ? E.throw((0, t._)`new ${v.ValidationError}(${y})`) : (E.assign((0, t._)`${A}.errors`, y), E.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function f(v, y, E) {
    const { createErrors: A } = v.it;
    return A === !1 ? (0, t._)`{}` : h(v, y, E);
  }
  function h(v, y, E = {}) {
    const { gen: A, it: C } = v, D = [
      p(C, E),
      g(v, E)
    ];
    return $(v, y, D), A.object(...D);
  }
  function p({ errorPath: v }, { instancePath: y }) {
    const E = y ? (0, t.str)`${v}${(0, r.getErrorPath)(y, r.Type.Str)}` : v;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, E)];
  }
  function g({ keyword: v, it: { errSchemaPath: y } }, { schemaPath: E, parentSchema: A }) {
    let C = A ? y : (0, t.str)`${y}/${v}`;
    return E && (C = (0, t.str)`${C}${(0, r.getErrorPath)(E, r.Type.Str)}`), [l.schemaPath, C];
  }
  function $(v, { params: y, message: E }, A) {
    const { keyword: C, data: D, schemaValue: V, it: z } = v, { opts: G, propertyName: N, topSchemaRef: W, schemaPath: M } = z;
    A.push([l.keyword, C], [l.params, typeof y == "function" ? y(v) : y || (0, t._)`{}`]), G.messages && A.push([l.message, typeof E == "function" ? E(v) : E]), G.verbose && A.push([l.schema, V], [l.parentSchema, (0, t._)`${W}${M}`], [n.default.data, D]), N && A.push([l.propertyName, N]);
  }
})(Go);
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.boolOrEmptySchema = Pi.topBoolOrEmptySchema = void 0;
const tw = Go, rw = le, nw = Dt, iw = {
  message: "boolean schema is false"
};
function ow(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? yy(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(nw.default.data) : (t.assign((0, rw._)`${n}.errors`, null), t.return(!0));
}
Pi.topBoolOrEmptySchema = ow;
function aw(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), yy(e)) : r.var(t, !0);
}
Pi.boolOrEmptySchema = aw;
function yy(e, t) {
  const { gen: r, data: n } = e, i = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, tw.reportError)(i, iw, void 0, t);
}
var xe = {}, qn = {};
Object.defineProperty(qn, "__esModule", { value: !0 });
qn.getRules = qn.isJSONType = void 0;
const sw = ["string", "number", "integer", "boolean", "null", "object", "array"], cw = new Set(sw);
function lw(e) {
  return typeof e == "string" && cw.has(e);
}
qn.isJSONType = lw;
function uw() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
qn.getRules = uw;
var Or = {};
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.shouldUseRule = Or.shouldUseGroup = Or.schemaHasRulesForType = void 0;
function fw({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && gy(e, n);
}
Or.schemaHasRulesForType = fw;
function gy(e, t) {
  return t.rules.some((r) => vy(e, r));
}
Or.shouldUseGroup = gy;
function vy(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
Or.shouldUseRule = vy;
Object.defineProperty(xe, "__esModule", { value: !0 });
xe.reportTypeError = xe.checkDataTypes = xe.checkDataType = xe.coerceAndCheckDataType = xe.getJSONTypes = xe.getSchemaTypes = xe.DataType = void 0;
const dw = qn, hw = Or, pw = Go, fe = le, _y = X;
var gi;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(gi || (xe.DataType = gi = {}));
function mw(e) {
  const t = $y(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
xe.getSchemaTypes = mw;
function $y(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(dw.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
xe.getJSONTypes = $y;
function yw(e, t) {
  const { gen: r, data: n, opts: i } = e, o = gw(t, i.coerceTypes), a = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, hw.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const s = cu(t, n, i.strictNumbers, gi.Wrong);
    r.if(s, () => {
      o.length ? vw(e, t, o) : lu(e);
    });
  }
  return a;
}
xe.coerceAndCheckDataType = yw;
const wy = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function gw(e, t) {
  return t ? e.filter((r) => wy.has(r) || t === "array" && r === "array") : [];
}
function vw(e, t, r) {
  const { gen: n, data: i, opts: o } = e, a = n.let("dataType", (0, fe._)`typeof ${i}`), s = n.let("coerced", (0, fe._)`undefined`);
  o.coerceTypes === "array" && n.if((0, fe._)`${a} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, fe._)`${i}[0]`).assign(a, (0, fe._)`typeof ${i}`).if(cu(t, i, o.strictNumbers), () => n.assign(s, i))), n.if((0, fe._)`${s} !== undefined`);
  for (const u of r)
    (wy.has(u) || u === "array" && o.coerceTypes === "array") && c(u);
  n.else(), lu(e), n.endIf(), n.if((0, fe._)`${s} !== undefined`, () => {
    n.assign(i, s), _w(e, s);
  });
  function c(u) {
    switch (u) {
      case "string":
        n.elseIf((0, fe._)`${a} == "number" || ${a} == "boolean"`).assign(s, (0, fe._)`"" + ${i}`).elseIf((0, fe._)`${i} === null`).assign(s, (0, fe._)`""`);
        return;
      case "number":
        n.elseIf((0, fe._)`${a} == "boolean" || ${i} === null
              || (${a} == "string" && ${i} && ${i} == +${i})`).assign(s, (0, fe._)`+${i}`);
        return;
      case "integer":
        n.elseIf((0, fe._)`${a} === "boolean" || ${i} === null
              || (${a} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(s, (0, fe._)`+${i}`);
        return;
      case "boolean":
        n.elseIf((0, fe._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(s, !1).elseIf((0, fe._)`${i} === "true" || ${i} === 1`).assign(s, !0);
        return;
      case "null":
        n.elseIf((0, fe._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(s, null);
        return;
      case "array":
        n.elseIf((0, fe._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${i} === null`).assign(s, (0, fe._)`[${i}]`);
    }
  }
}
function _w({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, fe._)`${t} !== undefined`, () => e.assign((0, fe._)`${t}[${r}]`, n));
}
function Pl(e, t, r, n = gi.Correct) {
  const i = n === gi.Correct ? fe.operators.EQ : fe.operators.NEQ;
  let o;
  switch (e) {
    case "null":
      return (0, fe._)`${t} ${i} null`;
    case "array":
      o = (0, fe._)`Array.isArray(${t})`;
      break;
    case "object":
      o = (0, fe._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      o = a((0, fe._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      o = a();
      break;
    default:
      return (0, fe._)`typeof ${t} ${i} ${e}`;
  }
  return n === gi.Correct ? o : (0, fe.not)(o);
  function a(s = fe.nil) {
    return (0, fe.and)((0, fe._)`typeof ${t} == "number"`, s, r ? (0, fe._)`isFinite(${t})` : fe.nil);
  }
}
xe.checkDataType = Pl;
function cu(e, t, r, n) {
  if (e.length === 1)
    return Pl(e[0], t, r, n);
  let i;
  const o = (0, _y.toHash)(e);
  if (o.array && o.object) {
    const a = (0, fe._)`typeof ${t} != "object"`;
    i = o.null ? a : (0, fe._)`!${t} || ${a}`, delete o.null, delete o.array, delete o.object;
  } else
    i = fe.nil;
  o.number && delete o.integer;
  for (const a in o)
    i = (0, fe.and)(i, Pl(a, t, r, n));
  return i;
}
xe.checkDataTypes = cu;
const $w = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, fe._)`{type: ${e}}` : (0, fe._)`{type: ${t}}`
};
function lu(e) {
  const t = ww(e);
  (0, pw.reportError)(t, $w);
}
xe.reportTypeError = lu;
function ww(e) {
  const { gen: t, data: r, schema: n } = e, i = (0, _y.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: i,
    schemaValue: i,
    parentSchema: n,
    params: {},
    it: e
  };
}
var Fs = {};
Object.defineProperty(Fs, "__esModule", { value: !0 });
Fs.assignDefaults = void 0;
const Xn = le, Ew = X;
function bw(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const i in r)
      th(e, i, r[i].default);
  else t === "array" && Array.isArray(n) && n.forEach((i, o) => th(e, o, i.default));
}
Fs.assignDefaults = bw;
function th(e, t, r) {
  const { gen: n, compositeRule: i, data: o, opts: a } = e;
  if (r === void 0)
    return;
  const s = (0, Xn._)`${o}${(0, Xn.getProperty)(t)}`;
  if (i) {
    (0, Ew.checkStrictMode)(e, `default is ignored for: ${s}`);
    return;
  }
  let c = (0, Xn._)`${s} === undefined`;
  a.useDefaults === "empty" && (c = (0, Xn._)`${c} || ${s} === null || ${s} === ""`), n.if(c, (0, Xn._)`${s} = ${(0, Xn.stringify)(r)}`);
}
var fr = {}, pe = {};
Object.defineProperty(pe, "__esModule", { value: !0 });
pe.validateUnion = pe.validateArray = pe.usePattern = pe.callValidateCode = pe.schemaProperties = pe.allSchemaProperties = pe.noPropertyInData = pe.propertyInData = pe.isOwnProperty = pe.hasPropFunc = pe.reportMissingProp = pe.checkMissingProp = pe.checkReportMissingProp = void 0;
const Ae = le, uu = X, Br = Dt, Sw = X;
function Pw(e, t) {
  const { gen: r, data: n, it: i } = e;
  r.if(du(r, n, t, i.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Ae._)`${t}` }, !0), e.error();
  });
}
pe.checkReportMissingProp = Pw;
function Tw({ gen: e, data: t, it: { opts: r } }, n, i) {
  return (0, Ae.or)(...n.map((o) => (0, Ae.and)(du(e, t, o, r.ownProperties), (0, Ae._)`${i} = ${o}`)));
}
pe.checkMissingProp = Tw;
function Ow(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
pe.reportMissingProp = Ow;
function Ey(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Ae._)`Object.prototype.hasOwnProperty`
  });
}
pe.hasPropFunc = Ey;
function fu(e, t, r) {
  return (0, Ae._)`${Ey(e)}.call(${t}, ${r})`;
}
pe.isOwnProperty = fu;
function Aw(e, t, r, n) {
  const i = (0, Ae._)`${t}${(0, Ae.getProperty)(r)} !== undefined`;
  return n ? (0, Ae._)`${i} && ${fu(e, t, r)}` : i;
}
pe.propertyInData = Aw;
function du(e, t, r, n) {
  const i = (0, Ae._)`${t}${(0, Ae.getProperty)(r)} === undefined`;
  return n ? (0, Ae.or)(i, (0, Ae.not)(fu(e, t, r))) : i;
}
pe.noPropertyInData = du;
function by(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
pe.allSchemaProperties = by;
function Nw(e, t) {
  return by(t).filter((r) => !(0, uu.alwaysValidSchema)(e, t[r]));
}
pe.schemaProperties = Nw;
function Iw({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: i, errorPath: o }, it: a }, s, c, u) {
  const l = u ? (0, Ae._)`${e}, ${t}, ${n}${i}` : t, f = [
    [Br.default.instancePath, (0, Ae.strConcat)(Br.default.instancePath, o)],
    [Br.default.parentData, a.parentData],
    [Br.default.parentDataProperty, a.parentDataProperty],
    [Br.default.rootData, Br.default.rootData]
  ];
  a.opts.dynamicRef && f.push([Br.default.dynamicAnchors, Br.default.dynamicAnchors]);
  const h = (0, Ae._)`${l}, ${r.object(...f)}`;
  return c !== Ae.nil ? (0, Ae._)`${s}.call(${c}, ${h})` : (0, Ae._)`${s}(${h})`;
}
pe.callValidateCode = Iw;
const Cw = (0, Ae._)`new RegExp`;
function Rw({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: i } = t.code, o = i(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, Ae._)`${i.code === "new RegExp" ? Cw : (0, Sw.useFunc)(e, i)}(${r}, ${n})`
  });
}
pe.usePattern = Rw;
function Dw(e) {
  const { gen: t, data: r, keyword: n, it: i } = e, o = t.name("valid");
  if (i.allErrors) {
    const s = t.let("valid", !0);
    return a(() => t.assign(s, !1)), s;
  }
  return t.var(o, !0), a(() => t.break()), o;
  function a(s) {
    const c = t.const("len", (0, Ae._)`${r}.length`);
    t.forRange("i", 0, c, (u) => {
      e.subschema({
        keyword: n,
        dataProp: u,
        dataPropType: uu.Type.Num
      }, o), t.if((0, Ae.not)(o), s);
    });
  }
}
pe.validateArray = Dw;
function kw(e) {
  const { gen: t, schema: r, keyword: n, it: i } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, uu.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
    return;
  const a = t.let("valid", !1), s = t.name("_valid");
  t.block(() => r.forEach((c, u) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: u,
      compositeRule: !0
    }, s);
    t.assign(a, (0, Ae._)`${a} || ${s}`), e.mergeValidEvaluated(l, s) || t.if((0, Ae.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
pe.validateUnion = kw;
Object.defineProperty(fr, "__esModule", { value: !0 });
fr.validateKeywordUsage = fr.validSchemaType = fr.funcKeywordCode = fr.macroKeywordCode = void 0;
const ft = le, On = Dt, jw = pe, Fw = Go;
function Lw(e, t) {
  const { gen: r, keyword: n, schema: i, parentSchema: o, it: a } = e, s = t.macro.call(a.self, i, o, a), c = Sy(r, n, s);
  a.opts.validateSchema !== !1 && a.self.validateSchema(s, !0);
  const u = r.name("valid");
  e.subschema({
    schema: s,
    schemaPath: ft.nil,
    errSchemaPath: `${a.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, u), e.pass(u, () => e.error(!0));
}
fr.macroKeywordCode = Lw;
function Uw(e, t) {
  var r;
  const { gen: n, keyword: i, schema: o, parentSchema: a, $data: s, it: c } = e;
  xw(c, t);
  const u = !s && t.compile ? t.compile.call(c.self, o, a, c) : t.validate, l = Sy(n, i, u), f = n.let("valid");
  e.block$data(f, h), e.ok((r = t.valid) !== null && r !== void 0 ? r : f);
  function h() {
    if (t.errors === !1)
      $(), t.modifying && rh(e), v(() => e.error());
    else {
      const y = t.async ? p() : g();
      t.modifying && rh(e), v(() => Mw(e, y));
    }
  }
  function p() {
    const y = n.let("ruleErrs", null);
    return n.try(() => $((0, ft._)`await `), (E) => n.assign(f, !1).if((0, ft._)`${E} instanceof ${c.ValidationError}`, () => n.assign(y, (0, ft._)`${E}.errors`), () => n.throw(E))), y;
  }
  function g() {
    const y = (0, ft._)`${l}.errors`;
    return n.assign(y, null), $(ft.nil), y;
  }
  function $(y = t.async ? (0, ft._)`await ` : ft.nil) {
    const E = c.opts.passContext ? On.default.this : On.default.self, A = !("compile" in t && !s || t.schema === !1);
    n.assign(f, (0, ft._)`${y}${(0, jw.callValidateCode)(e, l, E, A)}`, t.modifying);
  }
  function v(y) {
    var E;
    n.if((0, ft.not)((E = t.valid) !== null && E !== void 0 ? E : f), y);
  }
}
fr.funcKeywordCode = Uw;
function rh(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, ft._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Mw(e, t) {
  const { gen: r } = e;
  r.if((0, ft._)`Array.isArray(${t})`, () => {
    r.assign(On.default.vErrors, (0, ft._)`${On.default.vErrors} === null ? ${t} : ${On.default.vErrors}.concat(${t})`).assign(On.default.errors, (0, ft._)`${On.default.vErrors}.length`), (0, Fw.extendErrors)(e);
  }, () => e.error());
}
function xw({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Sy(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, ft.stringify)(r) });
}
function Vw(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
fr.validSchemaType = Vw;
function qw({ schema: e, opts: t, self: r, errSchemaPath: n }, i, o) {
  if (Array.isArray(i.keyword) ? !i.keyword.includes(o) : i.keyword !== o)
    throw new Error("ajv implementation error");
  const a = i.dependencies;
  if (a != null && a.some((s) => !Object.prototype.hasOwnProperty.call(e, s)))
    throw new Error(`parent schema must have dependencies of ${o}: ${a.join(",")}`);
  if (i.validateSchema && !i.validateSchema(e[o])) {
    const c = `keyword "${o}" value is invalid at path "${n}": ` + r.errorsText(i.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
fr.validateKeywordUsage = qw;
var an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
an.extendSubschemaMode = an.extendSubschemaData = an.getSubschema = void 0;
const lr = le, Py = X;
function Bw(e, { keyword: t, schemaProp: r, schema: n, schemaPath: i, errSchemaPath: o, topSchemaRef: a }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const s = e.schema[t];
    return r === void 0 ? {
      schema: s,
      schemaPath: (0, lr._)`${e.schemaPath}${(0, lr.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: s[r],
      schemaPath: (0, lr._)`${e.schemaPath}${(0, lr.getProperty)(t)}${(0, lr.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Py.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (i === void 0 || o === void 0 || a === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: i,
      topSchemaRef: a,
      errSchemaPath: o
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
an.getSubschema = Bw;
function Hw(e, t, { dataProp: r, dataPropType: n, data: i, dataTypes: o, propertyName: a }) {
  if (i !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: s } = t;
  if (r !== void 0) {
    const { errorPath: u, dataPathArr: l, opts: f } = t, h = s.let("data", (0, lr._)`${t.data}${(0, lr.getProperty)(r)}`, !0);
    c(h), e.errorPath = (0, lr.str)`${u}${(0, Py.getErrorPath)(r, n, f.jsPropertySyntax)}`, e.parentDataProperty = (0, lr._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (i !== void 0) {
    const u = i instanceof lr.Name ? i : s.let("data", i, !0);
    c(u), a !== void 0 && (e.propertyName = a);
  }
  o && (e.dataTypes = o);
  function c(u) {
    e.data = u, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, u];
  }
}
an.extendSubschemaData = Hw;
function zw(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: i, allErrors: o }) {
  n !== void 0 && (e.compositeRule = n), i !== void 0 && (e.createErrors = i), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
an.extendSubschemaMode = zw;
var Xe = {}, Ls = function e(t, r) {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    var n, i, o;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length) return !1;
      for (i = n; i-- !== 0; )
        if (!e(t[i], r[i])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    if (o = Object.keys(t), n = o.length, n !== Object.keys(r).length) return !1;
    for (i = n; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, o[i])) return !1;
    for (i = n; i-- !== 0; ) {
      var a = o[i];
      if (!e(t[a], r[a])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, Ty = { exports: {} }, tn = Ty.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, i = r.post || function() {
  };
  Wa(t, n, i, e, "", e);
};
tn.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
tn.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
tn.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
tn.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Wa(e, t, r, n, i, o, a, s, c, u) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, i, o, a, s, c, u);
    for (var l in n) {
      var f = n[l];
      if (Array.isArray(f)) {
        if (l in tn.arrayKeywords)
          for (var h = 0; h < f.length; h++)
            Wa(e, t, r, f[h], i + "/" + l + "/" + h, o, i, l, n, h);
      } else if (l in tn.propsKeywords) {
        if (f && typeof f == "object")
          for (var p in f)
            Wa(e, t, r, f[p], i + "/" + l + "/" + Gw(p), o, i, l, n, p);
      } else (l in tn.keywords || e.allKeys && !(l in tn.skipKeywords)) && Wa(e, t, r, f, i + "/" + l, o, i, l, n);
    }
    r(n, i, o, a, s, c, u);
  }
}
function Gw(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Kw = Ty.exports;
Object.defineProperty(Xe, "__esModule", { value: !0 });
Xe.getSchemaRefs = Xe.resolveUrl = Xe.normalizeId = Xe._getFullPath = Xe.getFullPath = Xe.inlineRef = void 0;
const Ww = X, Yw = Ls, Xw = Kw, Jw = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function Qw(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Tl(e) : t ? Oy(e) <= t : !1;
}
Xe.inlineRef = Qw;
const Zw = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Tl(e) {
  for (const t in e) {
    if (Zw.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Tl) || typeof r == "object" && Tl(r))
      return !0;
  }
  return !1;
}
function Oy(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Jw.has(r) && (typeof e[r] == "object" && (0, Ww.eachItem)(e[r], (n) => t += Oy(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Ay(e, t = "", r) {
  r !== !1 && (t = vi(t));
  const n = e.parse(t);
  return Ny(e, n);
}
Xe.getFullPath = Ay;
function Ny(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Xe._getFullPath = Ny;
const eE = /#\/?$/;
function vi(e) {
  return e ? e.replace(eE, "") : "";
}
Xe.normalizeId = vi;
function tE(e, t, r) {
  return r = vi(r), e.resolve(t, r);
}
Xe.resolveUrl = tE;
const rE = /^[a-z_][-a-z0-9._]*$/i;
function nE(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, i = vi(e[r] || t), o = { "": i }, a = Ay(n, i, !1), s = {}, c = /* @__PURE__ */ new Set();
  return Xw(e, { allKeys: !0 }, (f, h, p, g) => {
    if (g === void 0)
      return;
    const $ = a + h;
    let v = o[g];
    typeof f[r] == "string" && (v = y.call(this, f[r])), E.call(this, f.$anchor), E.call(this, f.$dynamicAnchor), o[h] = v;
    function y(A) {
      const C = this.opts.uriResolver.resolve;
      if (A = vi(v ? C(v, A) : A), c.has(A))
        throw l(A);
      c.add(A);
      let D = this.refs[A];
      return typeof D == "string" && (D = this.refs[D]), typeof D == "object" ? u(f, D.schema, A) : A !== vi($) && (A[0] === "#" ? (u(f, s[A], A), s[A] = f) : this.refs[A] = $), A;
    }
    function E(A) {
      if (typeof A == "string") {
        if (!rE.test(A))
          throw new Error(`invalid anchor "${A}"`);
        y.call(this, `#${A}`);
      }
    }
  }), s;
  function u(f, h, p) {
    if (h !== void 0 && !Yw(f, h))
      throw l(p);
  }
  function l(f) {
    return new Error(`reference "${f}" resolves to more than one schema`);
  }
}
Xe.getSchemaRefs = nE;
Object.defineProperty(tr, "__esModule", { value: !0 });
tr.getData = tr.KeywordCxt = tr.validateFunctionCode = void 0;
const Iy = Pi, nh = xe, hu = Or, ls = xe, iE = Fs, po = fr, Oc = an, ee = le, oe = Dt, oE = Xe, Ar = X, Ji = Go;
function aE(e) {
  if (Dy(e) && (ky(e), Ry(e))) {
    lE(e);
    return;
  }
  Cy(e, () => (0, Iy.topBoolOrEmptySchema)(e));
}
tr.validateFunctionCode = aE;
function Cy({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: i }, o) {
  i.code.es5 ? e.func(t, (0, ee._)`${oe.default.data}, ${oe.default.valCxt}`, n.$async, () => {
    e.code((0, ee._)`"use strict"; ${ih(r, i)}`), cE(e, i), e.code(o);
  }) : e.func(t, (0, ee._)`${oe.default.data}, ${sE(i)}`, n.$async, () => e.code(ih(r, i)).code(o));
}
function sE(e) {
  return (0, ee._)`{${oe.default.instancePath}="", ${oe.default.parentData}, ${oe.default.parentDataProperty}, ${oe.default.rootData}=${oe.default.data}${e.dynamicRef ? (0, ee._)`, ${oe.default.dynamicAnchors}={}` : ee.nil}}={}`;
}
function cE(e, t) {
  e.if(oe.default.valCxt, () => {
    e.var(oe.default.instancePath, (0, ee._)`${oe.default.valCxt}.${oe.default.instancePath}`), e.var(oe.default.parentData, (0, ee._)`${oe.default.valCxt}.${oe.default.parentData}`), e.var(oe.default.parentDataProperty, (0, ee._)`${oe.default.valCxt}.${oe.default.parentDataProperty}`), e.var(oe.default.rootData, (0, ee._)`${oe.default.valCxt}.${oe.default.rootData}`), t.dynamicRef && e.var(oe.default.dynamicAnchors, (0, ee._)`${oe.default.valCxt}.${oe.default.dynamicAnchors}`);
  }, () => {
    e.var(oe.default.instancePath, (0, ee._)`""`), e.var(oe.default.parentData, (0, ee._)`undefined`), e.var(oe.default.parentDataProperty, (0, ee._)`undefined`), e.var(oe.default.rootData, oe.default.data), t.dynamicRef && e.var(oe.default.dynamicAnchors, (0, ee._)`{}`);
  });
}
function lE(e) {
  const { schema: t, opts: r, gen: n } = e;
  Cy(e, () => {
    r.$comment && t.$comment && Fy(e), pE(e), n.let(oe.default.vErrors, null), n.let(oe.default.errors, 0), r.unevaluated && uE(e), jy(e), gE(e);
  });
}
function uE(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, ee._)`${r}.evaluated`), t.if((0, ee._)`${e.evaluated}.dynamicProps`, () => t.assign((0, ee._)`${e.evaluated}.props`, (0, ee._)`undefined`)), t.if((0, ee._)`${e.evaluated}.dynamicItems`, () => t.assign((0, ee._)`${e.evaluated}.items`, (0, ee._)`undefined`));
}
function ih(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, ee._)`/*# sourceURL=${r} */` : ee.nil;
}
function fE(e, t) {
  if (Dy(e) && (ky(e), Ry(e))) {
    dE(e, t);
    return;
  }
  (0, Iy.boolOrEmptySchema)(e, t);
}
function Ry({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Dy(e) {
  return typeof e.schema != "boolean";
}
function dE(e, t) {
  const { schema: r, gen: n, opts: i } = e;
  i.$comment && r.$comment && Fy(e), mE(e), yE(e);
  const o = n.const("_errs", oe.default.errors);
  jy(e, o), n.var(t, (0, ee._)`${o} === ${oe.default.errors}`);
}
function ky(e) {
  (0, Ar.checkUnknownRules)(e), hE(e);
}
function jy(e, t) {
  if (e.opts.jtd)
    return oh(e, [], !1, t);
  const r = (0, nh.getSchemaTypes)(e.schema), n = (0, nh.coerceAndCheckDataType)(e, r);
  oh(e, r, !n, t);
}
function hE(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: i } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Ar.schemaHasRulesButRef)(t, i.RULES) && i.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function pE(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Ar.checkStrictMode)(e, "default is ignored in the schema root");
}
function mE(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, oE.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function yE(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Fy({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: i }) {
  const o = r.$comment;
  if (i.$comment === !0)
    e.code((0, ee._)`${oe.default.self}.logger.log(${o})`);
  else if (typeof i.$comment == "function") {
    const a = (0, ee.str)`${n}/$comment`, s = e.scopeValue("root", { ref: t.root });
    e.code((0, ee._)`${oe.default.self}.opts.$comment(${o}, ${a}, ${s}.schema)`);
  }
}
function gE(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: i, opts: o } = e;
  r.$async ? t.if((0, ee._)`${oe.default.errors} === 0`, () => t.return(oe.default.data), () => t.throw((0, ee._)`new ${i}(${oe.default.vErrors})`)) : (t.assign((0, ee._)`${n}.errors`, oe.default.vErrors), o.unevaluated && vE(e), t.return((0, ee._)`${oe.default.errors} === 0`));
}
function vE({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof ee.Name && e.assign((0, ee._)`${t}.props`, r), n instanceof ee.Name && e.assign((0, ee._)`${t}.items`, n);
}
function oh(e, t, r, n) {
  const { gen: i, schema: o, data: a, allErrors: s, opts: c, self: u } = e, { RULES: l } = u;
  if (o.$ref && (c.ignoreKeywordsWithRef || !(0, Ar.schemaHasRulesButRef)(o, l))) {
    i.block(() => My(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || _E(e, t), i.block(() => {
    for (const h of l.rules)
      f(h);
    f(l.post);
  });
  function f(h) {
    (0, hu.shouldUseGroup)(o, h) && (h.type ? (i.if((0, ls.checkDataType)(h.type, a, c.strictNumbers)), ah(e, h), t.length === 1 && t[0] === h.type && r && (i.else(), (0, ls.reportTypeError)(e)), i.endIf()) : ah(e, h), s || i.if((0, ee._)`${oe.default.errors} === ${n || 0}`));
  }
}
function ah(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: i } } = e;
  i && (0, iE.assignDefaults)(e, t.type), r.block(() => {
    for (const o of t.rules)
      (0, hu.shouldUseRule)(n, o) && My(e, o.keyword, o.definition, t.type);
  });
}
function _E(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || ($E(e, t), e.opts.allowUnionTypes || wE(e, t), EE(e, e.dataTypes));
}
function $E(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Ly(e.dataTypes, r) || pu(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), SE(e, t);
  }
}
function wE(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && pu(e, "use allowUnionTypes to allow union type keyword");
}
function EE(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const i = r[n];
    if (typeof i == "object" && (0, hu.shouldUseRule)(e.schema, i)) {
      const { type: o } = i.definition;
      o.length && !o.some((a) => bE(t, a)) && pu(e, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function bE(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Ly(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function SE(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Ly(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function pu(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, Ar.checkStrictMode)(e, t, e.opts.strictTypes);
}
let Uy = class {
  constructor(t, r, n) {
    if ((0, po.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Ar.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", xy(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, po.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", oe.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, ee.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, ee.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, ee._)`${r} !== undefined && (${(0, ee.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Ji.reportExtraError : Ji.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Ji.reportError)(this, this.def.$dataError || Ji.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Ji.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = ee.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = ee.nil, r = ee.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: i, schemaType: o, def: a } = this;
    n.if((0, ee.or)((0, ee._)`${i} === undefined`, r)), t !== ee.nil && n.assign(t, !0), (o.length || a.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== ee.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: i, it: o } = this;
    return (0, ee.or)(a(), s());
    function a() {
      if (n.length) {
        if (!(r instanceof ee.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, ee._)`${(0, ls.checkDataTypes)(c, r, o.opts.strictNumbers, ls.DataType.Wrong)}`;
      }
      return ee.nil;
    }
    function s() {
      if (i.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: i.validateSchema });
        return (0, ee._)`!${c}(${r})`;
      }
      return ee.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Oc.getSubschema)(this.it, t);
    (0, Oc.extendSubschemaData)(n, this.it, t), (0, Oc.extendSubschemaMode)(n, t);
    const i = { ...this.it, ...n, items: void 0, props: void 0 };
    return fE(i, r), i;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: i } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = Ar.mergeEvaluated.props(i, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = Ar.mergeEvaluated.items(i, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: i } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return i.if(r, () => this.mergeEvaluated(t, ee.Name)), !0;
  }
};
tr.KeywordCxt = Uy;
function My(e, t, r, n) {
  const i = new Uy(e, r, t);
  "code" in r ? r.code(i, n) : i.$data && r.validate ? (0, po.funcKeywordCode)(i, r) : "macro" in r ? (0, po.macroKeywordCode)(i, r) : (r.compile || r.validate) && (0, po.funcKeywordCode)(i, r);
}
const PE = /^\/(?:[^~]|~0|~1)*$/, TE = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function xy(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let i, o;
  if (e === "")
    return oe.default.rootData;
  if (e[0] === "/") {
    if (!PE.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    i = e, o = oe.default.rootData;
  } else {
    const u = TE.exec(e);
    if (!u)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +u[1];
    if (i = u[2], i === "#") {
      if (l >= t)
        throw new Error(c("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(c("data", l));
    if (o = r[t - l], !i)
      return o;
  }
  let a = o;
  const s = i.split("/");
  for (const u of s)
    u && (o = (0, ee._)`${o}${(0, ee.getProperty)((0, Ar.unescapeJsonPointer)(u))}`, a = (0, ee._)`${a} && ${o}`);
  return a;
  function c(u, l) {
    return `Cannot access ${u} ${l} levels up, current level is ${t}`;
  }
}
tr.getData = xy;
var Ko = {};
Object.defineProperty(Ko, "__esModule", { value: !0 });
let OE = class extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
};
Ko.default = OE;
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
const Ac = Xe;
let AE = class extends Error {
  constructor(t, r, n, i) {
    super(i || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ac.resolveUrl)(t, r, n), this.missingSchema = (0, Ac.normalizeId)((0, Ac.getFullPath)(t, this.missingRef));
  }
};
ki.default = AE;
var pt = {};
Object.defineProperty(pt, "__esModule", { value: !0 });
pt.resolveSchema = pt.getCompilingSchema = pt.resolveRef = pt.compileSchema = pt.SchemaEnv = void 0;
const zt = le, NE = Ko, En = Dt, Zt = Xe, sh = X, IE = tr;
let Us = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Zt.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
pt.SchemaEnv = Us;
function mu(e) {
  const t = Vy.call(this, e);
  if (t)
    return t;
  const r = (0, Zt.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: i } = this.opts.code, { ownProperties: o } = this.opts, a = new zt.CodeGen(this.scope, { es5: n, lines: i, ownProperties: o });
  let s;
  e.$async && (s = a.scopeValue("Error", {
    ref: NE.default,
    code: (0, zt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = a.scopeName("validate");
  e.validateName = c;
  const u = {
    gen: a,
    allErrors: this.opts.allErrors,
    data: En.default.data,
    parentData: En.default.parentData,
    parentDataProperty: En.default.parentDataProperty,
    dataNames: [En.default.data],
    dataPathArr: [zt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: a.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, zt.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: s,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: zt.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, zt._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, IE.validateFunctionCode)(u), a.optimize(this.opts.code.optimize);
    const f = a.toString();
    l = `${a.scopeRefs(En.default.scope)}return ${f}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const p = new Function(`${En.default.self}`, `${En.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: p }), p.errors = null, p.schema = e.schema, p.schemaEnv = e, e.$async && (p.$async = !0), this.opts.code.source === !0 && (p.source = { validateName: c, validateCode: f, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: g, items: $ } = u;
      p.evaluated = {
        props: g instanceof zt.Name ? void 0 : g,
        items: $ instanceof zt.Name ? void 0 : $,
        dynamicProps: g instanceof zt.Name,
        dynamicItems: $ instanceof zt.Name
      }, p.source && (p.source.evaluated = (0, zt.stringify)(p.evaluated));
    }
    return e.validate = p, e;
  } catch (f) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), f;
  } finally {
    this._compilations.delete(e);
  }
}
pt.compileSchema = mu;
function CE(e, t, r) {
  var n;
  r = (0, Zt.resolveUrl)(this.opts.uriResolver, t, r);
  const i = e.refs[r];
  if (i)
    return i;
  let o = kE.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: s } = this.opts;
    a && (o = new Us({ schema: a, schemaId: s, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = RE.call(this, o);
}
pt.resolveRef = CE;
function RE(e) {
  return (0, Zt.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : mu.call(this, e);
}
function Vy(e) {
  for (const t of this._compilations)
    if (DE(t, e))
      return t;
}
pt.getCompilingSchema = Vy;
function DE(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function kE(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Ms.call(this, e, t);
}
function Ms(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Zt._getFullPath)(this.opts.uriResolver, r);
  let i = (0, Zt.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === i)
    return Nc.call(this, r, e);
  const o = (0, Zt.normalizeId)(n), a = this.refs[o] || this.schemas[o];
  if (typeof a == "string") {
    const s = Ms.call(this, e, a);
    return typeof (s == null ? void 0 : s.schema) != "object" ? void 0 : Nc.call(this, r, s);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || mu.call(this, a), o === (0, Zt.normalizeId)(t)) {
      const { schema: s } = a, { schemaId: c } = this.opts, u = s[c];
      return u && (i = (0, Zt.resolveUrl)(this.opts.uriResolver, i, u)), new Us({ schema: s, schemaId: c, root: e, baseId: i });
    }
    return Nc.call(this, r, a);
  }
}
pt.resolveSchema = Ms;
const jE = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Nc(e, { baseId: t, schema: r, root: n }) {
  var i;
  if (((i = e.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const s of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, sh.unescapeFragment)(s)];
    if (c === void 0)
      return;
    r = c;
    const u = typeof r == "object" && r[this.opts.schemaId];
    !jE.has(s) && u && (t = (0, Zt.resolveUrl)(this.opts.uriResolver, t, u));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, sh.schemaHasRulesButRef)(r, this.RULES)) {
    const s = (0, Zt.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = Ms.call(this, n, s);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new Us({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const FE = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", LE = "Meta-schema for $data reference (JSON AnySchema extension proposal)", UE = "object", ME = [
  "$data"
], xE = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, VE = !1, qE = {
  $id: FE,
  description: LE,
  type: UE,
  required: ME,
  properties: xE,
  additionalProperties: VE
};
var yu = {}, xs = { exports: {} };
const BE = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), qy = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
function By(e) {
  let t = "", r = 0, n = 0;
  for (n = 0; n < e.length; n++)
    if (r = e[n].charCodeAt(0), r !== 48) {
      if (!(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
        return "";
      t += e[n];
      break;
    }
  for (n += 1; n < e.length; n++) {
    if (r = e[n].charCodeAt(0), !(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
      return "";
    t += e[n];
  }
  return t;
}
const HE = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function ch(e) {
  return e.length = 0, !0;
}
function zE(e, t, r) {
  if (e.length) {
    const n = By(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function GE(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], i = [];
  let o = !1, a = !1, s = zE;
  for (let c = 0; c < e.length; c++) {
    const u = e[c];
    if (!(u === "[" || u === "]"))
      if (u === ":") {
        if (o === !0 && (a = !0), !s(i, n, r))
          break;
        if (++t > 7) {
          r.error = !0;
          break;
        }
        c > 0 && e[c - 1] === ":" && (o = !0), n.push(":");
        continue;
      } else if (u === "%") {
        if (!s(i, n, r))
          break;
        s = ch;
      } else {
        i.push(u);
        continue;
      }
  }
  return i.length && (s === ch ? r.zone = i.join("") : a ? n.push(i.join("")) : n.push(By(i))), r.address = n.join(""), r;
}
function Hy(e) {
  if (KE(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = GE(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function KE(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function WE(e) {
  let t = e;
  const r = [];
  let n = -1, i = 0;
  for (; i = t.length; ) {
    if (i === 1) {
      if (t === ".")
        break;
      if (t === "/") {
        r.push("/");
        break;
      } else {
        r.push(t);
        break;
      }
    } else if (i === 2) {
      if (t[0] === ".") {
        if (t[1] === ".")
          break;
        if (t[1] === "/") {
          t = t.slice(2);
          continue;
        }
      } else if (t[0] === "/" && (t[1] === "." || t[1] === "/")) {
        r.push("/");
        break;
      }
    } else if (i === 3 && t === "/..") {
      r.length !== 0 && r.pop(), r.push("/");
      break;
    }
    if (t[0] === ".") {
      if (t[1] === ".") {
        if (t[2] === "/") {
          t = t.slice(3);
          continue;
        }
      } else if (t[1] === "/") {
        t = t.slice(2);
        continue;
      }
    } else if (t[0] === "/" && t[1] === ".") {
      if (t[2] === "/") {
        t = t.slice(2);
        continue;
      } else if (t[2] === "." && t[3] === "/") {
        t = t.slice(3), r.length !== 0 && r.pop();
        continue;
      }
    }
    if ((n = t.indexOf("/", 1)) === -1) {
      r.push(t);
      break;
    } else
      r.push(t.slice(0, n)), t = t.slice(n);
  }
  return r.join("");
}
function YE(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function XE(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!qy(r)) {
      const n = Hy(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var zy = {
  nonSimpleDomain: HE,
  recomposeAuthority: XE,
  normalizeComponentEncoding: YE,
  removeDotSegments: WE,
  isIPv4: qy,
  isUUID: BE,
  normalizeIPv6: Hy
};
const { isUUID: JE } = zy, QE = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Gy(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function Ky(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function Wy(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function ZE(e) {
  return e.secure = Gy(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function eb(e) {
  if ((e.port === (Gy(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function tb(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(QE);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const i = `${n}:${t.nid || e.nid}`, o = gu(i);
    e.path = void 0, o && (e = o.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function rb(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), i = `${r}:${t.nid || n}`, o = gu(i);
  o && (e = o.serialize(e, t));
  const a = e, s = e.nss;
  return a.path = `${n || t.nid}:${s}`, t.skipEscape = !0, a;
}
function nb(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !JE(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function ib(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const Yy = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: Ky,
    serialize: Wy
  }
), ob = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: Yy.domainHost,
    parse: Ky,
    serialize: Wy
  }
), Ya = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: ZE,
    serialize: eb
  }
), ab = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: Ya.domainHost,
    parse: Ya.parse,
    serialize: Ya.serialize
  }
), sb = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: tb,
    serialize: rb,
    skipNormalize: !0
  }
), cb = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: nb,
    serialize: ib,
    skipNormalize: !0
  }
), us = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: Yy,
    https: ob,
    ws: Ya,
    wss: ab,
    urn: sb,
    "urn:uuid": cb
  }
);
Object.setPrototypeOf(us, null);
function gu(e) {
  return e && (us[
    /** @type {SchemeName} */
    e
  ] || us[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var lb = {
  SCHEMES: us,
  getSchemeHandler: gu
};
const { normalizeIPv6: ub, removeDotSegments: co, recomposeAuthority: fb, normalizeComponentEncoding: ga, isIPv4: db, nonSimpleDomain: hb } = zy, { SCHEMES: pb, getSchemeHandler: Xy } = lb;
function mb(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  dr(Rr(e, t), t) : typeof e == "object" && (e = /** @type {T} */
  Rr(dr(e, t), t)), e;
}
function yb(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, i = Jy(Rr(e, n), Rr(t, n), n, !0);
  return n.skipEscape = !0, dr(i, n);
}
function Jy(e, t, r, n) {
  const i = {};
  return n || (e = Rr(dr(e, r), r), t = Rr(dr(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (i.scheme = t.scheme, i.userinfo = t.userinfo, i.host = t.host, i.port = t.port, i.path = co(t.path || ""), i.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (i.userinfo = t.userinfo, i.host = t.host, i.port = t.port, i.path = co(t.path || ""), i.query = t.query) : (t.path ? (t.path[0] === "/" ? i.path = co(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? i.path = "/" + t.path : e.path ? i.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : i.path = t.path, i.path = co(i.path)), i.query = t.query) : (i.path = e.path, t.query !== void 0 ? i.query = t.query : i.query = e.query), i.userinfo = e.userinfo, i.host = e.host, i.port = e.port), i.scheme = e.scheme), i.fragment = t.fragment, i;
}
function gb(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = dr(ga(Rr(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = dr(ga(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = dr(ga(Rr(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = dr(ga(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function dr(e, t) {
  const r = {
    host: e.host,
    scheme: e.scheme,
    userinfo: e.userinfo,
    port: e.port,
    path: e.path,
    query: e.query,
    nid: e.nid,
    nss: e.nss,
    uuid: e.uuid,
    fragment: e.fragment,
    reference: e.reference,
    resourceName: e.resourceName,
    secure: e.secure,
    error: ""
  }, n = Object.assign({}, t), i = [], o = Xy(n.scheme || r.scheme);
  o && o.serialize && o.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && i.push(r.scheme, ":");
  const a = fb(r);
  if (a !== void 0 && (n.reference !== "suffix" && i.push("//"), i.push(a), r.path && r.path[0] !== "/" && i.push("/")), r.path !== void 0) {
    let s = r.path;
    !n.absolutePath && (!o || !o.absolutePath) && (s = co(s)), a === void 0 && s[0] === "/" && s[1] === "/" && (s = "/%2F" + s.slice(2)), i.push(s);
  }
  return r.query !== void 0 && i.push("?", r.query), r.fragment !== void 0 && i.push("#", r.fragment), i.join("");
}
const vb = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Rr(e, t) {
  const r = Object.assign({}, t), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  };
  let i = !1;
  r.reference === "suffix" && (r.scheme ? e = r.scheme + ":" + e : e = "//" + e);
  const o = e.match(vb);
  if (o) {
    if (n.scheme = o[1], n.userinfo = o[3], n.host = o[4], n.port = parseInt(o[5], 10), n.path = o[6] || "", n.query = o[7], n.fragment = o[8], isNaN(n.port) && (n.port = o[5]), n.host)
      if (db(n.host) === !1) {
        const c = ub(n.host);
        n.host = c.host.toLowerCase(), i = c.isIPV6;
      } else
        i = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const a = Xy(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!a || !a.unicodeSupport) && n.host && (r.domainHost || a && a.domainHost) && i === !1 && hb(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (s) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + s;
      }
    (!a || a && !a.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = unescape(n.host))), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), a && a.parse && a.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const vu = {
  SCHEMES: pb,
  normalize: mb,
  resolve: yb,
  resolveComponent: Jy,
  equal: gb,
  serialize: dr,
  parse: Rr
};
xs.exports = vu;
xs.exports.default = vu;
xs.exports.fastUri = vu;
var Qy = xs.exports;
Object.defineProperty(yu, "__esModule", { value: !0 });
const Zy = Qy;
Zy.code = 'require("ajv/dist/runtime/uri").default';
yu.default = Zy;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = tr;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = le;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = Ko, i = ki, o = qn, a = pt, s = le, c = Xe, u = xe, l = X, f = qE, h = yu, p = (R, b) => new RegExp(R, b);
  p.code = "new RegExp";
  const g = ["removeAdditional", "useDefaults", "coerceTypes"], $ = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), v = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, y = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, E = 200;
  function A(R) {
    var b, O, S, d, m, P, w, _, k, I, Y, ne, ye, _e, $e, Ce, ve, Fe, Bt, kt, At, jt, gr, vr, _r;
    const Nt = R.strict, Ft = (b = R.code) === null || b === void 0 ? void 0 : b.optimize, $r = Ft === !0 || Ft === void 0 ? 1 : Ft || 0, Fr = (S = (O = R.code) === null || O === void 0 ? void 0 : O.regExp) !== null && S !== void 0 ? S : p, wt = (d = R.uriResolver) !== null && d !== void 0 ? d : h.default;
    return {
      strictSchema: (P = (m = R.strictSchema) !== null && m !== void 0 ? m : Nt) !== null && P !== void 0 ? P : !0,
      strictNumbers: (_ = (w = R.strictNumbers) !== null && w !== void 0 ? w : Nt) !== null && _ !== void 0 ? _ : !0,
      strictTypes: (I = (k = R.strictTypes) !== null && k !== void 0 ? k : Nt) !== null && I !== void 0 ? I : "log",
      strictTuples: (ne = (Y = R.strictTuples) !== null && Y !== void 0 ? Y : Nt) !== null && ne !== void 0 ? ne : "log",
      strictRequired: (_e = (ye = R.strictRequired) !== null && ye !== void 0 ? ye : Nt) !== null && _e !== void 0 ? _e : !1,
      code: R.code ? { ...R.code, optimize: $r, regExp: Fr } : { optimize: $r, regExp: Fr },
      loopRequired: ($e = R.loopRequired) !== null && $e !== void 0 ? $e : E,
      loopEnum: (Ce = R.loopEnum) !== null && Ce !== void 0 ? Ce : E,
      meta: (ve = R.meta) !== null && ve !== void 0 ? ve : !0,
      messages: (Fe = R.messages) !== null && Fe !== void 0 ? Fe : !0,
      inlineRefs: (Bt = R.inlineRefs) !== null && Bt !== void 0 ? Bt : !0,
      schemaId: (kt = R.schemaId) !== null && kt !== void 0 ? kt : "$id",
      addUsedSchema: (At = R.addUsedSchema) !== null && At !== void 0 ? At : !0,
      validateSchema: (jt = R.validateSchema) !== null && jt !== void 0 ? jt : !0,
      validateFormats: (gr = R.validateFormats) !== null && gr !== void 0 ? gr : !0,
      unicodeRegExp: (vr = R.unicodeRegExp) !== null && vr !== void 0 ? vr : !0,
      int32range: (_r = R.int32range) !== null && _r !== void 0 ? _r : !0,
      uriResolver: wt
    };
  }
  class C {
    constructor(b = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), b = this.opts = { ...b, ...A(b) };
      const { es5: O, lines: S } = this.opts.code;
      this.scope = new s.ValueScope({ scope: {}, prefixes: $, es5: O, lines: S }), this.logger = x(b.logger);
      const d = b.validateFormats;
      b.validateFormats = !1, this.RULES = (0, o.getRules)(), D.call(this, v, b, "NOT SUPPORTED"), D.call(this, y, b, "DEPRECATED", "warn"), this._metaOpts = W.call(this), b.formats && G.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), b.keywords && N.call(this, b.keywords), typeof b.meta == "object" && this.addMetaSchema(b.meta), z.call(this), b.validateFormats = d;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: b, meta: O, schemaId: S } = this.opts;
      let d = f;
      S === "id" && (d = { ...f }, d.id = d.$id, delete d.$id), O && b && this.addMetaSchema(d, d[S], !1);
    }
    defaultMeta() {
      const { meta: b, schemaId: O } = this.opts;
      return this.opts.defaultMeta = typeof b == "object" ? b[O] || b : void 0;
    }
    validate(b, O) {
      let S;
      if (typeof b == "string") {
        if (S = this.getSchema(b), !S)
          throw new Error(`no schema with key or ref "${b}"`);
      } else
        S = this.compile(b);
      const d = S(O);
      return "$async" in S || (this.errors = S.errors), d;
    }
    compile(b, O) {
      const S = this._addSchema(b, O);
      return S.validate || this._compileSchemaEnv(S);
    }
    compileAsync(b, O) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: S } = this.opts;
      return d.call(this, b, O);
      async function d(I, Y) {
        await m.call(this, I.$schema);
        const ne = this._addSchema(I, Y);
        return ne.validate || P.call(this, ne);
      }
      async function m(I) {
        I && !this.getSchema(I) && await d.call(this, { $ref: I }, !0);
      }
      async function P(I) {
        try {
          return this._compileSchemaEnv(I);
        } catch (Y) {
          if (!(Y instanceof i.default))
            throw Y;
          return w.call(this, Y), await _.call(this, Y.missingSchema), P.call(this, I);
        }
      }
      function w({ missingSchema: I, missingRef: Y }) {
        if (this.refs[I])
          throw new Error(`AnySchema ${I} is loaded but ${Y} cannot be resolved`);
      }
      async function _(I) {
        const Y = await k.call(this, I);
        this.refs[I] || await m.call(this, Y.$schema), this.refs[I] || this.addSchema(Y, I, O);
      }
      async function k(I) {
        const Y = this._loading[I];
        if (Y)
          return Y;
        try {
          return await (this._loading[I] = S(I));
        } finally {
          delete this._loading[I];
        }
      }
    }
    // Adds schema to the instance
    addSchema(b, O, S, d = this.opts.validateSchema) {
      if (Array.isArray(b)) {
        for (const P of b)
          this.addSchema(P, void 0, S, d);
        return this;
      }
      let m;
      if (typeof b == "object") {
        const { schemaId: P } = this.opts;
        if (m = b[P], m !== void 0 && typeof m != "string")
          throw new Error(`schema ${P} must be string`);
      }
      return O = (0, c.normalizeId)(O || m), this._checkUnique(O), this.schemas[O] = this._addSchema(b, S, O, d, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(b, O, S = this.opts.validateSchema) {
      return this.addSchema(b, O, !0, S), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(b, O) {
      if (typeof b == "boolean")
        return !0;
      let S;
      if (S = b.$schema, S !== void 0 && typeof S != "string")
        throw new Error("$schema must be a string");
      if (S = S || this.opts.defaultMeta || this.defaultMeta(), !S)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const d = this.validate(S, b);
      if (!d && O) {
        const m = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(m);
        else
          throw new Error(m);
      }
      return d;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(b) {
      let O;
      for (; typeof (O = V.call(this, b)) == "string"; )
        b = O;
      if (O === void 0) {
        const { schemaId: S } = this.opts, d = new a.SchemaEnv({ schema: {}, schemaId: S });
        if (O = a.resolveSchema.call(this, d, b), !O)
          return;
        this.refs[b] = O;
      }
      return O.validate || this._compileSchemaEnv(O);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(b) {
      if (b instanceof RegExp)
        return this._removeAllSchemas(this.schemas, b), this._removeAllSchemas(this.refs, b), this;
      switch (typeof b) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const O = V.call(this, b);
          return typeof O == "object" && this._cache.delete(O.schema), delete this.schemas[b], delete this.refs[b], this;
        }
        case "object": {
          const O = b;
          this._cache.delete(O);
          let S = b[this.opts.schemaId];
          return S && (S = (0, c.normalizeId)(S), delete this.schemas[S], delete this.refs[S]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(b) {
      for (const O of b)
        this.addKeyword(O);
      return this;
    }
    addKeyword(b, O) {
      let S;
      if (typeof b == "string")
        S = b, typeof O == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), O.keyword = S);
      else if (typeof b == "object" && O === void 0) {
        if (O = b, S = O.keyword, Array.isArray(S) && !S.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (F.call(this, S, O), !O)
        return (0, l.eachItem)(S, (m) => L.call(this, m)), this;
      U.call(this, O);
      const d = {
        ...O,
        type: (0, u.getJSONTypes)(O.type),
        schemaType: (0, u.getJSONTypes)(O.schemaType)
      };
      return (0, l.eachItem)(S, d.type.length === 0 ? (m) => L.call(this, m, d) : (m) => d.type.forEach((P) => L.call(this, m, d, P))), this;
    }
    getKeyword(b) {
      const O = this.RULES.all[b];
      return typeof O == "object" ? O.definition : !!O;
    }
    // Remove keyword
    removeKeyword(b) {
      const { RULES: O } = this;
      delete O.keywords[b], delete O.all[b];
      for (const S of O.rules) {
        const d = S.rules.findIndex((m) => m.keyword === b);
        d >= 0 && S.rules.splice(d, 1);
      }
      return this;
    }
    // Add format
    addFormat(b, O) {
      return typeof O == "string" && (O = new RegExp(O)), this.formats[b] = O, this;
    }
    errorsText(b = this.errors, { separator: O = ", ", dataVar: S = "data" } = {}) {
      return !b || b.length === 0 ? "No errors" : b.map((d) => `${S}${d.instancePath} ${d.message}`).reduce((d, m) => d + O + m);
    }
    $dataMetaSchema(b, O) {
      const S = this.RULES.all;
      b = JSON.parse(JSON.stringify(b));
      for (const d of O) {
        const m = d.split("/").slice(1);
        let P = b;
        for (const w of m)
          P = P[w];
        for (const w in S) {
          const _ = S[w];
          if (typeof _ != "object")
            continue;
          const { $data: k } = _.definition, I = P[w];
          k && I && (P[w] = B(I));
        }
      }
      return b;
    }
    _removeAllSchemas(b, O) {
      for (const S in b) {
        const d = b[S];
        (!O || O.test(S)) && (typeof d == "string" ? delete b[S] : d && !d.meta && (this._cache.delete(d.schema), delete b[S]));
      }
    }
    _addSchema(b, O, S, d = this.opts.validateSchema, m = this.opts.addUsedSchema) {
      let P;
      const { schemaId: w } = this.opts;
      if (typeof b == "object")
        P = b[w];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof b != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let _ = this._cache.get(b);
      if (_ !== void 0)
        return _;
      S = (0, c.normalizeId)(P || S);
      const k = c.getSchemaRefs.call(this, b, S);
      return _ = new a.SchemaEnv({ schema: b, schemaId: w, meta: O, baseId: S, localRefs: k }), this._cache.set(_.schema, _), m && !S.startsWith("#") && (S && this._checkUnique(S), this.refs[S] = _), d && this.validateSchema(b, !0), _;
    }
    _checkUnique(b) {
      if (this.schemas[b] || this.refs[b])
        throw new Error(`schema with key or id "${b}" already exists`);
    }
    _compileSchemaEnv(b) {
      if (b.meta ? this._compileMetaSchema(b) : a.compileSchema.call(this, b), !b.validate)
        throw new Error("ajv implementation error");
      return b.validate;
    }
    _compileMetaSchema(b) {
      const O = this.opts;
      this.opts = this._metaOpts;
      try {
        a.compileSchema.call(this, b);
      } finally {
        this.opts = O;
      }
    }
  }
  C.ValidationError = n.default, C.MissingRefError = i.default, e.default = C;
  function D(R, b, O, S = "error") {
    for (const d in R) {
      const m = d;
      m in b && this.logger[S](`${O}: option ${d}. ${R[m]}`);
    }
  }
  function V(R) {
    return R = (0, c.normalizeId)(R), this.schemas[R] || this.refs[R];
  }
  function z() {
    const R = this.opts.schemas;
    if (R)
      if (Array.isArray(R))
        this.addSchema(R);
      else
        for (const b in R)
          this.addSchema(R[b], b);
  }
  function G() {
    for (const R in this.opts.formats) {
      const b = this.opts.formats[R];
      b && this.addFormat(R, b);
    }
  }
  function N(R) {
    if (Array.isArray(R)) {
      this.addVocabulary(R);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const b in R) {
      const O = R[b];
      O.keyword || (O.keyword = b), this.addKeyword(O);
    }
  }
  function W() {
    const R = { ...this.opts };
    for (const b of g)
      delete R[b];
    return R;
  }
  const M = { log() {
  }, warn() {
  }, error() {
  } };
  function x(R) {
    if (R === !1)
      return M;
    if (R === void 0)
      return console;
    if (R.log && R.warn && R.error)
      return R;
    throw new Error("logger must implement log, warn and error methods");
  }
  const J = /^[a-z_$][a-z0-9_$:-]*$/i;
  function F(R, b) {
    const { RULES: O } = this;
    if ((0, l.eachItem)(R, (S) => {
      if (O.keywords[S])
        throw new Error(`Keyword ${S} is already defined`);
      if (!J.test(S))
        throw new Error(`Keyword ${S} has invalid name`);
    }), !!b && b.$data && !("code" in b || "validate" in b))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function L(R, b, O) {
    var S;
    const d = b == null ? void 0 : b.post;
    if (O && d)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: m } = this;
    let P = d ? m.post : m.rules.find(({ type: _ }) => _ === O);
    if (P || (P = { type: O, rules: [] }, m.rules.push(P)), m.keywords[R] = !0, !b)
      return;
    const w = {
      keyword: R,
      definition: {
        ...b,
        type: (0, u.getJSONTypes)(b.type),
        schemaType: (0, u.getJSONTypes)(b.schemaType)
      }
    };
    b.before ? H.call(this, P, w, b.before) : P.rules.push(w), m.all[R] = w, (S = b.implements) === null || S === void 0 || S.forEach((_) => this.addKeyword(_));
  }
  function H(R, b, O) {
    const S = R.rules.findIndex((d) => d.keyword === O);
    S >= 0 ? R.rules.splice(S, 0, b) : (R.rules.push(b), this.logger.warn(`rule ${O} is not defined`));
  }
  function U(R) {
    let { metaSchema: b } = R;
    b !== void 0 && (R.$data && this.opts.$data && (b = B(b)), R.validateSchema = this.compile(b, !0));
  }
  const K = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function B(R) {
    return { anyOf: [R, K] };
  }
})(uy);
var _u = {}, $u = {}, wu = {};
Object.defineProperty(wu, "__esModule", { value: !0 });
const _b = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
wu.default = _b;
var Dr = {};
Object.defineProperty(Dr, "__esModule", { value: !0 });
Dr.callRef = Dr.getValidate = void 0;
const $b = ki, lh = pe, bt = le, Jn = Dt, uh = pt, va = X, wb = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: i, schemaEnv: o, validateName: a, opts: s, self: c } = n, { root: u } = o;
    if ((r === "#" || r === "#/") && i === u.baseId)
      return f();
    const l = uh.resolveRef.call(c, u, i, r);
    if (l === void 0)
      throw new $b.default(n.opts.uriResolver, i, r);
    if (l instanceof uh.SchemaEnv)
      return h(l);
    return p(l);
    function f() {
      if (o === u)
        return Xa(e, a, o, o.$async);
      const g = t.scopeValue("root", { ref: u });
      return Xa(e, (0, bt._)`${g}.validate`, u, u.$async);
    }
    function h(g) {
      const $ = eg(e, g);
      Xa(e, $, g, g.$async);
    }
    function p(g) {
      const $ = t.scopeValue("schema", s.code.source === !0 ? { ref: g, code: (0, bt.stringify)(g) } : { ref: g }), v = t.name("valid"), y = e.subschema({
        schema: g,
        dataTypes: [],
        schemaPath: bt.nil,
        topSchemaRef: $,
        errSchemaPath: r
      }, v);
      e.mergeEvaluated(y), e.ok(v);
    }
  }
};
function eg(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, bt._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Dr.getValidate = eg;
function Xa(e, t, r, n) {
  const { gen: i, it: o } = e, { allErrors: a, schemaEnv: s, opts: c } = o, u = c.passContext ? Jn.default.this : bt.nil;
  n ? l() : f();
  function l() {
    if (!s.$async)
      throw new Error("async schema referenced by sync schema");
    const g = i.let("valid");
    i.try(() => {
      i.code((0, bt._)`await ${(0, lh.callValidateCode)(e, t, u)}`), p(t), a || i.assign(g, !0);
    }, ($) => {
      i.if((0, bt._)`!(${$} instanceof ${o.ValidationError})`, () => i.throw($)), h($), a || i.assign(g, !1);
    }), e.ok(g);
  }
  function f() {
    e.result((0, lh.callValidateCode)(e, t, u), () => p(t), () => h(t));
  }
  function h(g) {
    const $ = (0, bt._)`${g}.errors`;
    i.assign(Jn.default.vErrors, (0, bt._)`${Jn.default.vErrors} === null ? ${$} : ${Jn.default.vErrors}.concat(${$})`), i.assign(Jn.default.errors, (0, bt._)`${Jn.default.vErrors}.length`);
  }
  function p(g) {
    var $;
    if (!o.opts.unevaluated)
      return;
    const v = ($ = r == null ? void 0 : r.validate) === null || $ === void 0 ? void 0 : $.evaluated;
    if (o.props !== !0)
      if (v && !v.dynamicProps)
        v.props !== void 0 && (o.props = va.mergeEvaluated.props(i, v.props, o.props));
      else {
        const y = i.var("props", (0, bt._)`${g}.evaluated.props`);
        o.props = va.mergeEvaluated.props(i, y, o.props, bt.Name);
      }
    if (o.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (o.items = va.mergeEvaluated.items(i, v.items, o.items));
      else {
        const y = i.var("items", (0, bt._)`${g}.evaluated.items`);
        o.items = va.mergeEvaluated.items(i, y, o.items, bt.Name);
      }
  }
}
Dr.callRef = Xa;
Dr.default = wb;
Object.defineProperty($u, "__esModule", { value: !0 });
const Eb = wu, bb = Dr, Sb = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Eb.default,
  bb.default
];
$u.default = Sb;
var Eu = {}, bu = {};
Object.defineProperty(bu, "__esModule", { value: !0 });
const fs = le, Hr = fs.operators, ds = {
  maximum: { okStr: "<=", ok: Hr.LTE, fail: Hr.GT },
  minimum: { okStr: ">=", ok: Hr.GTE, fail: Hr.LT },
  exclusiveMaximum: { okStr: "<", ok: Hr.LT, fail: Hr.GTE },
  exclusiveMinimum: { okStr: ">", ok: Hr.GT, fail: Hr.LTE }
}, Pb = {
  message: ({ keyword: e, schemaCode: t }) => (0, fs.str)`must be ${ds[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, fs._)`{comparison: ${ds[e].okStr}, limit: ${t}}`
}, Tb = {
  keyword: Object.keys(ds),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Pb,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, fs._)`${r} ${ds[t].fail} ${n} || isNaN(${r})`);
  }
};
bu.default = Tb;
var Su = {};
Object.defineProperty(Su, "__esModule", { value: !0 });
const mo = le, Ob = {
  message: ({ schemaCode: e }) => (0, mo.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, mo._)`{multipleOf: ${e}}`
}, Ab = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Ob,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: i } = e, o = i.opts.multipleOfPrecision, a = t.let("res"), s = o ? (0, mo._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, mo._)`${a} !== parseInt(${a})`;
    e.fail$data((0, mo._)`(${n} === 0 || (${a} = ${r}/${n}, ${s}))`);
  }
};
Su.default = Ab;
var Pu = {}, Tu = {};
Object.defineProperty(Tu, "__esModule", { value: !0 });
function tg(e) {
  const t = e.length;
  let r = 0, n = 0, i;
  for (; n < t; )
    r++, i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < t && (i = e.charCodeAt(n), (i & 64512) === 56320 && n++);
  return r;
}
Tu.default = tg;
tg.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Pu, "__esModule", { value: !0 });
const An = le, Nb = X, Ib = Tu, Cb = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, An.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, An._)`{limit: ${e}}`
}, Rb = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Cb,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: i } = e, o = t === "maxLength" ? An.operators.GT : An.operators.LT, a = i.opts.unicode === !1 ? (0, An._)`${r}.length` : (0, An._)`${(0, Nb.useFunc)(e.gen, Ib.default)}(${r})`;
    e.fail$data((0, An._)`${a} ${o} ${n}`);
  }
};
Pu.default = Rb;
var Ou = {};
Object.defineProperty(Ou, "__esModule", { value: !0 });
const Db = pe, hs = le, kb = {
  message: ({ schemaCode: e }) => (0, hs.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, hs._)`{pattern: ${e}}`
}, jb = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: kb,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: i, it: o } = e, a = o.opts.unicodeRegExp ? "u" : "", s = r ? (0, hs._)`(new RegExp(${i}, ${a}))` : (0, Db.usePattern)(e, n);
    e.fail$data((0, hs._)`!${s}.test(${t})`);
  }
};
Ou.default = jb;
var Au = {};
Object.defineProperty(Au, "__esModule", { value: !0 });
const yo = le, Fb = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, yo.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, yo._)`{limit: ${e}}`
}, Lb = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Fb,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxProperties" ? yo.operators.GT : yo.operators.LT;
    e.fail$data((0, yo._)`Object.keys(${r}).length ${i} ${n}`);
  }
};
Au.default = Lb;
var Nu = {};
Object.defineProperty(Nu, "__esModule", { value: !0 });
const Qi = pe, go = le, Ub = X, Mb = {
  message: ({ params: { missingProperty: e } }) => (0, go.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, go._)`{missingProperty: ${e}}`
}, xb = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Mb,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: i, $data: o, it: a } = e, { opts: s } = a;
    if (!o && r.length === 0)
      return;
    const c = r.length >= s.loopRequired;
    if (a.allErrors ? u() : l(), s.strictRequired) {
      const p = e.parentSchema.properties, { definedProperties: g } = e.it;
      for (const $ of r)
        if ((p == null ? void 0 : p[$]) === void 0 && !g.has($)) {
          const v = a.schemaEnv.baseId + a.errSchemaPath, y = `required property "${$}" is not defined at "${v}" (strictRequired)`;
          (0, Ub.checkStrictMode)(a, y, a.opts.strictRequired);
        }
    }
    function u() {
      if (c || o)
        e.block$data(go.nil, f);
      else
        for (const p of r)
          (0, Qi.checkReportMissingProp)(e, p);
    }
    function l() {
      const p = t.let("missing");
      if (c || o) {
        const g = t.let("valid", !0);
        e.block$data(g, () => h(p, g)), e.ok(g);
      } else
        t.if((0, Qi.checkMissingProp)(e, r, p)), (0, Qi.reportMissingProp)(e, p), t.else();
    }
    function f() {
      t.forOf("prop", n, (p) => {
        e.setParams({ missingProperty: p }), t.if((0, Qi.noPropertyInData)(t, i, p, s.ownProperties), () => e.error());
      });
    }
    function h(p, g) {
      e.setParams({ missingProperty: p }), t.forOf(p, n, () => {
        t.assign(g, (0, Qi.propertyInData)(t, i, p, s.ownProperties)), t.if((0, go.not)(g), () => {
          e.error(), t.break();
        });
      }, go.nil);
    }
  }
};
Nu.default = xb;
var Iu = {};
Object.defineProperty(Iu, "__esModule", { value: !0 });
const vo = le, Vb = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, vo.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, vo._)`{limit: ${e}}`
}, qb = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Vb,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxItems" ? vo.operators.GT : vo.operators.LT;
    e.fail$data((0, vo._)`${r}.length ${i} ${n}`);
  }
};
Iu.default = qb;
var Cu = {}, Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
const rg = Ls;
rg.code = 'require("ajv/dist/runtime/equal").default';
Wo.default = rg;
Object.defineProperty(Cu, "__esModule", { value: !0 });
const Ic = xe, We = le, Bb = X, Hb = Wo, zb = {
  message: ({ params: { i: e, j: t } }) => (0, We.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, We._)`{i: ${e}, j: ${t}}`
}, Gb = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: zb,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, parentSchema: o, schemaCode: a, it: s } = e;
    if (!n && !i)
      return;
    const c = t.let("valid"), u = o.items ? (0, Ic.getSchemaTypes)(o.items) : [];
    e.block$data(c, l, (0, We._)`${a} === false`), e.ok(c);
    function l() {
      const g = t.let("i", (0, We._)`${r}.length`), $ = t.let("j");
      e.setParams({ i: g, j: $ }), t.assign(c, !0), t.if((0, We._)`${g} > 1`, () => (f() ? h : p)(g, $));
    }
    function f() {
      return u.length > 0 && !u.some((g) => g === "object" || g === "array");
    }
    function h(g, $) {
      const v = t.name("item"), y = (0, Ic.checkDataTypes)(u, v, s.opts.strictNumbers, Ic.DataType.Wrong), E = t.const("indices", (0, We._)`{}`);
      t.for((0, We._)`;${g}--;`, () => {
        t.let(v, (0, We._)`${r}[${g}]`), t.if(y, (0, We._)`continue`), u.length > 1 && t.if((0, We._)`typeof ${v} == "string"`, (0, We._)`${v} += "_"`), t.if((0, We._)`typeof ${E}[${v}] == "number"`, () => {
          t.assign($, (0, We._)`${E}[${v}]`), e.error(), t.assign(c, !1).break();
        }).code((0, We._)`${E}[${v}] = ${g}`);
      });
    }
    function p(g, $) {
      const v = (0, Bb.useFunc)(t, Hb.default), y = t.name("outer");
      t.label(y).for((0, We._)`;${g}--;`, () => t.for((0, We._)`${$} = ${g}; ${$}--;`, () => t.if((0, We._)`${v}(${r}[${g}], ${r}[${$}])`, () => {
        e.error(), t.assign(c, !1).break(y);
      })));
    }
  }
};
Cu.default = Gb;
var Ru = {};
Object.defineProperty(Ru, "__esModule", { value: !0 });
const Ol = le, Kb = X, Wb = Wo, Yb = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Ol._)`{allowedValue: ${e}}`
}, Xb = {
  keyword: "const",
  $data: !0,
  error: Yb,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: i, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, Ol._)`!${(0, Kb.useFunc)(t, Wb.default)}(${r}, ${i})`) : e.fail((0, Ol._)`${o} !== ${r}`);
  }
};
Ru.default = Xb;
var Du = {};
Object.defineProperty(Du, "__esModule", { value: !0 });
const lo = le, Jb = X, Qb = Wo, Zb = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, lo._)`{allowedValues: ${e}}`
}, eS = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Zb,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, schemaCode: o, it: a } = e;
    if (!n && i.length === 0)
      throw new Error("enum must have non-empty array");
    const s = i.length >= a.opts.loopEnum;
    let c;
    const u = () => c ?? (c = (0, Jb.useFunc)(t, Qb.default));
    let l;
    if (s || n)
      l = t.let("valid"), e.block$data(l, f);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const p = t.const("vSchema", o);
      l = (0, lo.or)(...i.map((g, $) => h(p, $)));
    }
    e.pass(l);
    function f() {
      t.assign(l, !1), t.forOf("v", o, (p) => t.if((0, lo._)`${u()}(${r}, ${p})`, () => t.assign(l, !0).break()));
    }
    function h(p, g) {
      const $ = i[g];
      return typeof $ == "object" && $ !== null ? (0, lo._)`${u()}(${r}, ${p}[${g}])` : (0, lo._)`${r} === ${$}`;
    }
  }
};
Du.default = eS;
Object.defineProperty(Eu, "__esModule", { value: !0 });
const tS = bu, rS = Su, nS = Pu, iS = Ou, oS = Au, aS = Nu, sS = Iu, cS = Cu, lS = Ru, uS = Du, fS = [
  // number
  tS.default,
  rS.default,
  // string
  nS.default,
  iS.default,
  // object
  oS.default,
  aS.default,
  // array
  sS.default,
  cS.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  lS.default,
  uS.default
];
Eu.default = fS;
var ku = {}, ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.validateAdditionalItems = void 0;
const Nn = le, Al = X, dS = {
  message: ({ params: { len: e } }) => (0, Nn.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Nn._)`{limit: ${e}}`
}, hS = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: dS,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Al.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    ng(e, n);
  }
};
function ng(e, t) {
  const { gen: r, schema: n, data: i, keyword: o, it: a } = e;
  a.items = !0;
  const s = r.const("len", (0, Nn._)`${i}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Nn._)`${s} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Al.alwaysValidSchema)(a, n)) {
    const u = r.var("valid", (0, Nn._)`${s} <= ${t.length}`);
    r.if((0, Nn.not)(u), () => c(u)), e.ok(u);
  }
  function c(u) {
    r.forRange("i", t.length, s, (l) => {
      e.subschema({ keyword: o, dataProp: l, dataPropType: Al.Type.Num }, u), a.allErrors || r.if((0, Nn.not)(u), () => r.break());
    });
  }
}
ji.validateAdditionalItems = ng;
ji.default = hS;
var ju = {}, Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.validateTuple = void 0;
const fh = le, Ja = X, pS = pe, mS = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return ig(e, "additionalItems", t);
    r.items = !0, !(0, Ja.alwaysValidSchema)(r, t) && e.ok((0, pS.validateArray)(e));
  }
};
function ig(e, t, r = e.schema) {
  const { gen: n, parentSchema: i, data: o, keyword: a, it: s } = e;
  l(i), s.opts.unevaluated && r.length && s.items !== !0 && (s.items = Ja.mergeEvaluated.items(n, r.length, s.items));
  const c = n.name("valid"), u = n.const("len", (0, fh._)`${o}.length`);
  r.forEach((f, h) => {
    (0, Ja.alwaysValidSchema)(s, f) || (n.if((0, fh._)`${u} > ${h}`, () => e.subschema({
      keyword: a,
      schemaProp: h,
      dataProp: h
    }, c)), e.ok(c));
  });
  function l(f) {
    const { opts: h, errSchemaPath: p } = s, g = r.length, $ = g === f.minItems && (g === f.maxItems || f[t] === !1);
    if (h.strictTuples && !$) {
      const v = `"${a}" is ${g}-tuple, but minItems or maxItems/${t} are not specified or different at path "${p}"`;
      (0, Ja.checkStrictMode)(s, v, h.strictTuples);
    }
  }
}
Fi.validateTuple = ig;
Fi.default = mS;
Object.defineProperty(ju, "__esModule", { value: !0 });
const yS = Fi, gS = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, yS.validateTuple)(e, "items")
};
ju.default = gS;
var Fu = {};
Object.defineProperty(Fu, "__esModule", { value: !0 });
const dh = le, vS = X, _S = pe, $S = ji, wS = {
  message: ({ params: { len: e } }) => (0, dh.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, dh._)`{limit: ${e}}`
}, ES = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: wS,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: i } = r;
    n.items = !0, !(0, vS.alwaysValidSchema)(n, t) && (i ? (0, $S.validateAdditionalItems)(e, i) : e.ok((0, _S.validateArray)(e)));
  }
};
Fu.default = ES;
var Lu = {};
Object.defineProperty(Lu, "__esModule", { value: !0 });
const xt = le, _a = X, bS = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, xt.str)`must contain at least ${e} valid item(s)` : (0, xt.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, xt._)`{minContains: ${e}}` : (0, xt._)`{minContains: ${e}, maxContains: ${t}}`
}, SS = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: bS,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: o } = e;
    let a, s;
    const { minContains: c, maxContains: u } = n;
    o.opts.next ? (a = c === void 0 ? 1 : c, s = u) : a = 1;
    const l = t.const("len", (0, xt._)`${i}.length`);
    if (e.setParams({ min: a, max: s }), s === void 0 && a === 0) {
      (0, _a.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (s !== void 0 && a > s) {
      (0, _a.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, _a.alwaysValidSchema)(o, r)) {
      let $ = (0, xt._)`${l} >= ${a}`;
      s !== void 0 && ($ = (0, xt._)`${$} && ${l} <= ${s}`), e.pass($);
      return;
    }
    o.items = !0;
    const f = t.name("valid");
    s === void 0 && a === 1 ? p(f, () => t.if(f, () => t.break())) : a === 0 ? (t.let(f, !0), s !== void 0 && t.if((0, xt._)`${i}.length > 0`, h)) : (t.let(f, !1), h()), e.result(f, () => e.reset());
    function h() {
      const $ = t.name("_valid"), v = t.let("count", 0);
      p($, () => t.if($, () => g(v)));
    }
    function p($, v) {
      t.forRange("i", 0, l, (y) => {
        e.subschema({
          keyword: "contains",
          dataProp: y,
          dataPropType: _a.Type.Num,
          compositeRule: !0
        }, $), v();
      });
    }
    function g($) {
      t.code((0, xt._)`${$}++`), s === void 0 ? t.if((0, xt._)`${$} >= ${a}`, () => t.assign(f, !0).break()) : (t.if((0, xt._)`${$} > ${s}`, () => t.assign(f, !1).break()), a === 1 ? t.assign(f, !0) : t.if((0, xt._)`${$} >= ${a}`, () => t.assign(f, !0)));
    }
  }
};
Lu.default = SS;
var Vs = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = le, r = X, n = pe;
  e.error = {
    message: ({ params: { property: c, depsCount: u, deps: l } }) => {
      const f = u === 1 ? "property" : "properties";
      return (0, t.str)`must have ${f} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: u, deps: l, missingProperty: f } }) => (0, t._)`{property: ${c},
    missingProperty: ${f},
    depsCount: ${u},
    deps: ${l}}`
    // TODO change to reference
  };
  const i = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [u, l] = o(c);
      a(c, u), s(c, l);
    }
  };
  function o({ schema: c }) {
    const u = {}, l = {};
    for (const f in c) {
      if (f === "__proto__")
        continue;
      const h = Array.isArray(c[f]) ? u : l;
      h[f] = c[f];
    }
    return [u, l];
  }
  function a(c, u = c.schema) {
    const { gen: l, data: f, it: h } = c;
    if (Object.keys(u).length === 0)
      return;
    const p = l.let("missing");
    for (const g in u) {
      const $ = u[g];
      if ($.length === 0)
        continue;
      const v = (0, n.propertyInData)(l, f, g, h.opts.ownProperties);
      c.setParams({
        property: g,
        depsCount: $.length,
        deps: $.join(", ")
      }), h.allErrors ? l.if(v, () => {
        for (const y of $)
          (0, n.checkReportMissingProp)(c, y);
      }) : (l.if((0, t._)`${v} && (${(0, n.checkMissingProp)(c, $, p)})`), (0, n.reportMissingProp)(c, p), l.else());
    }
  }
  e.validatePropertyDeps = a;
  function s(c, u = c.schema) {
    const { gen: l, data: f, keyword: h, it: p } = c, g = l.name("valid");
    for (const $ in u)
      (0, r.alwaysValidSchema)(p, u[$]) || (l.if(
        (0, n.propertyInData)(l, f, $, p.opts.ownProperties),
        () => {
          const v = c.subschema({ keyword: h, schemaProp: $ }, g);
          c.mergeValidEvaluated(v, g);
        },
        () => l.var(g, !0)
        // TODO var
      ), c.ok(g));
  }
  e.validateSchemaDeps = s, e.default = i;
})(Vs);
var Uu = {};
Object.defineProperty(Uu, "__esModule", { value: !0 });
const og = le, PS = X, TS = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, og._)`{propertyName: ${e.propertyName}}`
}, OS = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: TS,
  code(e) {
    const { gen: t, schema: r, data: n, it: i } = e;
    if ((0, PS.alwaysValidSchema)(i, r))
      return;
    const o = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, o), t.if((0, og.not)(o), () => {
        e.error(!0), i.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
Uu.default = OS;
var qs = {};
Object.defineProperty(qs, "__esModule", { value: !0 });
const $a = pe, Kt = le, AS = Dt, wa = X, NS = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Kt._)`{additionalProperty: ${e.additionalProperty}}`
}, IS = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: NS,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: s, opts: c } = a;
    if (a.props = !0, c.removeAdditional !== "all" && (0, wa.alwaysValidSchema)(a, r))
      return;
    const u = (0, $a.allSchemaProperties)(n.properties), l = (0, $a.allSchemaProperties)(n.patternProperties);
    f(), e.ok((0, Kt._)`${o} === ${AS.default.errors}`);
    function f() {
      t.forIn("key", i, (v) => {
        !u.length && !l.length ? g(v) : t.if(h(v), () => g(v));
      });
    }
    function h(v) {
      let y;
      if (u.length > 8) {
        const E = (0, wa.schemaRefOrVal)(a, n.properties, "properties");
        y = (0, $a.isOwnProperty)(t, E, v);
      } else u.length ? y = (0, Kt.or)(...u.map((E) => (0, Kt._)`${v} === ${E}`)) : y = Kt.nil;
      return l.length && (y = (0, Kt.or)(y, ...l.map((E) => (0, Kt._)`${(0, $a.usePattern)(e, E)}.test(${v})`))), (0, Kt.not)(y);
    }
    function p(v) {
      t.code((0, Kt._)`delete ${i}[${v}]`);
    }
    function g(v) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        p(v);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: v }), e.error(), s || t.break();
        return;
      }
      if (typeof r == "object" && !(0, wa.alwaysValidSchema)(a, r)) {
        const y = t.name("valid");
        c.removeAdditional === "failing" ? ($(v, y, !1), t.if((0, Kt.not)(y), () => {
          e.reset(), p(v);
        })) : ($(v, y), s || t.if((0, Kt.not)(y), () => t.break()));
      }
    }
    function $(v, y, E) {
      const A = {
        keyword: "additionalProperties",
        dataProp: v,
        dataPropType: wa.Type.Str
      };
      E === !1 && Object.assign(A, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(A, y);
    }
  }
};
qs.default = IS;
var Mu = {};
Object.defineProperty(Mu, "__esModule", { value: !0 });
const CS = tr, hh = pe, Cc = X, ph = qs, RS = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && ph.default.code(new CS.KeywordCxt(o, ph.default, "additionalProperties"));
    const a = (0, hh.allSchemaProperties)(r);
    for (const f of a)
      o.definedProperties.add(f);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = Cc.mergeEvaluated.props(t, (0, Cc.toHash)(a), o.props));
    const s = a.filter((f) => !(0, Cc.alwaysValidSchema)(o, r[f]));
    if (s.length === 0)
      return;
    const c = t.name("valid");
    for (const f of s)
      u(f) ? l(f) : (t.if((0, hh.propertyInData)(t, i, f, o.opts.ownProperties)), l(f), o.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(f), e.ok(c);
    function u(f) {
      return o.opts.useDefaults && !o.compositeRule && r[f].default !== void 0;
    }
    function l(f) {
      e.subschema({
        keyword: "properties",
        schemaProp: f,
        dataProp: f
      }, c);
    }
  }
};
Mu.default = RS;
var xu = {};
Object.defineProperty(xu, "__esModule", { value: !0 });
const mh = pe, Ea = le, yh = X, gh = X, DS = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: i, it: o } = e, { opts: a } = o, s = (0, mh.allSchemaProperties)(r), c = s.filter(($) => (0, yh.alwaysValidSchema)(o, r[$]));
    if (s.length === 0 || c.length === s.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const u = a.strictSchema && !a.allowMatchingProperties && i.properties, l = t.name("valid");
    o.props !== !0 && !(o.props instanceof Ea.Name) && (o.props = (0, gh.evaluatedPropsToName)(t, o.props));
    const { props: f } = o;
    h();
    function h() {
      for (const $ of s)
        u && p($), o.allErrors ? g($) : (t.var(l, !0), g($), t.if(l));
    }
    function p($) {
      for (const v in u)
        new RegExp($).test(v) && (0, yh.checkStrictMode)(o, `property ${v} matches pattern ${$} (use allowMatchingProperties)`);
    }
    function g($) {
      t.forIn("key", n, (v) => {
        t.if((0, Ea._)`${(0, mh.usePattern)(e, $)}.test(${v})`, () => {
          const y = c.includes($);
          y || e.subschema({
            keyword: "patternProperties",
            schemaProp: $,
            dataProp: v,
            dataPropType: gh.Type.Str
          }, l), o.opts.unevaluated && f !== !0 ? t.assign((0, Ea._)`${f}[${v}]`, !0) : !y && !o.allErrors && t.if((0, Ea.not)(l), () => t.break());
        });
      });
    }
  }
};
xu.default = DS;
var Vu = {};
Object.defineProperty(Vu, "__esModule", { value: !0 });
const kS = X, jS = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, kS.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const i = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, i), e.failResult(i, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
Vu.default = jS;
var qu = {};
Object.defineProperty(qu, "__esModule", { value: !0 });
const FS = pe, LS = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: FS.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
qu.default = LS;
var Bu = {};
Object.defineProperty(Bu, "__esModule", { value: !0 });
const Qa = le, US = X, MS = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Qa._)`{passingSchemas: ${e.passing}}`
}, xS = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: MS,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: i } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (i.opts.discriminator && n.discriminator)
      return;
    const o = r, a = t.let("valid", !1), s = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: s }), t.block(u), e.result(a, () => e.reset(), () => e.error(!0));
    function u() {
      o.forEach((l, f) => {
        let h;
        (0, US.alwaysValidSchema)(i, l) ? t.var(c, !0) : h = e.subschema({
          keyword: "oneOf",
          schemaProp: f,
          compositeRule: !0
        }, c), f > 0 && t.if((0, Qa._)`${c} && ${a}`).assign(a, !1).assign(s, (0, Qa._)`[${s}, ${f}]`).else(), t.if(c, () => {
          t.assign(a, !0), t.assign(s, f), h && e.mergeEvaluated(h, Qa.Name);
        });
      });
    }
  }
};
Bu.default = xS;
var Hu = {};
Object.defineProperty(Hu, "__esModule", { value: !0 });
const VS = X, qS = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const i = t.name("valid");
    r.forEach((o, a) => {
      if ((0, VS.alwaysValidSchema)(n, o))
        return;
      const s = e.subschema({ keyword: "allOf", schemaProp: a }, i);
      e.ok(i), e.mergeEvaluated(s);
    });
  }
};
Hu.default = qS;
var zu = {};
Object.defineProperty(zu, "__esModule", { value: !0 });
const ps = le, ag = X, BS = {
  message: ({ params: e }) => (0, ps.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, ps._)`{failingKeyword: ${e.ifClause}}`
}, HS = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: BS,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, ag.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const i = vh(n, "then"), o = vh(n, "else");
    if (!i && !o)
      return;
    const a = t.let("valid", !0), s = t.name("_valid");
    if (c(), e.reset(), i && o) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(s, u("then", l), u("else", l));
    } else i ? t.if(s, u("then")) : t.if((0, ps.not)(s), u("else"));
    e.pass(a, () => e.error(!0));
    function c() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, s);
      e.mergeEvaluated(l);
    }
    function u(l, f) {
      return () => {
        const h = e.subschema({ keyword: l }, s);
        t.assign(a, s), e.mergeValidEvaluated(h, a), f ? t.assign(f, (0, ps._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function vh(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, ag.alwaysValidSchema)(e, r);
}
zu.default = HS;
var Gu = {};
Object.defineProperty(Gu, "__esModule", { value: !0 });
const zS = X, GS = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, zS.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Gu.default = GS;
Object.defineProperty(ku, "__esModule", { value: !0 });
const KS = ji, WS = ju, YS = Fi, XS = Fu, JS = Lu, QS = Vs, ZS = Uu, e1 = qs, t1 = Mu, r1 = xu, n1 = Vu, i1 = qu, o1 = Bu, a1 = Hu, s1 = zu, c1 = Gu;
function l1(e = !1) {
  const t = [
    // any
    n1.default,
    i1.default,
    o1.default,
    a1.default,
    s1.default,
    c1.default,
    // object
    ZS.default,
    e1.default,
    QS.default,
    t1.default,
    r1.default
  ];
  return e ? t.push(WS.default, XS.default) : t.push(KS.default, YS.default), t.push(JS.default), t;
}
ku.default = l1;
var Ku = {}, Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
Li.dynamicAnchor = void 0;
const Rc = le, u1 = Dt, _h = pt, f1 = Dr, d1 = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => sg(e, e.schema)
};
function sg(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const i = (0, Rc._)`${u1.default.dynamicAnchors}${(0, Rc.getProperty)(t)}`, o = n.errSchemaPath === "#" ? n.validateName : h1(e);
  r.if((0, Rc._)`!${i}`, () => r.assign(i, o));
}
Li.dynamicAnchor = sg;
function h1(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: i, baseId: o, localRefs: a, meta: s } = t.root, { schemaId: c } = n.opts, u = new _h.SchemaEnv({ schema: r, schemaId: c, root: i, baseId: o, localRefs: a, meta: s });
  return _h.compileSchema.call(n, u), (0, f1.getValidate)(e, u);
}
Li.default = d1;
var Ui = {};
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.dynamicRef = void 0;
const $h = le, p1 = Dt, wh = Dr, m1 = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => cg(e, e.schema)
};
function cg(e, t) {
  const { gen: r, keyword: n, it: i } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const o = t.slice(1);
  if (i.allErrors)
    a();
  else {
    const c = r.let("valid", !1);
    a(c), e.ok(c);
  }
  function a(c) {
    if (i.schemaEnv.root.dynamicAnchors[o]) {
      const u = r.let("_v", (0, $h._)`${p1.default.dynamicAnchors}${(0, $h.getProperty)(o)}`);
      r.if(u, s(u, c), s(i.validateName, c));
    } else
      s(i.validateName, c)();
  }
  function s(c, u) {
    return u ? () => r.block(() => {
      (0, wh.callRef)(e, c), r.let(u, !0);
    }) : () => (0, wh.callRef)(e, c);
  }
}
Ui.dynamicRef = cg;
Ui.default = m1;
var Wu = {};
Object.defineProperty(Wu, "__esModule", { value: !0 });
const y1 = Li, g1 = X, v1 = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, y1.dynamicAnchor)(e, "") : (0, g1.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
Wu.default = v1;
var Yu = {};
Object.defineProperty(Yu, "__esModule", { value: !0 });
const _1 = Ui, $1 = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, _1.dynamicRef)(e, e.schema)
};
Yu.default = $1;
Object.defineProperty(Ku, "__esModule", { value: !0 });
const w1 = Li, E1 = Ui, b1 = Wu, S1 = Yu, P1 = [w1.default, E1.default, b1.default, S1.default];
Ku.default = P1;
var Xu = {}, Ju = {};
Object.defineProperty(Ju, "__esModule", { value: !0 });
const Eh = Vs, T1 = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Eh.error,
  code: (e) => (0, Eh.validatePropertyDeps)(e)
};
Ju.default = T1;
var Qu = {};
Object.defineProperty(Qu, "__esModule", { value: !0 });
const O1 = Vs, A1 = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, O1.validateSchemaDeps)(e)
};
Qu.default = A1;
var Zu = {};
Object.defineProperty(Zu, "__esModule", { value: !0 });
const N1 = X, I1 = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, N1.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
Zu.default = I1;
Object.defineProperty(Xu, "__esModule", { value: !0 });
const C1 = Ju, R1 = Qu, D1 = Zu, k1 = [C1.default, R1.default, D1.default];
Xu.default = k1;
var ef = {}, tf = {};
Object.defineProperty(tf, "__esModule", { value: !0 });
const Yr = le, bh = X, j1 = Dt, F1 = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Yr._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, L1 = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: F1,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: i, it: o } = e;
    if (!i)
      throw new Error("ajv implementation error");
    const { allErrors: a, props: s } = o;
    s instanceof Yr.Name ? t.if((0, Yr._)`${s} !== true`, () => t.forIn("key", n, (f) => t.if(u(s, f), () => c(f)))) : s !== !0 && t.forIn("key", n, (f) => s === void 0 ? c(f) : t.if(l(s, f), () => c(f))), o.props = !0, e.ok((0, Yr._)`${i} === ${j1.default.errors}`);
    function c(f) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: f }), e.error(), a || t.break();
        return;
      }
      if (!(0, bh.alwaysValidSchema)(o, r)) {
        const h = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: f,
          dataPropType: bh.Type.Str
        }, h), a || t.if((0, Yr.not)(h), () => t.break());
      }
    }
    function u(f, h) {
      return (0, Yr._)`!${f} || !${f}[${h}]`;
    }
    function l(f, h) {
      const p = [];
      for (const g in f)
        f[g] === !0 && p.push((0, Yr._)`${h} !== ${g}`);
      return (0, Yr.and)(...p);
    }
  }
};
tf.default = L1;
var rf = {};
Object.defineProperty(rf, "__esModule", { value: !0 });
const In = le, Sh = X, U1 = {
  message: ({ params: { len: e } }) => (0, In.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, In._)`{limit: ${e}}`
}, M1 = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: U1,
  code(e) {
    const { gen: t, schema: r, data: n, it: i } = e, o = i.items || 0;
    if (o === !0)
      return;
    const a = t.const("len", (0, In._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: o }), e.fail((0, In._)`${a} > ${o}`);
    else if (typeof r == "object" && !(0, Sh.alwaysValidSchema)(i, r)) {
      const c = t.var("valid", (0, In._)`${a} <= ${o}`);
      t.if((0, In.not)(c), () => s(c, o)), e.ok(c);
    }
    i.items = !0;
    function s(c, u) {
      t.forRange("i", u, a, (l) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: Sh.Type.Num }, c), i.allErrors || t.if((0, In.not)(c), () => t.break());
      });
    }
  }
};
rf.default = M1;
Object.defineProperty(ef, "__esModule", { value: !0 });
const x1 = tf, V1 = rf, q1 = [x1.default, V1.default];
ef.default = q1;
var nf = {}, of = {};
Object.defineProperty(of, "__esModule", { value: !0 });
const Le = le, B1 = {
  message: ({ schemaCode: e }) => (0, Le.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, Le._)`{format: ${e}}`
}, H1 = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: B1,
  code(e, t) {
    const { gen: r, data: n, $data: i, schema: o, schemaCode: a, it: s } = e, { opts: c, errSchemaPath: u, schemaEnv: l, self: f } = s;
    if (!c.validateFormats)
      return;
    i ? h() : p();
    function h() {
      const g = r.scopeValue("formats", {
        ref: f.formats,
        code: c.code.formats
      }), $ = r.const("fDef", (0, Le._)`${g}[${a}]`), v = r.let("fType"), y = r.let("format");
      r.if((0, Le._)`typeof ${$} == "object" && !(${$} instanceof RegExp)`, () => r.assign(v, (0, Le._)`${$}.type || "string"`).assign(y, (0, Le._)`${$}.validate`), () => r.assign(v, (0, Le._)`"string"`).assign(y, $)), e.fail$data((0, Le.or)(E(), A()));
      function E() {
        return c.strictSchema === !1 ? Le.nil : (0, Le._)`${a} && !${y}`;
      }
      function A() {
        const C = l.$async ? (0, Le._)`(${$}.async ? await ${y}(${n}) : ${y}(${n}))` : (0, Le._)`${y}(${n})`, D = (0, Le._)`(typeof ${y} == "function" ? ${C} : ${y}.test(${n}))`;
        return (0, Le._)`${y} && ${y} !== true && ${v} === ${t} && !${D}`;
      }
    }
    function p() {
      const g = f.formats[o];
      if (!g) {
        E();
        return;
      }
      if (g === !0)
        return;
      const [$, v, y] = A(g);
      $ === t && e.pass(C());
      function E() {
        if (c.strictSchema === !1) {
          f.logger.warn(D());
          return;
        }
        throw new Error(D());
        function D() {
          return `unknown format "${o}" ignored in schema at path "${u}"`;
        }
      }
      function A(D) {
        const V = D instanceof RegExp ? (0, Le.regexpCode)(D) : c.code.formats ? (0, Le._)`${c.code.formats}${(0, Le.getProperty)(o)}` : void 0, z = r.scopeValue("formats", { key: o, ref: D, code: V });
        return typeof D == "object" && !(D instanceof RegExp) ? [D.type || "string", D.validate, (0, Le._)`${z}.validate`] : ["string", D, z];
      }
      function C() {
        if (typeof g == "object" && !(g instanceof RegExp) && g.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, Le._)`await ${y}(${n})`;
        }
        return typeof v == "function" ? (0, Le._)`${y}(${n})` : (0, Le._)`${y}.test(${n})`;
      }
    }
  }
};
of.default = H1;
Object.defineProperty(nf, "__esModule", { value: !0 });
const z1 = of, G1 = [z1.default];
nf.default = G1;
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.contentVocabulary = Ti.metadataVocabulary = void 0;
Ti.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Ti.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(_u, "__esModule", { value: !0 });
const K1 = $u, W1 = Eu, Y1 = ku, X1 = Ku, J1 = Xu, Q1 = ef, Z1 = nf, Ph = Ti, eP = [
  X1.default,
  K1.default,
  W1.default,
  (0, Y1.default)(!0),
  Z1.default,
  Ph.metadataVocabulary,
  Ph.contentVocabulary,
  J1.default,
  Q1.default
];
_u.default = eP;
var af = {}, Bs = {};
Object.defineProperty(Bs, "__esModule", { value: !0 });
Bs.DiscrError = void 0;
var Th;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Th || (Bs.DiscrError = Th = {}));
Object.defineProperty(af, "__esModule", { value: !0 });
const si = le, Nl = Bs, Oh = pt, tP = ki, rP = X, nP = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Nl.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, si._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, iP = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: nP,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: i, it: o } = e, { oneOf: a } = i;
    if (!o.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const s = n.propertyName;
    if (typeof s != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!a)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), u = t.const("tag", (0, si._)`${r}${(0, si.getProperty)(s)}`);
    t.if((0, si._)`typeof ${u} == "string"`, () => l(), () => e.error(!1, { discrError: Nl.DiscrError.Tag, tag: u, tagName: s })), e.ok(c);
    function l() {
      const p = h();
      t.if(!1);
      for (const g in p)
        t.elseIf((0, si._)`${u} === ${g}`), t.assign(c, f(p[g]));
      t.else(), e.error(!1, { discrError: Nl.DiscrError.Mapping, tag: u, tagName: s }), t.endIf();
    }
    function f(p) {
      const g = t.name("valid"), $ = e.subschema({ keyword: "oneOf", schemaProp: p }, g);
      return e.mergeEvaluated($, si.Name), g;
    }
    function h() {
      var p;
      const g = {}, $ = y(i);
      let v = !0;
      for (let C = 0; C < a.length; C++) {
        let D = a[C];
        if (D != null && D.$ref && !(0, rP.schemaHasRulesButRef)(D, o.self.RULES)) {
          const z = D.$ref;
          if (D = Oh.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, z), D instanceof Oh.SchemaEnv && (D = D.schema), D === void 0)
            throw new tP.default(o.opts.uriResolver, o.baseId, z);
        }
        const V = (p = D == null ? void 0 : D.properties) === null || p === void 0 ? void 0 : p[s];
        if (typeof V != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${s}"`);
        v = v && ($ || y(D)), E(V, C);
      }
      if (!v)
        throw new Error(`discriminator: "${s}" must be required`);
      return g;
      function y({ required: C }) {
        return Array.isArray(C) && C.includes(s);
      }
      function E(C, D) {
        if (C.const)
          A(C.const, D);
        else if (C.enum)
          for (const V of C.enum)
            A(V, D);
        else
          throw new Error(`discriminator: "properties/${s}" must have "const" or "enum"`);
      }
      function A(C, D) {
        if (typeof C != "string" || C in g)
          throw new Error(`discriminator: "${s}" values must be unique strings`);
        g[C] = D;
      }
    }
  }
};
af.default = iP;
var sf = {};
const oP = "https://json-schema.org/draft/2020-12/schema", aP = "https://json-schema.org/draft/2020-12/schema", sP = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, cP = "meta", lP = "Core and Validation specifications meta-schema", uP = [
  {
    $ref: "meta/core"
  },
  {
    $ref: "meta/applicator"
  },
  {
    $ref: "meta/unevaluated"
  },
  {
    $ref: "meta/validation"
  },
  {
    $ref: "meta/meta-data"
  },
  {
    $ref: "meta/format-annotation"
  },
  {
    $ref: "meta/content"
  }
], fP = [
  "object",
  "boolean"
], dP = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", hP = {
  definitions: {
    $comment: '"definitions" has been replaced by "$defs".',
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    deprecated: !0,
    default: {}
  },
  dependencies: {
    $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $dynamicRef: "#meta"
        },
        {
          $ref: "meta/validation#/$defs/stringArray"
        }
      ]
    },
    deprecated: !0,
    default: {}
  },
  $recursiveAnchor: {
    $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
    $ref: "meta/core#/$defs/anchorString",
    deprecated: !0
  },
  $recursiveRef: {
    $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
    $ref: "meta/core#/$defs/uriReferenceString",
    deprecated: !0
  }
}, pP = {
  $schema: oP,
  $id: aP,
  $vocabulary: sP,
  $dynamicAnchor: cP,
  title: lP,
  allOf: uP,
  type: fP,
  $comment: dP,
  properties: hP
}, mP = "https://json-schema.org/draft/2020-12/schema", yP = "https://json-schema.org/draft/2020-12/meta/applicator", gP = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, vP = "meta", _P = "Applicator vocabulary meta-schema", $P = [
  "object",
  "boolean"
], wP = {
  prefixItems: {
    $ref: "#/$defs/schemaArray"
  },
  items: {
    $dynamicRef: "#meta"
  },
  contains: {
    $dynamicRef: "#meta"
  },
  additionalProperties: {
    $dynamicRef: "#meta"
  },
  properties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependentSchemas: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  propertyNames: {
    $dynamicRef: "#meta"
  },
  if: {
    $dynamicRef: "#meta"
  },
  then: {
    $dynamicRef: "#meta"
  },
  else: {
    $dynamicRef: "#meta"
  },
  allOf: {
    $ref: "#/$defs/schemaArray"
  },
  anyOf: {
    $ref: "#/$defs/schemaArray"
  },
  oneOf: {
    $ref: "#/$defs/schemaArray"
  },
  not: {
    $dynamicRef: "#meta"
  }
}, EP = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, bP = {
  $schema: mP,
  $id: yP,
  $vocabulary: gP,
  $dynamicAnchor: vP,
  title: _P,
  type: $P,
  properties: wP,
  $defs: EP
}, SP = "https://json-schema.org/draft/2020-12/schema", PP = "https://json-schema.org/draft/2020-12/meta/unevaluated", TP = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, OP = "meta", AP = "Unevaluated applicator vocabulary meta-schema", NP = [
  "object",
  "boolean"
], IP = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, CP = {
  $schema: SP,
  $id: PP,
  $vocabulary: TP,
  $dynamicAnchor: OP,
  title: AP,
  type: NP,
  properties: IP
}, RP = "https://json-schema.org/draft/2020-12/schema", DP = "https://json-schema.org/draft/2020-12/meta/content", kP = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, jP = "meta", FP = "Content vocabulary meta-schema", LP = [
  "object",
  "boolean"
], UP = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, MP = {
  $schema: RP,
  $id: DP,
  $vocabulary: kP,
  $dynamicAnchor: jP,
  title: FP,
  type: LP,
  properties: UP
}, xP = "https://json-schema.org/draft/2020-12/schema", VP = "https://json-schema.org/draft/2020-12/meta/core", qP = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, BP = "meta", HP = "Core vocabulary meta-schema", zP = [
  "object",
  "boolean"
], GP = {
  $id: {
    $ref: "#/$defs/uriReferenceString",
    $comment: "Non-empty fragments not allowed.",
    pattern: "^[^#]*#?$"
  },
  $schema: {
    $ref: "#/$defs/uriString"
  },
  $ref: {
    $ref: "#/$defs/uriReferenceString"
  },
  $anchor: {
    $ref: "#/$defs/anchorString"
  },
  $dynamicRef: {
    $ref: "#/$defs/uriReferenceString"
  },
  $dynamicAnchor: {
    $ref: "#/$defs/anchorString"
  },
  $vocabulary: {
    type: "object",
    propertyNames: {
      $ref: "#/$defs/uriString"
    },
    additionalProperties: {
      type: "boolean"
    }
  },
  $comment: {
    type: "string"
  },
  $defs: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    }
  }
}, KP = {
  anchorString: {
    type: "string",
    pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
  },
  uriString: {
    type: "string",
    format: "uri"
  },
  uriReferenceString: {
    type: "string",
    format: "uri-reference"
  }
}, WP = {
  $schema: xP,
  $id: VP,
  $vocabulary: qP,
  $dynamicAnchor: BP,
  title: HP,
  type: zP,
  properties: GP,
  $defs: KP
}, YP = "https://json-schema.org/draft/2020-12/schema", XP = "https://json-schema.org/draft/2020-12/meta/format-annotation", JP = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, QP = "meta", ZP = "Format vocabulary meta-schema for annotation results", eT = [
  "object",
  "boolean"
], tT = {
  format: {
    type: "string"
  }
}, rT = {
  $schema: YP,
  $id: XP,
  $vocabulary: JP,
  $dynamicAnchor: QP,
  title: ZP,
  type: eT,
  properties: tT
}, nT = "https://json-schema.org/draft/2020-12/schema", iT = "https://json-schema.org/draft/2020-12/meta/meta-data", oT = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, aT = "meta", sT = "Meta-data vocabulary meta-schema", cT = [
  "object",
  "boolean"
], lT = {
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  deprecated: {
    type: "boolean",
    default: !1
  },
  readOnly: {
    type: "boolean",
    default: !1
  },
  writeOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  }
}, uT = {
  $schema: nT,
  $id: iT,
  $vocabulary: oT,
  $dynamicAnchor: aT,
  title: sT,
  type: cT,
  properties: lT
}, fT = "https://json-schema.org/draft/2020-12/schema", dT = "https://json-schema.org/draft/2020-12/meta/validation", hT = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, pT = "meta", mT = "Validation vocabulary meta-schema", yT = [
  "object",
  "boolean"
], gT = {
  type: {
    anyOf: [
      {
        $ref: "#/$defs/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/$defs/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  const: !0,
  enum: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  maxItems: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  maxContains: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minContains: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 1
  },
  maxProperties: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/$defs/stringArray"
  },
  dependentRequired: {
    type: "object",
    additionalProperties: {
      $ref: "#/$defs/stringArray"
    }
  }
}, vT = {
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 0
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, _T = {
  $schema: fT,
  $id: dT,
  $vocabulary: hT,
  $dynamicAnchor: pT,
  title: mT,
  type: yT,
  properties: gT,
  $defs: vT
};
Object.defineProperty(sf, "__esModule", { value: !0 });
const $T = pP, wT = bP, ET = CP, bT = MP, ST = WP, PT = rT, TT = uT, OT = _T, AT = ["/properties"];
function NT(e) {
  return [
    $T,
    wT,
    ET,
    bT,
    ST,
    t(this, PT),
    TT,
    t(this, OT)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, AT) : n;
  }
}
sf.default = NT;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = uy, n = _u, i = af, o = sf, a = "https://json-schema.org/draft/2020-12/schema";
  class s extends r.default {
    constructor(p = {}) {
      super({
        ...p,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((p) => this.addVocabulary(p)), this.opts.discriminator && this.addKeyword(i.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: p, meta: g } = this.opts;
      g && (o.default.call(this, p), this.refs["http://json-schema.org/schema"] = a);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
    }
  }
  t.Ajv2020 = s, e.exports = t = s, e.exports.Ajv2020 = s, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = s;
  var c = tr;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var u = le;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return u._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return u.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return u.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return u.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return u.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return u.CodeGen;
  } });
  var l = Ko;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return l.default;
  } });
  var f = ki;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return f.default;
  } });
})(El, El.exports);
var IT = El.exports, Il = { exports: {} }, lg = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(M, x) {
    return { validate: M, compare: x };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(o, a),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(c(!0), u),
    "date-time": t(h(!0), p),
    "iso-time": t(c(), l),
    "iso-date-time": t(h(), g),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: y,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: W,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: A,
    // signed 32 bit integer
    int32: { type: "number", validate: V },
    // signed 64 bit integer
    int64: { type: "number", validate: z },
    // C-type float
    float: { type: "number", validate: G },
    // C-type double
    double: { type: "number", validate: G },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, a),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, u),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, p),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, l),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, g),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(M) {
    return M % 4 === 0 && (M % 100 !== 0 || M % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, i = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function o(M) {
    const x = n.exec(M);
    if (!x)
      return !1;
    const J = +x[1], F = +x[2], L = +x[3];
    return F >= 1 && F <= 12 && L >= 1 && L <= (F === 2 && r(J) ? 29 : i[F]);
  }
  function a(M, x) {
    if (M && x)
      return M > x ? 1 : M < x ? -1 : 0;
  }
  const s = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(M) {
    return function(J) {
      const F = s.exec(J);
      if (!F)
        return !1;
      const L = +F[1], H = +F[2], U = +F[3], K = F[4], B = F[5] === "-" ? -1 : 1, R = +(F[6] || 0), b = +(F[7] || 0);
      if (R > 23 || b > 59 || M && !K)
        return !1;
      if (L <= 23 && H <= 59 && U < 60)
        return !0;
      const O = H - b * B, S = L - R * B - (O < 0 ? 1 : 0);
      return (S === 23 || S === -1) && (O === 59 || O === -1) && U < 61;
    };
  }
  function u(M, x) {
    if (!(M && x))
      return;
    const J = (/* @__PURE__ */ new Date("2020-01-01T" + M)).valueOf(), F = (/* @__PURE__ */ new Date("2020-01-01T" + x)).valueOf();
    if (J && F)
      return J - F;
  }
  function l(M, x) {
    if (!(M && x))
      return;
    const J = s.exec(M), F = s.exec(x);
    if (J && F)
      return M = J[1] + J[2] + J[3], x = F[1] + F[2] + F[3], M > x ? 1 : M < x ? -1 : 0;
  }
  const f = /t|\s/i;
  function h(M) {
    const x = c(M);
    return function(F) {
      const L = F.split(f);
      return L.length === 2 && o(L[0]) && x(L[1]);
    };
  }
  function p(M, x) {
    if (!(M && x))
      return;
    const J = new Date(M).valueOf(), F = new Date(x).valueOf();
    if (J && F)
      return J - F;
  }
  function g(M, x) {
    if (!(M && x))
      return;
    const [J, F] = M.split(f), [L, H] = x.split(f), U = a(J, L);
    if (U !== void 0)
      return U || u(F, H);
  }
  const $ = /\/|:/, v = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function y(M) {
    return $.test(M) && v.test(M);
  }
  const E = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function A(M) {
    return E.lastIndex = 0, E.test(M);
  }
  const C = -2147483648, D = 2 ** 31 - 1;
  function V(M) {
    return Number.isInteger(M) && M <= D && M >= C;
  }
  function z(M) {
    return Number.isInteger(M);
  }
  function G() {
    return !0;
  }
  const N = /[^\\]\\Z/;
  function W(M) {
    if (N.test(M))
      return !1;
    try {
      return new RegExp(M), !0;
    } catch {
      return !1;
    }
  }
})(lg);
var ug = {}, Cl = { exports: {} }, fg = {}, rr = {}, Oi = {}, Yo = {}, he = {}, No = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(E) {
      if (super(), !e.IDENTIFIER.test(E))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(E) {
      super(), this._items = typeof E == "string" ? [E] : E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const E = this._items[0];
      return E === "" || E === '""';
    }
    get str() {
      var E;
      return (E = this._str) !== null && E !== void 0 ? E : this._str = this._items.reduce((A, C) => `${A}${C}`, "");
    }
    get names() {
      var E;
      return (E = this._names) !== null && E !== void 0 ? E : this._names = this._items.reduce((A, C) => (C instanceof r && (A[C.str] = (A[C.str] || 0) + 1), A), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function i(y, ...E) {
    const A = [y[0]];
    let C = 0;
    for (; C < E.length; )
      s(A, E[C]), A.push(y[++C]);
    return new n(A);
  }
  e._ = i;
  const o = new n("+");
  function a(y, ...E) {
    const A = [p(y[0])];
    let C = 0;
    for (; C < E.length; )
      A.push(o), s(A, E[C]), A.push(o, p(y[++C]));
    return c(A), new n(A);
  }
  e.str = a;
  function s(y, E) {
    E instanceof n ? y.push(...E._items) : E instanceof r ? y.push(E) : y.push(f(E));
  }
  e.addCodeArg = s;
  function c(y) {
    let E = 1;
    for (; E < y.length - 1; ) {
      if (y[E] === o) {
        const A = u(y[E - 1], y[E + 1]);
        if (A !== void 0) {
          y.splice(E - 1, 3, A);
          continue;
        }
        y[E++] = "+";
      }
      E++;
    }
  }
  function u(y, E) {
    if (E === '""')
      return y;
    if (y === '""')
      return E;
    if (typeof y == "string")
      return E instanceof r || y[y.length - 1] !== '"' ? void 0 : typeof E != "string" ? `${y.slice(0, -1)}${E}"` : E[0] === '"' ? y.slice(0, -1) + E.slice(1) : void 0;
    if (typeof E == "string" && E[0] === '"' && !(y instanceof r))
      return `"${y}${E.slice(1)}`;
  }
  function l(y, E) {
    return E.emptyStr() ? y : y.emptyStr() ? E : a`${y}${E}`;
  }
  e.strConcat = l;
  function f(y) {
    return typeof y == "number" || typeof y == "boolean" || y === null ? y : p(Array.isArray(y) ? y.join(",") : y);
  }
  function h(y) {
    return new n(p(y));
  }
  e.stringify = h;
  function p(y) {
    return JSON.stringify(y).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = p;
  function g(y) {
    return typeof y == "string" && e.IDENTIFIER.test(y) ? new n(`.${y}`) : i`[${y}]`;
  }
  e.getProperty = g;
  function $(y) {
    if (typeof y == "string" && e.IDENTIFIER.test(y))
      return new n(`${y}`);
    throw new Error(`CodeGen: invalid export name: ${y}, use explicit $id name mapping`);
  }
  e.getEsmExportName = $;
  function v(y) {
    return new n(y.toString());
  }
  e.regexpCode = v;
})(No);
var Rl = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = No;
  class r extends Error {
    constructor(u) {
      super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class i {
    constructor({ prefixes: u, parent: l } = {}) {
      this._names = {}, this._prefixes = u, this._parent = l;
    }
    toName(u) {
      return u instanceof t.Name ? u : this.name(u);
    }
    name(u) {
      return new t.Name(this._newName(u));
    }
    _newName(u) {
      const l = this._names[u] || this._nameGroup(u);
      return `${u}${l.index++}`;
    }
    _nameGroup(u) {
      var l, f;
      if (!((f = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || f === void 0) && f.has(u) || this._prefixes && !this._prefixes.has(u))
        throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
      return this._names[u] = { prefix: u, index: 0 };
    }
  }
  e.Scope = i;
  class o extends t.Name {
    constructor(u, l) {
      super(l), this.prefix = u;
    }
    setValue(u, { property: l, itemIndex: f }) {
      this.value = u, this.scopePath = (0, t._)`.${new t.Name(l)}[${f}]`;
    }
  }
  e.ValueScopeName = o;
  const a = (0, t._)`\n`;
  class s extends i {
    constructor(u) {
      super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? a : t.nil };
    }
    get() {
      return this._scope;
    }
    name(u) {
      return new o(u, this._newName(u));
    }
    value(u, l) {
      var f;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const h = this.toName(u), { prefix: p } = h, g = (f = l.key) !== null && f !== void 0 ? f : l.ref;
      let $ = this._values[p];
      if ($) {
        const E = $.get(g);
        if (E)
          return E;
      } else
        $ = this._values[p] = /* @__PURE__ */ new Map();
      $.set(g, h);
      const v = this._scope[p] || (this._scope[p] = []), y = v.length;
      return v[y] = l.ref, h.setValue(l, { property: p, itemIndex: y }), h;
    }
    getValue(u, l) {
      const f = this._values[u];
      if (f)
        return f.get(l);
    }
    scopeRefs(u, l = this._values) {
      return this._reduceValues(l, (f) => {
        if (f.scopePath === void 0)
          throw new Error(`CodeGen: name "${f}" has no value`);
        return (0, t._)`${u}${f.scopePath}`;
      });
    }
    scopeCode(u = this._values, l, f) {
      return this._reduceValues(u, (h) => {
        if (h.value === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return h.value.code;
      }, l, f);
    }
    _reduceValues(u, l, f = {}, h) {
      let p = t.nil;
      for (const g in u) {
        const $ = u[g];
        if (!$)
          continue;
        const v = f[g] = f[g] || /* @__PURE__ */ new Map();
        $.forEach((y) => {
          if (v.has(y))
            return;
          v.set(y, n.Started);
          let E = l(y);
          if (E) {
            const A = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            p = (0, t._)`${p}${A} ${y} = ${E};${this.opts._n}`;
          } else if (E = h == null ? void 0 : h(y))
            p = (0, t._)`${p}${E}${this.opts._n}`;
          else
            throw new r(y);
          v.set(y, n.Completed);
        });
      }
      return p;
    }
  }
  e.ValueScope = s;
})(Rl);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = No, r = Rl;
  var n = No;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var i = Rl;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return i.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return i.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return i.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return i.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class o {
    optimizeNodes() {
      return this;
    }
    optimizeNames(d, m) {
      return this;
    }
  }
  class a extends o {
    constructor(d, m, P) {
      super(), this.varKind = d, this.name = m, this.rhs = P;
    }
    render({ es5: d, _n: m }) {
      const P = d ? r.varKinds.var : this.varKind, w = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${P} ${this.name}${w};` + m;
    }
    optimizeNames(d, m) {
      if (d[this.name.str])
        return this.rhs && (this.rhs = F(this.rhs, d, m)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class s extends o {
    constructor(d, m, P) {
      super(), this.lhs = d, this.rhs = m, this.sideEffects = P;
    }
    render({ _n: d }) {
      return `${this.lhs} = ${this.rhs};` + d;
    }
    optimizeNames(d, m) {
      if (!(this.lhs instanceof t.Name && !d[this.lhs.str] && !this.sideEffects))
        return this.rhs = F(this.rhs, d, m), this;
    }
    get names() {
      const d = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return J(d, this.rhs);
    }
  }
  class c extends s {
    constructor(d, m, P, w) {
      super(d, P, w), this.op = m;
    }
    render({ _n: d }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + d;
    }
  }
  class u extends o {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `${this.label}:` + d;
    }
  }
  class l extends o {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `break${this.label ? ` ${this.label}` : ""};` + d;
    }
  }
  class f extends o {
    constructor(d) {
      super(), this.error = d;
    }
    render({ _n: d }) {
      return `throw ${this.error};` + d;
    }
    get names() {
      return this.error.names;
    }
  }
  class h extends o {
    constructor(d) {
      super(), this.code = d;
    }
    render({ _n: d }) {
      return `${this.code};` + d;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(d, m) {
      return this.code = F(this.code, d, m), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class p extends o {
    constructor(d = []) {
      super(), this.nodes = d;
    }
    render(d) {
      return this.nodes.reduce((m, P) => m + P.render(d), "");
    }
    optimizeNodes() {
      const { nodes: d } = this;
      let m = d.length;
      for (; m--; ) {
        const P = d[m].optimizeNodes();
        Array.isArray(P) ? d.splice(m, 1, ...P) : P ? d[m] = P : d.splice(m, 1);
      }
      return d.length > 0 ? this : void 0;
    }
    optimizeNames(d, m) {
      const { nodes: P } = this;
      let w = P.length;
      for (; w--; ) {
        const _ = P[w];
        _.optimizeNames(d, m) || (L(d, _.names), P.splice(w, 1));
      }
      return P.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((d, m) => x(d, m.names), {});
    }
  }
  class g extends p {
    render(d) {
      return "{" + d._n + super.render(d) + "}" + d._n;
    }
  }
  class $ extends p {
  }
  class v extends g {
  }
  v.kind = "else";
  class y extends g {
    constructor(d, m) {
      super(m), this.condition = d;
    }
    render(d) {
      let m = `if(${this.condition})` + super.render(d);
      return this.else && (m += "else " + this.else.render(d)), m;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const d = this.condition;
      if (d === !0)
        return this.nodes;
      let m = this.else;
      if (m) {
        const P = m.optimizeNodes();
        m = this.else = Array.isArray(P) ? new v(P) : P;
      }
      if (m)
        return d === !1 ? m instanceof y ? m : m.nodes : this.nodes.length ? this : new y(H(d), m instanceof y ? [m] : m.nodes);
      if (!(d === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(d, m) {
      var P;
      if (this.else = (P = this.else) === null || P === void 0 ? void 0 : P.optimizeNames(d, m), !!(super.optimizeNames(d, m) || this.else))
        return this.condition = F(this.condition, d, m), this;
    }
    get names() {
      const d = super.names;
      return J(d, this.condition), this.else && x(d, this.else.names), d;
    }
  }
  y.kind = "if";
  class E extends g {
  }
  E.kind = "for";
  class A extends E {
    constructor(d) {
      super(), this.iteration = d;
    }
    render(d) {
      return `for(${this.iteration})` + super.render(d);
    }
    optimizeNames(d, m) {
      if (super.optimizeNames(d, m))
        return this.iteration = F(this.iteration, d, m), this;
    }
    get names() {
      return x(super.names, this.iteration.names);
    }
  }
  class C extends E {
    constructor(d, m, P, w) {
      super(), this.varKind = d, this.name = m, this.from = P, this.to = w;
    }
    render(d) {
      const m = d.es5 ? r.varKinds.var : this.varKind, { name: P, from: w, to: _ } = this;
      return `for(${m} ${P}=${w}; ${P}<${_}; ${P}++)` + super.render(d);
    }
    get names() {
      const d = J(super.names, this.from);
      return J(d, this.to);
    }
  }
  class D extends E {
    constructor(d, m, P, w) {
      super(), this.loop = d, this.varKind = m, this.name = P, this.iterable = w;
    }
    render(d) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(d);
    }
    optimizeNames(d, m) {
      if (super.optimizeNames(d, m))
        return this.iterable = F(this.iterable, d, m), this;
    }
    get names() {
      return x(super.names, this.iterable.names);
    }
  }
  class V extends g {
    constructor(d, m, P) {
      super(), this.name = d, this.args = m, this.async = P;
    }
    render(d) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(d);
    }
  }
  V.kind = "func";
  class z extends p {
    render(d) {
      return "return " + super.render(d);
    }
  }
  z.kind = "return";
  class G extends g {
    render(d) {
      let m = "try" + super.render(d);
      return this.catch && (m += this.catch.render(d)), this.finally && (m += this.finally.render(d)), m;
    }
    optimizeNodes() {
      var d, m;
      return super.optimizeNodes(), (d = this.catch) === null || d === void 0 || d.optimizeNodes(), (m = this.finally) === null || m === void 0 || m.optimizeNodes(), this;
    }
    optimizeNames(d, m) {
      var P, w;
      return super.optimizeNames(d, m), (P = this.catch) === null || P === void 0 || P.optimizeNames(d, m), (w = this.finally) === null || w === void 0 || w.optimizeNames(d, m), this;
    }
    get names() {
      const d = super.names;
      return this.catch && x(d, this.catch.names), this.finally && x(d, this.finally.names), d;
    }
  }
  class N extends g {
    constructor(d) {
      super(), this.error = d;
    }
    render(d) {
      return `catch(${this.error})` + super.render(d);
    }
  }
  N.kind = "catch";
  class W extends g {
    render(d) {
      return "finally" + super.render(d);
    }
  }
  W.kind = "finally";
  class M {
    constructor(d, m = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...m, _n: m.lines ? `
` : "" }, this._extScope = d, this._scope = new r.Scope({ parent: d }), this._nodes = [new $()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(d) {
      return this._scope.name(d);
    }
    // reserves unique name in the external scope
    scopeName(d) {
      return this._extScope.name(d);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(d, m) {
      const P = this._extScope.value(d, m);
      return (this._values[P.prefix] || (this._values[P.prefix] = /* @__PURE__ */ new Set())).add(P), P;
    }
    getScopeValue(d, m) {
      return this._extScope.getValue(d, m);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(d) {
      return this._extScope.scopeRefs(d, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(d, m, P, w) {
      const _ = this._scope.toName(m);
      return P !== void 0 && w && (this._constants[_.str] = P), this._leafNode(new a(d, _, P)), _;
    }
    // `const` declaration (`var` in es5 mode)
    const(d, m, P) {
      return this._def(r.varKinds.const, d, m, P);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(d, m, P) {
      return this._def(r.varKinds.let, d, m, P);
    }
    // `var` declaration with optional assignment
    var(d, m, P) {
      return this._def(r.varKinds.var, d, m, P);
    }
    // assignment code
    assign(d, m, P) {
      return this._leafNode(new s(d, m, P));
    }
    // `+=` code
    add(d, m) {
      return this._leafNode(new c(d, e.operators.ADD, m));
    }
    // appends passed SafeExpr to code or executes Block
    code(d) {
      return typeof d == "function" ? d() : d !== t.nil && this._leafNode(new h(d)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...d) {
      const m = ["{"];
      for (const [P, w] of d)
        m.length > 1 && m.push(","), m.push(P), (P !== w || this.opts.es5) && (m.push(":"), (0, t.addCodeArg)(m, w));
      return m.push("}"), new t._Code(m);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(d, m, P) {
      if (this._blockNode(new y(d)), m && P)
        this.code(m).else().code(P).endIf();
      else if (m)
        this.code(m).endIf();
      else if (P)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(d) {
      return this._elseNode(new y(d));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new v());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(y, v);
    }
    _for(d, m) {
      return this._blockNode(d), m && this.code(m).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(d, m) {
      return this._for(new A(d), m);
    }
    // `for` statement for a range of values
    forRange(d, m, P, w, _ = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const k = this._scope.toName(d);
      return this._for(new C(_, k, m, P), () => w(k));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(d, m, P, w = r.varKinds.const) {
      const _ = this._scope.toName(d);
      if (this.opts.es5) {
        const k = m instanceof t.Name ? m : this.var("_arr", m);
        return this.forRange("_i", 0, (0, t._)`${k}.length`, (I) => {
          this.var(_, (0, t._)`${k}[${I}]`), P(_);
        });
      }
      return this._for(new D("of", w, _, m), () => P(_));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(d, m, P, w = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(d, (0, t._)`Object.keys(${m})`, P);
      const _ = this._scope.toName(d);
      return this._for(new D("in", w, _, m), () => P(_));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(E);
    }
    // `label` statement
    label(d) {
      return this._leafNode(new u(d));
    }
    // `break` statement
    break(d) {
      return this._leafNode(new l(d));
    }
    // `return` statement
    return(d) {
      const m = new z();
      if (this._blockNode(m), this.code(d), m.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(z);
    }
    // `try` statement
    try(d, m, P) {
      if (!m && !P)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const w = new G();
      if (this._blockNode(w), this.code(d), m) {
        const _ = this.name("e");
        this._currNode = w.catch = new N(_), m(_);
      }
      return P && (this._currNode = w.finally = new W(), this.code(P)), this._endBlockNode(N, W);
    }
    // `throw` statement
    throw(d) {
      return this._leafNode(new f(d));
    }
    // start self-balancing block
    block(d, m) {
      return this._blockStarts.push(this._nodes.length), d && this.code(d).endBlock(m), this;
    }
    // end the current self-balancing block
    endBlock(d) {
      const m = this._blockStarts.pop();
      if (m === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const P = this._nodes.length - m;
      if (P < 0 || d !== void 0 && P !== d)
        throw new Error(`CodeGen: wrong number of nodes: ${P} vs ${d} expected`);
      return this._nodes.length = m, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(d, m = t.nil, P, w) {
      return this._blockNode(new V(d, m, P)), w && this.code(w).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(V);
    }
    optimize(d = 1) {
      for (; d-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(d) {
      return this._currNode.nodes.push(d), this;
    }
    _blockNode(d) {
      this._currNode.nodes.push(d), this._nodes.push(d);
    }
    _endBlockNode(d, m) {
      const P = this._currNode;
      if (P instanceof d || m && P instanceof m)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${m ? `${d.kind}/${m.kind}` : d.kind}"`);
    }
    _elseNode(d) {
      const m = this._currNode;
      if (!(m instanceof y))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = m.else = d, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const d = this._nodes;
      return d[d.length - 1];
    }
    set _currNode(d) {
      const m = this._nodes;
      m[m.length - 1] = d;
    }
  }
  e.CodeGen = M;
  function x(S, d) {
    for (const m in d)
      S[m] = (S[m] || 0) + (d[m] || 0);
    return S;
  }
  function J(S, d) {
    return d instanceof t._CodeOrName ? x(S, d.names) : S;
  }
  function F(S, d, m) {
    if (S instanceof t.Name)
      return P(S);
    if (!w(S))
      return S;
    return new t._Code(S._items.reduce((_, k) => (k instanceof t.Name && (k = P(k)), k instanceof t._Code ? _.push(...k._items) : _.push(k), _), []));
    function P(_) {
      const k = m[_.str];
      return k === void 0 || d[_.str] !== 1 ? _ : (delete d[_.str], k);
    }
    function w(_) {
      return _ instanceof t._Code && _._items.some((k) => k instanceof t.Name && d[k.str] === 1 && m[k.str] !== void 0);
    }
  }
  function L(S, d) {
    for (const m in d)
      S[m] = (S[m] || 0) - (d[m] || 0);
  }
  function H(S) {
    return typeof S == "boolean" || typeof S == "number" || S === null ? !S : (0, t._)`!${O(S)}`;
  }
  e.not = H;
  const U = b(e.operators.AND);
  function K(...S) {
    return S.reduce(U);
  }
  e.and = K;
  const B = b(e.operators.OR);
  function R(...S) {
    return S.reduce(B);
  }
  e.or = R;
  function b(S) {
    return (d, m) => d === t.nil ? m : m === t.nil ? d : (0, t._)`${O(d)} ${S} ${O(m)}`;
  }
  function O(S) {
    return S instanceof t.Name ? S : (0, t._)`(${S})`;
  }
})(he);
var Q = {};
Object.defineProperty(Q, "__esModule", { value: !0 });
Q.checkStrictMode = Q.getErrorPath = Q.Type = Q.useFunc = Q.setEvaluated = Q.evaluatedPropsToName = Q.mergeEvaluated = Q.eachItem = Q.unescapeJsonPointer = Q.escapeJsonPointer = Q.escapeFragment = Q.unescapeFragment = Q.schemaRefOrVal = Q.schemaHasRulesButRef = Q.schemaHasRules = Q.checkUnknownRules = Q.alwaysValidSchema = Q.toHash = void 0;
const be = he, CT = No;
function RT(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
Q.toHash = RT;
function DT(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (dg(e, t), !hg(t, e.self.RULES.all));
}
Q.alwaysValidSchema = DT;
function dg(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const o in t)
    i[o] || yg(e, `unknown keyword: "${o}"`);
}
Q.checkUnknownRules = dg;
function hg(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
Q.schemaHasRules = hg;
function kT(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
Q.schemaHasRulesButRef = kT;
function jT({ topSchemaRef: e, schemaPath: t }, r, n, i) {
  if (!i) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, be._)`${r}`;
  }
  return (0, be._)`${e}${t}${(0, be.getProperty)(n)}`;
}
Q.schemaRefOrVal = jT;
function FT(e) {
  return pg(decodeURIComponent(e));
}
Q.unescapeFragment = FT;
function LT(e) {
  return encodeURIComponent(cf(e));
}
Q.escapeFragment = LT;
function cf(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
Q.escapeJsonPointer = cf;
function pg(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
Q.unescapeJsonPointer = pg;
function UT(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
Q.eachItem = UT;
function Ah({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (i, o, a, s) => {
    const c = a === void 0 ? o : a instanceof be.Name ? (o instanceof be.Name ? e(i, o, a) : t(i, o, a), a) : o instanceof be.Name ? (t(i, a, o), o) : r(o, a);
    return s === be.Name && !(c instanceof be.Name) ? n(i, c) : c;
  };
}
Q.mergeEvaluated = {
  props: Ah({
    mergeNames: (e, t, r) => e.if((0, be._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, be._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, be._)`${r} || {}`).code((0, be._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, be._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, be._)`${r} || {}`), lf(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: mg
  }),
  items: Ah({
    mergeNames: (e, t, r) => e.if((0, be._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, be._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, be._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, be._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function mg(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, be._)`{}`);
  return t !== void 0 && lf(e, r, t), r;
}
Q.evaluatedPropsToName = mg;
function lf(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, be._)`${t}${(0, be.getProperty)(n)}`, !0));
}
Q.setEvaluated = lf;
const Nh = {};
function MT(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Nh[t.code] || (Nh[t.code] = new CT._Code(t.code))
  });
}
Q.useFunc = MT;
var Dl;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Dl || (Q.Type = Dl = {}));
function xT(e, t, r) {
  if (e instanceof be.Name) {
    const n = t === Dl.Num;
    return r ? n ? (0, be._)`"[" + ${e} + "]"` : (0, be._)`"['" + ${e} + "']"` : n ? (0, be._)`"/" + ${e}` : (0, be._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, be.getProperty)(e).toString() : "/" + cf(e);
}
Q.getErrorPath = xT;
function yg(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
Q.checkStrictMode = yg;
var mr = {};
Object.defineProperty(mr, "__esModule", { value: !0 });
const it = he, VT = {
  // validation function arguments
  data: new it.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new it.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new it.Name("instancePath"),
  parentData: new it.Name("parentData"),
  parentDataProperty: new it.Name("parentDataProperty"),
  rootData: new it.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new it.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new it.Name("vErrors"),
  // null or array of validation errors
  errors: new it.Name("errors"),
  // counter of validation errors
  this: new it.Name("this"),
  // "globals"
  self: new it.Name("self"),
  scope: new it.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new it.Name("json"),
  jsonPos: new it.Name("jsonPos"),
  jsonLen: new it.Name("jsonLen"),
  jsonPart: new it.Name("jsonPart")
};
mr.default = VT;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = he, r = Q, n = mr;
  e.keywordError = {
    message: ({ keyword: v }) => (0, t.str)`must pass "${v}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: v, schemaType: y }) => y ? (0, t.str)`"${v}" keyword must be ${y} ($data)` : (0, t.str)`"${v}" keyword is invalid ($data)`
  };
  function i(v, y = e.keywordError, E, A) {
    const { it: C } = v, { gen: D, compositeRule: V, allErrors: z } = C, G = f(v, y, E);
    A ?? (V || z) ? c(D, G) : u(C, (0, t._)`[${G}]`);
  }
  e.reportError = i;
  function o(v, y = e.keywordError, E) {
    const { it: A } = v, { gen: C, compositeRule: D, allErrors: V } = A, z = f(v, y, E);
    c(C, z), D || V || u(A, n.default.vErrors);
  }
  e.reportExtraError = o;
  function a(v, y) {
    v.assign(n.default.errors, y), v.if((0, t._)`${n.default.vErrors} !== null`, () => v.if(y, () => v.assign((0, t._)`${n.default.vErrors}.length`, y), () => v.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function s({ gen: v, keyword: y, schemaValue: E, data: A, errsCount: C, it: D }) {
    if (C === void 0)
      throw new Error("ajv implementation error");
    const V = v.name("err");
    v.forRange("i", C, n.default.errors, (z) => {
      v.const(V, (0, t._)`${n.default.vErrors}[${z}]`), v.if((0, t._)`${V}.instancePath === undefined`, () => v.assign((0, t._)`${V}.instancePath`, (0, t.strConcat)(n.default.instancePath, D.errorPath))), v.assign((0, t._)`${V}.schemaPath`, (0, t.str)`${D.errSchemaPath}/${y}`), D.opts.verbose && (v.assign((0, t._)`${V}.schema`, E), v.assign((0, t._)`${V}.data`, A));
    });
  }
  e.extendErrors = s;
  function c(v, y) {
    const E = v.const("err", y);
    v.if((0, t._)`${n.default.vErrors} === null`, () => v.assign(n.default.vErrors, (0, t._)`[${E}]`), (0, t._)`${n.default.vErrors}.push(${E})`), v.code((0, t._)`${n.default.errors}++`);
  }
  function u(v, y) {
    const { gen: E, validateName: A, schemaEnv: C } = v;
    C.$async ? E.throw((0, t._)`new ${v.ValidationError}(${y})`) : (E.assign((0, t._)`${A}.errors`, y), E.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function f(v, y, E) {
    const { createErrors: A } = v.it;
    return A === !1 ? (0, t._)`{}` : h(v, y, E);
  }
  function h(v, y, E = {}) {
    const { gen: A, it: C } = v, D = [
      p(C, E),
      g(v, E)
    ];
    return $(v, y, D), A.object(...D);
  }
  function p({ errorPath: v }, { instancePath: y }) {
    const E = y ? (0, t.str)`${v}${(0, r.getErrorPath)(y, r.Type.Str)}` : v;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, E)];
  }
  function g({ keyword: v, it: { errSchemaPath: y } }, { schemaPath: E, parentSchema: A }) {
    let C = A ? y : (0, t.str)`${y}/${v}`;
    return E && (C = (0, t.str)`${C}${(0, r.getErrorPath)(E, r.Type.Str)}`), [l.schemaPath, C];
  }
  function $(v, { params: y, message: E }, A) {
    const { keyword: C, data: D, schemaValue: V, it: z } = v, { opts: G, propertyName: N, topSchemaRef: W, schemaPath: M } = z;
    A.push([l.keyword, C], [l.params, typeof y == "function" ? y(v) : y || (0, t._)`{}`]), G.messages && A.push([l.message, typeof E == "function" ? E(v) : E]), G.verbose && A.push([l.schema, V], [l.parentSchema, (0, t._)`${W}${M}`], [n.default.data, D]), N && A.push([l.propertyName, N]);
  }
})(Yo);
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.boolOrEmptySchema = Oi.topBoolOrEmptySchema = void 0;
const qT = Yo, BT = he, HT = mr, zT = {
  message: "boolean schema is false"
};
function GT(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? gg(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(HT.default.data) : (t.assign((0, BT._)`${n}.errors`, null), t.return(!0));
}
Oi.topBoolOrEmptySchema = GT;
function KT(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), gg(e)) : r.var(t, !0);
}
Oi.boolOrEmptySchema = KT;
function gg(e, t) {
  const { gen: r, data: n } = e, i = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, qT.reportError)(i, zT, void 0, t);
}
var Ve = {}, Bn = {};
Object.defineProperty(Bn, "__esModule", { value: !0 });
Bn.getRules = Bn.isJSONType = void 0;
const WT = ["string", "number", "integer", "boolean", "null", "object", "array"], YT = new Set(WT);
function XT(e) {
  return typeof e == "string" && YT.has(e);
}
Bn.isJSONType = XT;
function JT() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
Bn.getRules = JT;
var Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.shouldUseRule = Nr.shouldUseGroup = Nr.schemaHasRulesForType = void 0;
function QT({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && vg(e, n);
}
Nr.schemaHasRulesForType = QT;
function vg(e, t) {
  return t.rules.some((r) => _g(e, r));
}
Nr.shouldUseGroup = vg;
function _g(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
Nr.shouldUseRule = _g;
Object.defineProperty(Ve, "__esModule", { value: !0 });
Ve.reportTypeError = Ve.checkDataTypes = Ve.checkDataType = Ve.coerceAndCheckDataType = Ve.getJSONTypes = Ve.getSchemaTypes = Ve.DataType = void 0;
const ZT = Bn, eO = Nr, tO = Yo, de = he, $g = Q;
var _i;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(_i || (Ve.DataType = _i = {}));
function rO(e) {
  const t = wg(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
Ve.getSchemaTypes = rO;
function wg(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(ZT.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Ve.getJSONTypes = wg;
function nO(e, t) {
  const { gen: r, data: n, opts: i } = e, o = iO(t, i.coerceTypes), a = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, eO.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const s = uf(t, n, i.strictNumbers, _i.Wrong);
    r.if(s, () => {
      o.length ? oO(e, t, o) : ff(e);
    });
  }
  return a;
}
Ve.coerceAndCheckDataType = nO;
const Eg = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function iO(e, t) {
  return t ? e.filter((r) => Eg.has(r) || t === "array" && r === "array") : [];
}
function oO(e, t, r) {
  const { gen: n, data: i, opts: o } = e, a = n.let("dataType", (0, de._)`typeof ${i}`), s = n.let("coerced", (0, de._)`undefined`);
  o.coerceTypes === "array" && n.if((0, de._)`${a} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, de._)`${i}[0]`).assign(a, (0, de._)`typeof ${i}`).if(uf(t, i, o.strictNumbers), () => n.assign(s, i))), n.if((0, de._)`${s} !== undefined`);
  for (const u of r)
    (Eg.has(u) || u === "array" && o.coerceTypes === "array") && c(u);
  n.else(), ff(e), n.endIf(), n.if((0, de._)`${s} !== undefined`, () => {
    n.assign(i, s), aO(e, s);
  });
  function c(u) {
    switch (u) {
      case "string":
        n.elseIf((0, de._)`${a} == "number" || ${a} == "boolean"`).assign(s, (0, de._)`"" + ${i}`).elseIf((0, de._)`${i} === null`).assign(s, (0, de._)`""`);
        return;
      case "number":
        n.elseIf((0, de._)`${a} == "boolean" || ${i} === null
              || (${a} == "string" && ${i} && ${i} == +${i})`).assign(s, (0, de._)`+${i}`);
        return;
      case "integer":
        n.elseIf((0, de._)`${a} === "boolean" || ${i} === null
              || (${a} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(s, (0, de._)`+${i}`);
        return;
      case "boolean":
        n.elseIf((0, de._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(s, !1).elseIf((0, de._)`${i} === "true" || ${i} === 1`).assign(s, !0);
        return;
      case "null":
        n.elseIf((0, de._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(s, null);
        return;
      case "array":
        n.elseIf((0, de._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${i} === null`).assign(s, (0, de._)`[${i}]`);
    }
  }
}
function aO({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, de._)`${t} !== undefined`, () => e.assign((0, de._)`${t}[${r}]`, n));
}
function kl(e, t, r, n = _i.Correct) {
  const i = n === _i.Correct ? de.operators.EQ : de.operators.NEQ;
  let o;
  switch (e) {
    case "null":
      return (0, de._)`${t} ${i} null`;
    case "array":
      o = (0, de._)`Array.isArray(${t})`;
      break;
    case "object":
      o = (0, de._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      o = a((0, de._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      o = a();
      break;
    default:
      return (0, de._)`typeof ${t} ${i} ${e}`;
  }
  return n === _i.Correct ? o : (0, de.not)(o);
  function a(s = de.nil) {
    return (0, de.and)((0, de._)`typeof ${t} == "number"`, s, r ? (0, de._)`isFinite(${t})` : de.nil);
  }
}
Ve.checkDataType = kl;
function uf(e, t, r, n) {
  if (e.length === 1)
    return kl(e[0], t, r, n);
  let i;
  const o = (0, $g.toHash)(e);
  if (o.array && o.object) {
    const a = (0, de._)`typeof ${t} != "object"`;
    i = o.null ? a : (0, de._)`!${t} || ${a}`, delete o.null, delete o.array, delete o.object;
  } else
    i = de.nil;
  o.number && delete o.integer;
  for (const a in o)
    i = (0, de.and)(i, kl(a, t, r, n));
  return i;
}
Ve.checkDataTypes = uf;
const sO = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, de._)`{type: ${e}}` : (0, de._)`{type: ${t}}`
};
function ff(e) {
  const t = cO(e);
  (0, tO.reportError)(t, sO);
}
Ve.reportTypeError = ff;
function cO(e) {
  const { gen: t, data: r, schema: n } = e, i = (0, $g.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: i,
    schemaValue: i,
    parentSchema: n,
    params: {},
    it: e
  };
}
var Hs = {};
Object.defineProperty(Hs, "__esModule", { value: !0 });
Hs.assignDefaults = void 0;
const Qn = he, lO = Q;
function uO(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const i in r)
      Ih(e, i, r[i].default);
  else t === "array" && Array.isArray(n) && n.forEach((i, o) => Ih(e, o, i.default));
}
Hs.assignDefaults = uO;
function Ih(e, t, r) {
  const { gen: n, compositeRule: i, data: o, opts: a } = e;
  if (r === void 0)
    return;
  const s = (0, Qn._)`${o}${(0, Qn.getProperty)(t)}`;
  if (i) {
    (0, lO.checkStrictMode)(e, `default is ignored for: ${s}`);
    return;
  }
  let c = (0, Qn._)`${s} === undefined`;
  a.useDefaults === "empty" && (c = (0, Qn._)`${c} || ${s} === null || ${s} === ""`), n.if(c, (0, Qn._)`${s} = ${(0, Qn.stringify)(r)}`);
}
var hr = {}, me = {};
Object.defineProperty(me, "__esModule", { value: !0 });
me.validateUnion = me.validateArray = me.usePattern = me.callValidateCode = me.schemaProperties = me.allSchemaProperties = me.noPropertyInData = me.propertyInData = me.isOwnProperty = me.hasPropFunc = me.reportMissingProp = me.checkMissingProp = me.checkReportMissingProp = void 0;
const Ne = he, df = Q, zr = mr, fO = Q;
function dO(e, t) {
  const { gen: r, data: n, it: i } = e;
  r.if(pf(r, n, t, i.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Ne._)`${t}` }, !0), e.error();
  });
}
me.checkReportMissingProp = dO;
function hO({ gen: e, data: t, it: { opts: r } }, n, i) {
  return (0, Ne.or)(...n.map((o) => (0, Ne.and)(pf(e, t, o, r.ownProperties), (0, Ne._)`${i} = ${o}`)));
}
me.checkMissingProp = hO;
function pO(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
me.reportMissingProp = pO;
function bg(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Ne._)`Object.prototype.hasOwnProperty`
  });
}
me.hasPropFunc = bg;
function hf(e, t, r) {
  return (0, Ne._)`${bg(e)}.call(${t}, ${r})`;
}
me.isOwnProperty = hf;
function mO(e, t, r, n) {
  const i = (0, Ne._)`${t}${(0, Ne.getProperty)(r)} !== undefined`;
  return n ? (0, Ne._)`${i} && ${hf(e, t, r)}` : i;
}
me.propertyInData = mO;
function pf(e, t, r, n) {
  const i = (0, Ne._)`${t}${(0, Ne.getProperty)(r)} === undefined`;
  return n ? (0, Ne.or)(i, (0, Ne.not)(hf(e, t, r))) : i;
}
me.noPropertyInData = pf;
function Sg(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
me.allSchemaProperties = Sg;
function yO(e, t) {
  return Sg(t).filter((r) => !(0, df.alwaysValidSchema)(e, t[r]));
}
me.schemaProperties = yO;
function gO({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: i, errorPath: o }, it: a }, s, c, u) {
  const l = u ? (0, Ne._)`${e}, ${t}, ${n}${i}` : t, f = [
    [zr.default.instancePath, (0, Ne.strConcat)(zr.default.instancePath, o)],
    [zr.default.parentData, a.parentData],
    [zr.default.parentDataProperty, a.parentDataProperty],
    [zr.default.rootData, zr.default.rootData]
  ];
  a.opts.dynamicRef && f.push([zr.default.dynamicAnchors, zr.default.dynamicAnchors]);
  const h = (0, Ne._)`${l}, ${r.object(...f)}`;
  return c !== Ne.nil ? (0, Ne._)`${s}.call(${c}, ${h})` : (0, Ne._)`${s}(${h})`;
}
me.callValidateCode = gO;
const vO = (0, Ne._)`new RegExp`;
function _O({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: i } = t.code, o = i(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, Ne._)`${i.code === "new RegExp" ? vO : (0, fO.useFunc)(e, i)}(${r}, ${n})`
  });
}
me.usePattern = _O;
function $O(e) {
  const { gen: t, data: r, keyword: n, it: i } = e, o = t.name("valid");
  if (i.allErrors) {
    const s = t.let("valid", !0);
    return a(() => t.assign(s, !1)), s;
  }
  return t.var(o, !0), a(() => t.break()), o;
  function a(s) {
    const c = t.const("len", (0, Ne._)`${r}.length`);
    t.forRange("i", 0, c, (u) => {
      e.subschema({
        keyword: n,
        dataProp: u,
        dataPropType: df.Type.Num
      }, o), t.if((0, Ne.not)(o), s);
    });
  }
}
me.validateArray = $O;
function wO(e) {
  const { gen: t, schema: r, keyword: n, it: i } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, df.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
    return;
  const a = t.let("valid", !1), s = t.name("_valid");
  t.block(() => r.forEach((c, u) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: u,
      compositeRule: !0
    }, s);
    t.assign(a, (0, Ne._)`${a} || ${s}`), e.mergeValidEvaluated(l, s) || t.if((0, Ne.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
me.validateUnion = wO;
Object.defineProperty(hr, "__esModule", { value: !0 });
hr.validateKeywordUsage = hr.validSchemaType = hr.funcKeywordCode = hr.macroKeywordCode = void 0;
const dt = he, Cn = mr, EO = me, bO = Yo;
function SO(e, t) {
  const { gen: r, keyword: n, schema: i, parentSchema: o, it: a } = e, s = t.macro.call(a.self, i, o, a), c = Pg(r, n, s);
  a.opts.validateSchema !== !1 && a.self.validateSchema(s, !0);
  const u = r.name("valid");
  e.subschema({
    schema: s,
    schemaPath: dt.nil,
    errSchemaPath: `${a.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, u), e.pass(u, () => e.error(!0));
}
hr.macroKeywordCode = SO;
function PO(e, t) {
  var r;
  const { gen: n, keyword: i, schema: o, parentSchema: a, $data: s, it: c } = e;
  OO(c, t);
  const u = !s && t.compile ? t.compile.call(c.self, o, a, c) : t.validate, l = Pg(n, i, u), f = n.let("valid");
  e.block$data(f, h), e.ok((r = t.valid) !== null && r !== void 0 ? r : f);
  function h() {
    if (t.errors === !1)
      $(), t.modifying && Ch(e), v(() => e.error());
    else {
      const y = t.async ? p() : g();
      t.modifying && Ch(e), v(() => TO(e, y));
    }
  }
  function p() {
    const y = n.let("ruleErrs", null);
    return n.try(() => $((0, dt._)`await `), (E) => n.assign(f, !1).if((0, dt._)`${E} instanceof ${c.ValidationError}`, () => n.assign(y, (0, dt._)`${E}.errors`), () => n.throw(E))), y;
  }
  function g() {
    const y = (0, dt._)`${l}.errors`;
    return n.assign(y, null), $(dt.nil), y;
  }
  function $(y = t.async ? (0, dt._)`await ` : dt.nil) {
    const E = c.opts.passContext ? Cn.default.this : Cn.default.self, A = !("compile" in t && !s || t.schema === !1);
    n.assign(f, (0, dt._)`${y}${(0, EO.callValidateCode)(e, l, E, A)}`, t.modifying);
  }
  function v(y) {
    var E;
    n.if((0, dt.not)((E = t.valid) !== null && E !== void 0 ? E : f), y);
  }
}
hr.funcKeywordCode = PO;
function Ch(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, dt._)`${n.parentData}[${n.parentDataProperty}]`));
}
function TO(e, t) {
  const { gen: r } = e;
  r.if((0, dt._)`Array.isArray(${t})`, () => {
    r.assign(Cn.default.vErrors, (0, dt._)`${Cn.default.vErrors} === null ? ${t} : ${Cn.default.vErrors}.concat(${t})`).assign(Cn.default.errors, (0, dt._)`${Cn.default.vErrors}.length`), (0, bO.extendErrors)(e);
  }, () => e.error());
}
function OO({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Pg(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, dt.stringify)(r) });
}
function AO(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
hr.validSchemaType = AO;
function NO({ schema: e, opts: t, self: r, errSchemaPath: n }, i, o) {
  if (Array.isArray(i.keyword) ? !i.keyword.includes(o) : i.keyword !== o)
    throw new Error("ajv implementation error");
  const a = i.dependencies;
  if (a != null && a.some((s) => !Object.prototype.hasOwnProperty.call(e, s)))
    throw new Error(`parent schema must have dependencies of ${o}: ${a.join(",")}`);
  if (i.validateSchema && !i.validateSchema(e[o])) {
    const c = `keyword "${o}" value is invalid at path "${n}": ` + r.errorsText(i.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
hr.validateKeywordUsage = NO;
var sn = {};
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.extendSubschemaMode = sn.extendSubschemaData = sn.getSubschema = void 0;
const ur = he, Tg = Q;
function IO(e, { keyword: t, schemaProp: r, schema: n, schemaPath: i, errSchemaPath: o, topSchemaRef: a }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const s = e.schema[t];
    return r === void 0 ? {
      schema: s,
      schemaPath: (0, ur._)`${e.schemaPath}${(0, ur.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: s[r],
      schemaPath: (0, ur._)`${e.schemaPath}${(0, ur.getProperty)(t)}${(0, ur.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Tg.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (i === void 0 || o === void 0 || a === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: i,
      topSchemaRef: a,
      errSchemaPath: o
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
sn.getSubschema = IO;
function CO(e, t, { dataProp: r, dataPropType: n, data: i, dataTypes: o, propertyName: a }) {
  if (i !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: s } = t;
  if (r !== void 0) {
    const { errorPath: u, dataPathArr: l, opts: f } = t, h = s.let("data", (0, ur._)`${t.data}${(0, ur.getProperty)(r)}`, !0);
    c(h), e.errorPath = (0, ur.str)`${u}${(0, Tg.getErrorPath)(r, n, f.jsPropertySyntax)}`, e.parentDataProperty = (0, ur._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (i !== void 0) {
    const u = i instanceof ur.Name ? i : s.let("data", i, !0);
    c(u), a !== void 0 && (e.propertyName = a);
  }
  o && (e.dataTypes = o);
  function c(u) {
    e.data = u, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, u];
  }
}
sn.extendSubschemaData = CO;
function RO(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: i, allErrors: o }) {
  n !== void 0 && (e.compositeRule = n), i !== void 0 && (e.createErrors = i), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
sn.extendSubschemaMode = RO;
var Je = {}, Og = { exports: {} }, rn = Og.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, i = r.post || function() {
  };
  Za(t, n, i, e, "", e);
};
rn.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
rn.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
rn.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
rn.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Za(e, t, r, n, i, o, a, s, c, u) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, i, o, a, s, c, u);
    for (var l in n) {
      var f = n[l];
      if (Array.isArray(f)) {
        if (l in rn.arrayKeywords)
          for (var h = 0; h < f.length; h++)
            Za(e, t, r, f[h], i + "/" + l + "/" + h, o, i, l, n, h);
      } else if (l in rn.propsKeywords) {
        if (f && typeof f == "object")
          for (var p in f)
            Za(e, t, r, f[p], i + "/" + l + "/" + DO(p), o, i, l, n, p);
      } else (l in rn.keywords || e.allKeys && !(l in rn.skipKeywords)) && Za(e, t, r, f, i + "/" + l, o, i, l, n);
    }
    r(n, i, o, a, s, c, u);
  }
}
function DO(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var kO = Og.exports;
Object.defineProperty(Je, "__esModule", { value: !0 });
Je.getSchemaRefs = Je.resolveUrl = Je.normalizeId = Je._getFullPath = Je.getFullPath = Je.inlineRef = void 0;
const jO = Q, FO = Ls, LO = kO, UO = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function MO(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !jl(e) : t ? Ag(e) <= t : !1;
}
Je.inlineRef = MO;
const xO = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function jl(e) {
  for (const t in e) {
    if (xO.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(jl) || typeof r == "object" && jl(r))
      return !0;
  }
  return !1;
}
function Ag(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !UO.has(r) && (typeof e[r] == "object" && (0, jO.eachItem)(e[r], (n) => t += Ag(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Ng(e, t = "", r) {
  r !== !1 && (t = $i(t));
  const n = e.parse(t);
  return Ig(e, n);
}
Je.getFullPath = Ng;
function Ig(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Je._getFullPath = Ig;
const VO = /#\/?$/;
function $i(e) {
  return e ? e.replace(VO, "") : "";
}
Je.normalizeId = $i;
function qO(e, t, r) {
  return r = $i(r), e.resolve(t, r);
}
Je.resolveUrl = qO;
const BO = /^[a-z_][-a-z0-9._]*$/i;
function HO(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, i = $i(e[r] || t), o = { "": i }, a = Ng(n, i, !1), s = {}, c = /* @__PURE__ */ new Set();
  return LO(e, { allKeys: !0 }, (f, h, p, g) => {
    if (g === void 0)
      return;
    const $ = a + h;
    let v = o[g];
    typeof f[r] == "string" && (v = y.call(this, f[r])), E.call(this, f.$anchor), E.call(this, f.$dynamicAnchor), o[h] = v;
    function y(A) {
      const C = this.opts.uriResolver.resolve;
      if (A = $i(v ? C(v, A) : A), c.has(A))
        throw l(A);
      c.add(A);
      let D = this.refs[A];
      return typeof D == "string" && (D = this.refs[D]), typeof D == "object" ? u(f, D.schema, A) : A !== $i($) && (A[0] === "#" ? (u(f, s[A], A), s[A] = f) : this.refs[A] = $), A;
    }
    function E(A) {
      if (typeof A == "string") {
        if (!BO.test(A))
          throw new Error(`invalid anchor "${A}"`);
        y.call(this, `#${A}`);
      }
    }
  }), s;
  function u(f, h, p) {
    if (h !== void 0 && !FO(f, h))
      throw l(p);
  }
  function l(f) {
    return new Error(`reference "${f}" resolves to more than one schema`);
  }
}
Je.getSchemaRefs = HO;
Object.defineProperty(rr, "__esModule", { value: !0 });
rr.getData = rr.KeywordCxt = rr.validateFunctionCode = void 0;
const Cg = Oi, Rh = Ve, mf = Nr, ms = Ve, zO = Hs, _o = hr, Dc = sn, te = he, ae = mr, GO = Je, Ir = Q, Zi = Yo;
function KO(e) {
  if (kg(e) && (jg(e), Dg(e))) {
    XO(e);
    return;
  }
  Rg(e, () => (0, Cg.topBoolOrEmptySchema)(e));
}
rr.validateFunctionCode = KO;
function Rg({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: i }, o) {
  i.code.es5 ? e.func(t, (0, te._)`${ae.default.data}, ${ae.default.valCxt}`, n.$async, () => {
    e.code((0, te._)`"use strict"; ${Dh(r, i)}`), YO(e, i), e.code(o);
  }) : e.func(t, (0, te._)`${ae.default.data}, ${WO(i)}`, n.$async, () => e.code(Dh(r, i)).code(o));
}
function WO(e) {
  return (0, te._)`{${ae.default.instancePath}="", ${ae.default.parentData}, ${ae.default.parentDataProperty}, ${ae.default.rootData}=${ae.default.data}${e.dynamicRef ? (0, te._)`, ${ae.default.dynamicAnchors}={}` : te.nil}}={}`;
}
function YO(e, t) {
  e.if(ae.default.valCxt, () => {
    e.var(ae.default.instancePath, (0, te._)`${ae.default.valCxt}.${ae.default.instancePath}`), e.var(ae.default.parentData, (0, te._)`${ae.default.valCxt}.${ae.default.parentData}`), e.var(ae.default.parentDataProperty, (0, te._)`${ae.default.valCxt}.${ae.default.parentDataProperty}`), e.var(ae.default.rootData, (0, te._)`${ae.default.valCxt}.${ae.default.rootData}`), t.dynamicRef && e.var(ae.default.dynamicAnchors, (0, te._)`${ae.default.valCxt}.${ae.default.dynamicAnchors}`);
  }, () => {
    e.var(ae.default.instancePath, (0, te._)`""`), e.var(ae.default.parentData, (0, te._)`undefined`), e.var(ae.default.parentDataProperty, (0, te._)`undefined`), e.var(ae.default.rootData, ae.default.data), t.dynamicRef && e.var(ae.default.dynamicAnchors, (0, te._)`{}`);
  });
}
function XO(e) {
  const { schema: t, opts: r, gen: n } = e;
  Rg(e, () => {
    r.$comment && t.$comment && Lg(e), tA(e), n.let(ae.default.vErrors, null), n.let(ae.default.errors, 0), r.unevaluated && JO(e), Fg(e), iA(e);
  });
}
function JO(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, te._)`${r}.evaluated`), t.if((0, te._)`${e.evaluated}.dynamicProps`, () => t.assign((0, te._)`${e.evaluated}.props`, (0, te._)`undefined`)), t.if((0, te._)`${e.evaluated}.dynamicItems`, () => t.assign((0, te._)`${e.evaluated}.items`, (0, te._)`undefined`));
}
function Dh(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, te._)`/*# sourceURL=${r} */` : te.nil;
}
function QO(e, t) {
  if (kg(e) && (jg(e), Dg(e))) {
    ZO(e, t);
    return;
  }
  (0, Cg.boolOrEmptySchema)(e, t);
}
function Dg({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function kg(e) {
  return typeof e.schema != "boolean";
}
function ZO(e, t) {
  const { schema: r, gen: n, opts: i } = e;
  i.$comment && r.$comment && Lg(e), rA(e), nA(e);
  const o = n.const("_errs", ae.default.errors);
  Fg(e, o), n.var(t, (0, te._)`${o} === ${ae.default.errors}`);
}
function jg(e) {
  (0, Ir.checkUnknownRules)(e), eA(e);
}
function Fg(e, t) {
  if (e.opts.jtd)
    return kh(e, [], !1, t);
  const r = (0, Rh.getSchemaTypes)(e.schema), n = (0, Rh.coerceAndCheckDataType)(e, r);
  kh(e, r, !n, t);
}
function eA(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: i } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Ir.schemaHasRulesButRef)(t, i.RULES) && i.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function tA(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Ir.checkStrictMode)(e, "default is ignored in the schema root");
}
function rA(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, GO.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function nA(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Lg({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: i }) {
  const o = r.$comment;
  if (i.$comment === !0)
    e.code((0, te._)`${ae.default.self}.logger.log(${o})`);
  else if (typeof i.$comment == "function") {
    const a = (0, te.str)`${n}/$comment`, s = e.scopeValue("root", { ref: t.root });
    e.code((0, te._)`${ae.default.self}.opts.$comment(${o}, ${a}, ${s}.schema)`);
  }
}
function iA(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: i, opts: o } = e;
  r.$async ? t.if((0, te._)`${ae.default.errors} === 0`, () => t.return(ae.default.data), () => t.throw((0, te._)`new ${i}(${ae.default.vErrors})`)) : (t.assign((0, te._)`${n}.errors`, ae.default.vErrors), o.unevaluated && oA(e), t.return((0, te._)`${ae.default.errors} === 0`));
}
function oA({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof te.Name && e.assign((0, te._)`${t}.props`, r), n instanceof te.Name && e.assign((0, te._)`${t}.items`, n);
}
function kh(e, t, r, n) {
  const { gen: i, schema: o, data: a, allErrors: s, opts: c, self: u } = e, { RULES: l } = u;
  if (o.$ref && (c.ignoreKeywordsWithRef || !(0, Ir.schemaHasRulesButRef)(o, l))) {
    i.block(() => xg(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || aA(e, t), i.block(() => {
    for (const h of l.rules)
      f(h);
    f(l.post);
  });
  function f(h) {
    (0, mf.shouldUseGroup)(o, h) && (h.type ? (i.if((0, ms.checkDataType)(h.type, a, c.strictNumbers)), jh(e, h), t.length === 1 && t[0] === h.type && r && (i.else(), (0, ms.reportTypeError)(e)), i.endIf()) : jh(e, h), s || i.if((0, te._)`${ae.default.errors} === ${n || 0}`));
  }
}
function jh(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: i } } = e;
  i && (0, zO.assignDefaults)(e, t.type), r.block(() => {
    for (const o of t.rules)
      (0, mf.shouldUseRule)(n, o) && xg(e, o.keyword, o.definition, t.type);
  });
}
function aA(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (sA(e, t), e.opts.allowUnionTypes || cA(e, t), lA(e, e.dataTypes));
}
function sA(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Ug(e.dataTypes, r) || yf(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), fA(e, t);
  }
}
function cA(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && yf(e, "use allowUnionTypes to allow union type keyword");
}
function lA(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const i = r[n];
    if (typeof i == "object" && (0, mf.shouldUseRule)(e.schema, i)) {
      const { type: o } = i.definition;
      o.length && !o.some((a) => uA(t, a)) && yf(e, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function uA(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Ug(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function fA(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Ug(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function yf(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, Ir.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Mg {
  constructor(t, r, n) {
    if ((0, _o.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Ir.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Vg(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, _o.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", ae.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, te.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, te.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, te._)`${r} !== undefined && (${(0, te.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Zi.reportExtraError : Zi.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Zi.reportError)(this, this.def.$dataError || Zi.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Zi.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = te.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = te.nil, r = te.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: i, schemaType: o, def: a } = this;
    n.if((0, te.or)((0, te._)`${i} === undefined`, r)), t !== te.nil && n.assign(t, !0), (o.length || a.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== te.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: i, it: o } = this;
    return (0, te.or)(a(), s());
    function a() {
      if (n.length) {
        if (!(r instanceof te.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, te._)`${(0, ms.checkDataTypes)(c, r, o.opts.strictNumbers, ms.DataType.Wrong)}`;
      }
      return te.nil;
    }
    function s() {
      if (i.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: i.validateSchema });
        return (0, te._)`!${c}(${r})`;
      }
      return te.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Dc.getSubschema)(this.it, t);
    (0, Dc.extendSubschemaData)(n, this.it, t), (0, Dc.extendSubschemaMode)(n, t);
    const i = { ...this.it, ...n, items: void 0, props: void 0 };
    return QO(i, r), i;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: i } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = Ir.mergeEvaluated.props(i, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = Ir.mergeEvaluated.items(i, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: i } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return i.if(r, () => this.mergeEvaluated(t, te.Name)), !0;
  }
}
rr.KeywordCxt = Mg;
function xg(e, t, r, n) {
  const i = new Mg(e, r, t);
  "code" in r ? r.code(i, n) : i.$data && r.validate ? (0, _o.funcKeywordCode)(i, r) : "macro" in r ? (0, _o.macroKeywordCode)(i, r) : (r.compile || r.validate) && (0, _o.funcKeywordCode)(i, r);
}
const dA = /^\/(?:[^~]|~0|~1)*$/, hA = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Vg(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let i, o;
  if (e === "")
    return ae.default.rootData;
  if (e[0] === "/") {
    if (!dA.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    i = e, o = ae.default.rootData;
  } else {
    const u = hA.exec(e);
    if (!u)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +u[1];
    if (i = u[2], i === "#") {
      if (l >= t)
        throw new Error(c("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(c("data", l));
    if (o = r[t - l], !i)
      return o;
  }
  let a = o;
  const s = i.split("/");
  for (const u of s)
    u && (o = (0, te._)`${o}${(0, te.getProperty)((0, Ir.unescapeJsonPointer)(u))}`, a = (0, te._)`${a} && ${o}`);
  return a;
  function c(u, l) {
    return `Cannot access ${u} ${l} levels up, current level is ${t}`;
  }
}
rr.getData = Vg;
var Xo = {};
Object.defineProperty(Xo, "__esModule", { value: !0 });
class pA extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
Xo.default = pA;
var Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
const kc = Je;
class mA extends Error {
  constructor(t, r, n, i) {
    super(i || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, kc.resolveUrl)(t, r, n), this.missingSchema = (0, kc.normalizeId)((0, kc.getFullPath)(t, this.missingRef));
  }
}
Mi.default = mA;
var Pt = {};
Object.defineProperty(Pt, "__esModule", { value: !0 });
Pt.resolveSchema = Pt.getCompilingSchema = Pt.resolveRef = Pt.compileSchema = Pt.SchemaEnv = void 0;
const Gt = he, yA = Xo, bn = mr, er = Je, Fh = Q, gA = rr;
class zs {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, er.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Pt.SchemaEnv = zs;
function gf(e) {
  const t = qg.call(this, e);
  if (t)
    return t;
  const r = (0, er.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: i } = this.opts.code, { ownProperties: o } = this.opts, a = new Gt.CodeGen(this.scope, { es5: n, lines: i, ownProperties: o });
  let s;
  e.$async && (s = a.scopeValue("Error", {
    ref: yA.default,
    code: (0, Gt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = a.scopeName("validate");
  e.validateName = c;
  const u = {
    gen: a,
    allErrors: this.opts.allErrors,
    data: bn.default.data,
    parentData: bn.default.parentData,
    parentDataProperty: bn.default.parentDataProperty,
    dataNames: [bn.default.data],
    dataPathArr: [Gt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: a.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Gt.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: s,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Gt.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Gt._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, gA.validateFunctionCode)(u), a.optimize(this.opts.code.optimize);
    const f = a.toString();
    l = `${a.scopeRefs(bn.default.scope)}return ${f}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const p = new Function(`${bn.default.self}`, `${bn.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: p }), p.errors = null, p.schema = e.schema, p.schemaEnv = e, e.$async && (p.$async = !0), this.opts.code.source === !0 && (p.source = { validateName: c, validateCode: f, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: g, items: $ } = u;
      p.evaluated = {
        props: g instanceof Gt.Name ? void 0 : g,
        items: $ instanceof Gt.Name ? void 0 : $,
        dynamicProps: g instanceof Gt.Name,
        dynamicItems: $ instanceof Gt.Name
      }, p.source && (p.source.evaluated = (0, Gt.stringify)(p.evaluated));
    }
    return e.validate = p, e;
  } catch (f) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), f;
  } finally {
    this._compilations.delete(e);
  }
}
Pt.compileSchema = gf;
function vA(e, t, r) {
  var n;
  r = (0, er.resolveUrl)(this.opts.uriResolver, t, r);
  const i = e.refs[r];
  if (i)
    return i;
  let o = wA.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: s } = this.opts;
    a && (o = new zs({ schema: a, schemaId: s, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = _A.call(this, o);
}
Pt.resolveRef = vA;
function _A(e) {
  return (0, er.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : gf.call(this, e);
}
function qg(e) {
  for (const t of this._compilations)
    if ($A(t, e))
      return t;
}
Pt.getCompilingSchema = qg;
function $A(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function wA(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Gs.call(this, e, t);
}
function Gs(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, er._getFullPath)(this.opts.uriResolver, r);
  let i = (0, er.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === i)
    return jc.call(this, r, e);
  const o = (0, er.normalizeId)(n), a = this.refs[o] || this.schemas[o];
  if (typeof a == "string") {
    const s = Gs.call(this, e, a);
    return typeof (s == null ? void 0 : s.schema) != "object" ? void 0 : jc.call(this, r, s);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || gf.call(this, a), o === (0, er.normalizeId)(t)) {
      const { schema: s } = a, { schemaId: c } = this.opts, u = s[c];
      return u && (i = (0, er.resolveUrl)(this.opts.uriResolver, i, u)), new zs({ schema: s, schemaId: c, root: e, baseId: i });
    }
    return jc.call(this, r, a);
  }
}
Pt.resolveSchema = Gs;
const EA = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function jc(e, { baseId: t, schema: r, root: n }) {
  var i;
  if (((i = e.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const s of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Fh.unescapeFragment)(s)];
    if (c === void 0)
      return;
    r = c;
    const u = typeof r == "object" && r[this.opts.schemaId];
    !EA.has(s) && u && (t = (0, er.resolveUrl)(this.opts.uriResolver, t, u));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, Fh.schemaHasRulesButRef)(r, this.RULES)) {
    const s = (0, er.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = Gs.call(this, n, s);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new zs({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const bA = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", SA = "Meta-schema for $data reference (JSON AnySchema extension proposal)", PA = "object", TA = [
  "$data"
], OA = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, AA = !1, NA = {
  $id: bA,
  description: SA,
  type: PA,
  required: TA,
  properties: OA,
  additionalProperties: AA
};
var vf = {};
Object.defineProperty(vf, "__esModule", { value: !0 });
const Bg = Qy;
Bg.code = 'require("ajv/dist/runtime/uri").default';
vf.default = Bg;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = rr;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = he;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = Xo, i = Mi, o = Bn, a = Pt, s = he, c = Je, u = Ve, l = Q, f = NA, h = vf, p = (R, b) => new RegExp(R, b);
  p.code = "new RegExp";
  const g = ["removeAdditional", "useDefaults", "coerceTypes"], $ = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), v = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, y = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, E = 200;
  function A(R) {
    var b, O, S, d, m, P, w, _, k, I, Y, ne, ye, _e, $e, Ce, ve, Fe, Bt, kt, At, jt, gr, vr, _r;
    const Nt = R.strict, Ft = (b = R.code) === null || b === void 0 ? void 0 : b.optimize, $r = Ft === !0 || Ft === void 0 ? 1 : Ft || 0, Fr = (S = (O = R.code) === null || O === void 0 ? void 0 : O.regExp) !== null && S !== void 0 ? S : p, wt = (d = R.uriResolver) !== null && d !== void 0 ? d : h.default;
    return {
      strictSchema: (P = (m = R.strictSchema) !== null && m !== void 0 ? m : Nt) !== null && P !== void 0 ? P : !0,
      strictNumbers: (_ = (w = R.strictNumbers) !== null && w !== void 0 ? w : Nt) !== null && _ !== void 0 ? _ : !0,
      strictTypes: (I = (k = R.strictTypes) !== null && k !== void 0 ? k : Nt) !== null && I !== void 0 ? I : "log",
      strictTuples: (ne = (Y = R.strictTuples) !== null && Y !== void 0 ? Y : Nt) !== null && ne !== void 0 ? ne : "log",
      strictRequired: (_e = (ye = R.strictRequired) !== null && ye !== void 0 ? ye : Nt) !== null && _e !== void 0 ? _e : !1,
      code: R.code ? { ...R.code, optimize: $r, regExp: Fr } : { optimize: $r, regExp: Fr },
      loopRequired: ($e = R.loopRequired) !== null && $e !== void 0 ? $e : E,
      loopEnum: (Ce = R.loopEnum) !== null && Ce !== void 0 ? Ce : E,
      meta: (ve = R.meta) !== null && ve !== void 0 ? ve : !0,
      messages: (Fe = R.messages) !== null && Fe !== void 0 ? Fe : !0,
      inlineRefs: (Bt = R.inlineRefs) !== null && Bt !== void 0 ? Bt : !0,
      schemaId: (kt = R.schemaId) !== null && kt !== void 0 ? kt : "$id",
      addUsedSchema: (At = R.addUsedSchema) !== null && At !== void 0 ? At : !0,
      validateSchema: (jt = R.validateSchema) !== null && jt !== void 0 ? jt : !0,
      validateFormats: (gr = R.validateFormats) !== null && gr !== void 0 ? gr : !0,
      unicodeRegExp: (vr = R.unicodeRegExp) !== null && vr !== void 0 ? vr : !0,
      int32range: (_r = R.int32range) !== null && _r !== void 0 ? _r : !0,
      uriResolver: wt
    };
  }
  class C {
    constructor(b = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), b = this.opts = { ...b, ...A(b) };
      const { es5: O, lines: S } = this.opts.code;
      this.scope = new s.ValueScope({ scope: {}, prefixes: $, es5: O, lines: S }), this.logger = x(b.logger);
      const d = b.validateFormats;
      b.validateFormats = !1, this.RULES = (0, o.getRules)(), D.call(this, v, b, "NOT SUPPORTED"), D.call(this, y, b, "DEPRECATED", "warn"), this._metaOpts = W.call(this), b.formats && G.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), b.keywords && N.call(this, b.keywords), typeof b.meta == "object" && this.addMetaSchema(b.meta), z.call(this), b.validateFormats = d;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: b, meta: O, schemaId: S } = this.opts;
      let d = f;
      S === "id" && (d = { ...f }, d.id = d.$id, delete d.$id), O && b && this.addMetaSchema(d, d[S], !1);
    }
    defaultMeta() {
      const { meta: b, schemaId: O } = this.opts;
      return this.opts.defaultMeta = typeof b == "object" ? b[O] || b : void 0;
    }
    validate(b, O) {
      let S;
      if (typeof b == "string") {
        if (S = this.getSchema(b), !S)
          throw new Error(`no schema with key or ref "${b}"`);
      } else
        S = this.compile(b);
      const d = S(O);
      return "$async" in S || (this.errors = S.errors), d;
    }
    compile(b, O) {
      const S = this._addSchema(b, O);
      return S.validate || this._compileSchemaEnv(S);
    }
    compileAsync(b, O) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: S } = this.opts;
      return d.call(this, b, O);
      async function d(I, Y) {
        await m.call(this, I.$schema);
        const ne = this._addSchema(I, Y);
        return ne.validate || P.call(this, ne);
      }
      async function m(I) {
        I && !this.getSchema(I) && await d.call(this, { $ref: I }, !0);
      }
      async function P(I) {
        try {
          return this._compileSchemaEnv(I);
        } catch (Y) {
          if (!(Y instanceof i.default))
            throw Y;
          return w.call(this, Y), await _.call(this, Y.missingSchema), P.call(this, I);
        }
      }
      function w({ missingSchema: I, missingRef: Y }) {
        if (this.refs[I])
          throw new Error(`AnySchema ${I} is loaded but ${Y} cannot be resolved`);
      }
      async function _(I) {
        const Y = await k.call(this, I);
        this.refs[I] || await m.call(this, Y.$schema), this.refs[I] || this.addSchema(Y, I, O);
      }
      async function k(I) {
        const Y = this._loading[I];
        if (Y)
          return Y;
        try {
          return await (this._loading[I] = S(I));
        } finally {
          delete this._loading[I];
        }
      }
    }
    // Adds schema to the instance
    addSchema(b, O, S, d = this.opts.validateSchema) {
      if (Array.isArray(b)) {
        for (const P of b)
          this.addSchema(P, void 0, S, d);
        return this;
      }
      let m;
      if (typeof b == "object") {
        const { schemaId: P } = this.opts;
        if (m = b[P], m !== void 0 && typeof m != "string")
          throw new Error(`schema ${P} must be string`);
      }
      return O = (0, c.normalizeId)(O || m), this._checkUnique(O), this.schemas[O] = this._addSchema(b, S, O, d, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(b, O, S = this.opts.validateSchema) {
      return this.addSchema(b, O, !0, S), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(b, O) {
      if (typeof b == "boolean")
        return !0;
      let S;
      if (S = b.$schema, S !== void 0 && typeof S != "string")
        throw new Error("$schema must be a string");
      if (S = S || this.opts.defaultMeta || this.defaultMeta(), !S)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const d = this.validate(S, b);
      if (!d && O) {
        const m = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(m);
        else
          throw new Error(m);
      }
      return d;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(b) {
      let O;
      for (; typeof (O = V.call(this, b)) == "string"; )
        b = O;
      if (O === void 0) {
        const { schemaId: S } = this.opts, d = new a.SchemaEnv({ schema: {}, schemaId: S });
        if (O = a.resolveSchema.call(this, d, b), !O)
          return;
        this.refs[b] = O;
      }
      return O.validate || this._compileSchemaEnv(O);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(b) {
      if (b instanceof RegExp)
        return this._removeAllSchemas(this.schemas, b), this._removeAllSchemas(this.refs, b), this;
      switch (typeof b) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const O = V.call(this, b);
          return typeof O == "object" && this._cache.delete(O.schema), delete this.schemas[b], delete this.refs[b], this;
        }
        case "object": {
          const O = b;
          this._cache.delete(O);
          let S = b[this.opts.schemaId];
          return S && (S = (0, c.normalizeId)(S), delete this.schemas[S], delete this.refs[S]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(b) {
      for (const O of b)
        this.addKeyword(O);
      return this;
    }
    addKeyword(b, O) {
      let S;
      if (typeof b == "string")
        S = b, typeof O == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), O.keyword = S);
      else if (typeof b == "object" && O === void 0) {
        if (O = b, S = O.keyword, Array.isArray(S) && !S.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (F.call(this, S, O), !O)
        return (0, l.eachItem)(S, (m) => L.call(this, m)), this;
      U.call(this, O);
      const d = {
        ...O,
        type: (0, u.getJSONTypes)(O.type),
        schemaType: (0, u.getJSONTypes)(O.schemaType)
      };
      return (0, l.eachItem)(S, d.type.length === 0 ? (m) => L.call(this, m, d) : (m) => d.type.forEach((P) => L.call(this, m, d, P))), this;
    }
    getKeyword(b) {
      const O = this.RULES.all[b];
      return typeof O == "object" ? O.definition : !!O;
    }
    // Remove keyword
    removeKeyword(b) {
      const { RULES: O } = this;
      delete O.keywords[b], delete O.all[b];
      for (const S of O.rules) {
        const d = S.rules.findIndex((m) => m.keyword === b);
        d >= 0 && S.rules.splice(d, 1);
      }
      return this;
    }
    // Add format
    addFormat(b, O) {
      return typeof O == "string" && (O = new RegExp(O)), this.formats[b] = O, this;
    }
    errorsText(b = this.errors, { separator: O = ", ", dataVar: S = "data" } = {}) {
      return !b || b.length === 0 ? "No errors" : b.map((d) => `${S}${d.instancePath} ${d.message}`).reduce((d, m) => d + O + m);
    }
    $dataMetaSchema(b, O) {
      const S = this.RULES.all;
      b = JSON.parse(JSON.stringify(b));
      for (const d of O) {
        const m = d.split("/").slice(1);
        let P = b;
        for (const w of m)
          P = P[w];
        for (const w in S) {
          const _ = S[w];
          if (typeof _ != "object")
            continue;
          const { $data: k } = _.definition, I = P[w];
          k && I && (P[w] = B(I));
        }
      }
      return b;
    }
    _removeAllSchemas(b, O) {
      for (const S in b) {
        const d = b[S];
        (!O || O.test(S)) && (typeof d == "string" ? delete b[S] : d && !d.meta && (this._cache.delete(d.schema), delete b[S]));
      }
    }
    _addSchema(b, O, S, d = this.opts.validateSchema, m = this.opts.addUsedSchema) {
      let P;
      const { schemaId: w } = this.opts;
      if (typeof b == "object")
        P = b[w];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof b != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let _ = this._cache.get(b);
      if (_ !== void 0)
        return _;
      S = (0, c.normalizeId)(P || S);
      const k = c.getSchemaRefs.call(this, b, S);
      return _ = new a.SchemaEnv({ schema: b, schemaId: w, meta: O, baseId: S, localRefs: k }), this._cache.set(_.schema, _), m && !S.startsWith("#") && (S && this._checkUnique(S), this.refs[S] = _), d && this.validateSchema(b, !0), _;
    }
    _checkUnique(b) {
      if (this.schemas[b] || this.refs[b])
        throw new Error(`schema with key or id "${b}" already exists`);
    }
    _compileSchemaEnv(b) {
      if (b.meta ? this._compileMetaSchema(b) : a.compileSchema.call(this, b), !b.validate)
        throw new Error("ajv implementation error");
      return b.validate;
    }
    _compileMetaSchema(b) {
      const O = this.opts;
      this.opts = this._metaOpts;
      try {
        a.compileSchema.call(this, b);
      } finally {
        this.opts = O;
      }
    }
  }
  C.ValidationError = n.default, C.MissingRefError = i.default, e.default = C;
  function D(R, b, O, S = "error") {
    for (const d in R) {
      const m = d;
      m in b && this.logger[S](`${O}: option ${d}. ${R[m]}`);
    }
  }
  function V(R) {
    return R = (0, c.normalizeId)(R), this.schemas[R] || this.refs[R];
  }
  function z() {
    const R = this.opts.schemas;
    if (R)
      if (Array.isArray(R))
        this.addSchema(R);
      else
        for (const b in R)
          this.addSchema(R[b], b);
  }
  function G() {
    for (const R in this.opts.formats) {
      const b = this.opts.formats[R];
      b && this.addFormat(R, b);
    }
  }
  function N(R) {
    if (Array.isArray(R)) {
      this.addVocabulary(R);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const b in R) {
      const O = R[b];
      O.keyword || (O.keyword = b), this.addKeyword(O);
    }
  }
  function W() {
    const R = { ...this.opts };
    for (const b of g)
      delete R[b];
    return R;
  }
  const M = { log() {
  }, warn() {
  }, error() {
  } };
  function x(R) {
    if (R === !1)
      return M;
    if (R === void 0)
      return console;
    if (R.log && R.warn && R.error)
      return R;
    throw new Error("logger must implement log, warn and error methods");
  }
  const J = /^[a-z_$][a-z0-9_$:-]*$/i;
  function F(R, b) {
    const { RULES: O } = this;
    if ((0, l.eachItem)(R, (S) => {
      if (O.keywords[S])
        throw new Error(`Keyword ${S} is already defined`);
      if (!J.test(S))
        throw new Error(`Keyword ${S} has invalid name`);
    }), !!b && b.$data && !("code" in b || "validate" in b))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function L(R, b, O) {
    var S;
    const d = b == null ? void 0 : b.post;
    if (O && d)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: m } = this;
    let P = d ? m.post : m.rules.find(({ type: _ }) => _ === O);
    if (P || (P = { type: O, rules: [] }, m.rules.push(P)), m.keywords[R] = !0, !b)
      return;
    const w = {
      keyword: R,
      definition: {
        ...b,
        type: (0, u.getJSONTypes)(b.type),
        schemaType: (0, u.getJSONTypes)(b.schemaType)
      }
    };
    b.before ? H.call(this, P, w, b.before) : P.rules.push(w), m.all[R] = w, (S = b.implements) === null || S === void 0 || S.forEach((_) => this.addKeyword(_));
  }
  function H(R, b, O) {
    const S = R.rules.findIndex((d) => d.keyword === O);
    S >= 0 ? R.rules.splice(S, 0, b) : (R.rules.push(b), this.logger.warn(`rule ${O} is not defined`));
  }
  function U(R) {
    let { metaSchema: b } = R;
    b !== void 0 && (R.$data && this.opts.$data && (b = B(b)), R.validateSchema = this.compile(b, !0));
  }
  const K = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function B(R) {
    return { anyOf: [R, K] };
  }
})(fg);
var _f = {}, $f = {}, wf = {};
Object.defineProperty(wf, "__esModule", { value: !0 });
const IA = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
wf.default = IA;
var Hn = {};
Object.defineProperty(Hn, "__esModule", { value: !0 });
Hn.callRef = Hn.getValidate = void 0;
const CA = Mi, Lh = me, St = he, Zn = mr, Uh = Pt, ba = Q, RA = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: i, schemaEnv: o, validateName: a, opts: s, self: c } = n, { root: u } = o;
    if ((r === "#" || r === "#/") && i === u.baseId)
      return f();
    const l = Uh.resolveRef.call(c, u, i, r);
    if (l === void 0)
      throw new CA.default(n.opts.uriResolver, i, r);
    if (l instanceof Uh.SchemaEnv)
      return h(l);
    return p(l);
    function f() {
      if (o === u)
        return es(e, a, o, o.$async);
      const g = t.scopeValue("root", { ref: u });
      return es(e, (0, St._)`${g}.validate`, u, u.$async);
    }
    function h(g) {
      const $ = Hg(e, g);
      es(e, $, g, g.$async);
    }
    function p(g) {
      const $ = t.scopeValue("schema", s.code.source === !0 ? { ref: g, code: (0, St.stringify)(g) } : { ref: g }), v = t.name("valid"), y = e.subschema({
        schema: g,
        dataTypes: [],
        schemaPath: St.nil,
        topSchemaRef: $,
        errSchemaPath: r
      }, v);
      e.mergeEvaluated(y), e.ok(v);
    }
  }
};
function Hg(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, St._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Hn.getValidate = Hg;
function es(e, t, r, n) {
  const { gen: i, it: o } = e, { allErrors: a, schemaEnv: s, opts: c } = o, u = c.passContext ? Zn.default.this : St.nil;
  n ? l() : f();
  function l() {
    if (!s.$async)
      throw new Error("async schema referenced by sync schema");
    const g = i.let("valid");
    i.try(() => {
      i.code((0, St._)`await ${(0, Lh.callValidateCode)(e, t, u)}`), p(t), a || i.assign(g, !0);
    }, ($) => {
      i.if((0, St._)`!(${$} instanceof ${o.ValidationError})`, () => i.throw($)), h($), a || i.assign(g, !1);
    }), e.ok(g);
  }
  function f() {
    e.result((0, Lh.callValidateCode)(e, t, u), () => p(t), () => h(t));
  }
  function h(g) {
    const $ = (0, St._)`${g}.errors`;
    i.assign(Zn.default.vErrors, (0, St._)`${Zn.default.vErrors} === null ? ${$} : ${Zn.default.vErrors}.concat(${$})`), i.assign(Zn.default.errors, (0, St._)`${Zn.default.vErrors}.length`);
  }
  function p(g) {
    var $;
    if (!o.opts.unevaluated)
      return;
    const v = ($ = r == null ? void 0 : r.validate) === null || $ === void 0 ? void 0 : $.evaluated;
    if (o.props !== !0)
      if (v && !v.dynamicProps)
        v.props !== void 0 && (o.props = ba.mergeEvaluated.props(i, v.props, o.props));
      else {
        const y = i.var("props", (0, St._)`${g}.evaluated.props`);
        o.props = ba.mergeEvaluated.props(i, y, o.props, St.Name);
      }
    if (o.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (o.items = ba.mergeEvaluated.items(i, v.items, o.items));
      else {
        const y = i.var("items", (0, St._)`${g}.evaluated.items`);
        o.items = ba.mergeEvaluated.items(i, y, o.items, St.Name);
      }
  }
}
Hn.callRef = es;
Hn.default = RA;
Object.defineProperty($f, "__esModule", { value: !0 });
const DA = wf, kA = Hn, jA = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  DA.default,
  kA.default
];
$f.default = jA;
var Ef = {}, bf = {};
Object.defineProperty(bf, "__esModule", { value: !0 });
const ys = he, Gr = ys.operators, gs = {
  maximum: { okStr: "<=", ok: Gr.LTE, fail: Gr.GT },
  minimum: { okStr: ">=", ok: Gr.GTE, fail: Gr.LT },
  exclusiveMaximum: { okStr: "<", ok: Gr.LT, fail: Gr.GTE },
  exclusiveMinimum: { okStr: ">", ok: Gr.GT, fail: Gr.LTE }
}, FA = {
  message: ({ keyword: e, schemaCode: t }) => (0, ys.str)`must be ${gs[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, ys._)`{comparison: ${gs[e].okStr}, limit: ${t}}`
}, LA = {
  keyword: Object.keys(gs),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: FA,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, ys._)`${r} ${gs[t].fail} ${n} || isNaN(${r})`);
  }
};
bf.default = LA;
var Sf = {};
Object.defineProperty(Sf, "__esModule", { value: !0 });
const $o = he, UA = {
  message: ({ schemaCode: e }) => (0, $o.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, $o._)`{multipleOf: ${e}}`
}, MA = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: UA,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: i } = e, o = i.opts.multipleOfPrecision, a = t.let("res"), s = o ? (0, $o._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, $o._)`${a} !== parseInt(${a})`;
    e.fail$data((0, $o._)`(${n} === 0 || (${a} = ${r}/${n}, ${s}))`);
  }
};
Sf.default = MA;
var Pf = {}, Tf = {};
Object.defineProperty(Tf, "__esModule", { value: !0 });
function zg(e) {
  const t = e.length;
  let r = 0, n = 0, i;
  for (; n < t; )
    r++, i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < t && (i = e.charCodeAt(n), (i & 64512) === 56320 && n++);
  return r;
}
Tf.default = zg;
zg.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Pf, "__esModule", { value: !0 });
const Rn = he, xA = Q, VA = Tf, qA = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Rn.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Rn._)`{limit: ${e}}`
}, BA = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: qA,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: i } = e, o = t === "maxLength" ? Rn.operators.GT : Rn.operators.LT, a = i.opts.unicode === !1 ? (0, Rn._)`${r}.length` : (0, Rn._)`${(0, xA.useFunc)(e.gen, VA.default)}(${r})`;
    e.fail$data((0, Rn._)`${a} ${o} ${n}`);
  }
};
Pf.default = BA;
var Of = {};
Object.defineProperty(Of, "__esModule", { value: !0 });
const HA = me, vs = he, zA = {
  message: ({ schemaCode: e }) => (0, vs.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, vs._)`{pattern: ${e}}`
}, GA = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: zA,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: i, it: o } = e, a = o.opts.unicodeRegExp ? "u" : "", s = r ? (0, vs._)`(new RegExp(${i}, ${a}))` : (0, HA.usePattern)(e, n);
    e.fail$data((0, vs._)`!${s}.test(${t})`);
  }
};
Of.default = GA;
var Af = {};
Object.defineProperty(Af, "__esModule", { value: !0 });
const wo = he, KA = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, wo.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, wo._)`{limit: ${e}}`
}, WA = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: KA,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxProperties" ? wo.operators.GT : wo.operators.LT;
    e.fail$data((0, wo._)`Object.keys(${r}).length ${i} ${n}`);
  }
};
Af.default = WA;
var Nf = {};
Object.defineProperty(Nf, "__esModule", { value: !0 });
const eo = me, Eo = he, YA = Q, XA = {
  message: ({ params: { missingProperty: e } }) => (0, Eo.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Eo._)`{missingProperty: ${e}}`
}, JA = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: XA,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: i, $data: o, it: a } = e, { opts: s } = a;
    if (!o && r.length === 0)
      return;
    const c = r.length >= s.loopRequired;
    if (a.allErrors ? u() : l(), s.strictRequired) {
      const p = e.parentSchema.properties, { definedProperties: g } = e.it;
      for (const $ of r)
        if ((p == null ? void 0 : p[$]) === void 0 && !g.has($)) {
          const v = a.schemaEnv.baseId + a.errSchemaPath, y = `required property "${$}" is not defined at "${v}" (strictRequired)`;
          (0, YA.checkStrictMode)(a, y, a.opts.strictRequired);
        }
    }
    function u() {
      if (c || o)
        e.block$data(Eo.nil, f);
      else
        for (const p of r)
          (0, eo.checkReportMissingProp)(e, p);
    }
    function l() {
      const p = t.let("missing");
      if (c || o) {
        const g = t.let("valid", !0);
        e.block$data(g, () => h(p, g)), e.ok(g);
      } else
        t.if((0, eo.checkMissingProp)(e, r, p)), (0, eo.reportMissingProp)(e, p), t.else();
    }
    function f() {
      t.forOf("prop", n, (p) => {
        e.setParams({ missingProperty: p }), t.if((0, eo.noPropertyInData)(t, i, p, s.ownProperties), () => e.error());
      });
    }
    function h(p, g) {
      e.setParams({ missingProperty: p }), t.forOf(p, n, () => {
        t.assign(g, (0, eo.propertyInData)(t, i, p, s.ownProperties)), t.if((0, Eo.not)(g), () => {
          e.error(), t.break();
        });
      }, Eo.nil);
    }
  }
};
Nf.default = JA;
var If = {};
Object.defineProperty(If, "__esModule", { value: !0 });
const bo = he, QA = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, bo.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, bo._)`{limit: ${e}}`
}, ZA = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: QA,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxItems" ? bo.operators.GT : bo.operators.LT;
    e.fail$data((0, bo._)`${r}.length ${i} ${n}`);
  }
};
If.default = ZA;
var Cf = {}, Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
const Gg = Ls;
Gg.code = 'require("ajv/dist/runtime/equal").default';
Jo.default = Gg;
Object.defineProperty(Cf, "__esModule", { value: !0 });
const Fc = Ve, Ye = he, eN = Q, tN = Jo, rN = {
  message: ({ params: { i: e, j: t } }) => (0, Ye.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Ye._)`{i: ${e}, j: ${t}}`
}, nN = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: rN,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, parentSchema: o, schemaCode: a, it: s } = e;
    if (!n && !i)
      return;
    const c = t.let("valid"), u = o.items ? (0, Fc.getSchemaTypes)(o.items) : [];
    e.block$data(c, l, (0, Ye._)`${a} === false`), e.ok(c);
    function l() {
      const g = t.let("i", (0, Ye._)`${r}.length`), $ = t.let("j");
      e.setParams({ i: g, j: $ }), t.assign(c, !0), t.if((0, Ye._)`${g} > 1`, () => (f() ? h : p)(g, $));
    }
    function f() {
      return u.length > 0 && !u.some((g) => g === "object" || g === "array");
    }
    function h(g, $) {
      const v = t.name("item"), y = (0, Fc.checkDataTypes)(u, v, s.opts.strictNumbers, Fc.DataType.Wrong), E = t.const("indices", (0, Ye._)`{}`);
      t.for((0, Ye._)`;${g}--;`, () => {
        t.let(v, (0, Ye._)`${r}[${g}]`), t.if(y, (0, Ye._)`continue`), u.length > 1 && t.if((0, Ye._)`typeof ${v} == "string"`, (0, Ye._)`${v} += "_"`), t.if((0, Ye._)`typeof ${E}[${v}] == "number"`, () => {
          t.assign($, (0, Ye._)`${E}[${v}]`), e.error(), t.assign(c, !1).break();
        }).code((0, Ye._)`${E}[${v}] = ${g}`);
      });
    }
    function p(g, $) {
      const v = (0, eN.useFunc)(t, tN.default), y = t.name("outer");
      t.label(y).for((0, Ye._)`;${g}--;`, () => t.for((0, Ye._)`${$} = ${g}; ${$}--;`, () => t.if((0, Ye._)`${v}(${r}[${g}], ${r}[${$}])`, () => {
        e.error(), t.assign(c, !1).break(y);
      })));
    }
  }
};
Cf.default = nN;
var Rf = {};
Object.defineProperty(Rf, "__esModule", { value: !0 });
const Fl = he, iN = Q, oN = Jo, aN = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Fl._)`{allowedValue: ${e}}`
}, sN = {
  keyword: "const",
  $data: !0,
  error: aN,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: i, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, Fl._)`!${(0, iN.useFunc)(t, oN.default)}(${r}, ${i})`) : e.fail((0, Fl._)`${o} !== ${r}`);
  }
};
Rf.default = sN;
var Df = {};
Object.defineProperty(Df, "__esModule", { value: !0 });
const uo = he, cN = Q, lN = Jo, uN = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, uo._)`{allowedValues: ${e}}`
}, fN = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: uN,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, schemaCode: o, it: a } = e;
    if (!n && i.length === 0)
      throw new Error("enum must have non-empty array");
    const s = i.length >= a.opts.loopEnum;
    let c;
    const u = () => c ?? (c = (0, cN.useFunc)(t, lN.default));
    let l;
    if (s || n)
      l = t.let("valid"), e.block$data(l, f);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const p = t.const("vSchema", o);
      l = (0, uo.or)(...i.map((g, $) => h(p, $)));
    }
    e.pass(l);
    function f() {
      t.assign(l, !1), t.forOf("v", o, (p) => t.if((0, uo._)`${u()}(${r}, ${p})`, () => t.assign(l, !0).break()));
    }
    function h(p, g) {
      const $ = i[g];
      return typeof $ == "object" && $ !== null ? (0, uo._)`${u()}(${r}, ${p}[${g}])` : (0, uo._)`${r} === ${$}`;
    }
  }
};
Df.default = fN;
Object.defineProperty(Ef, "__esModule", { value: !0 });
const dN = bf, hN = Sf, pN = Pf, mN = Of, yN = Af, gN = Nf, vN = If, _N = Cf, $N = Rf, wN = Df, EN = [
  // number
  dN.default,
  hN.default,
  // string
  pN.default,
  mN.default,
  // object
  yN.default,
  gN.default,
  // array
  vN.default,
  _N.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  $N.default,
  wN.default
];
Ef.default = EN;
var kf = {}, xi = {};
Object.defineProperty(xi, "__esModule", { value: !0 });
xi.validateAdditionalItems = void 0;
const Dn = he, Ll = Q, bN = {
  message: ({ params: { len: e } }) => (0, Dn.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Dn._)`{limit: ${e}}`
}, SN = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: bN,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Ll.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Kg(e, n);
  }
};
function Kg(e, t) {
  const { gen: r, schema: n, data: i, keyword: o, it: a } = e;
  a.items = !0;
  const s = r.const("len", (0, Dn._)`${i}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Dn._)`${s} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Ll.alwaysValidSchema)(a, n)) {
    const u = r.var("valid", (0, Dn._)`${s} <= ${t.length}`);
    r.if((0, Dn.not)(u), () => c(u)), e.ok(u);
  }
  function c(u) {
    r.forRange("i", t.length, s, (l) => {
      e.subschema({ keyword: o, dataProp: l, dataPropType: Ll.Type.Num }, u), a.allErrors || r.if((0, Dn.not)(u), () => r.break());
    });
  }
}
xi.validateAdditionalItems = Kg;
xi.default = SN;
var jf = {}, Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
Vi.validateTuple = void 0;
const Mh = he, ts = Q, PN = me, TN = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Wg(e, "additionalItems", t);
    r.items = !0, !(0, ts.alwaysValidSchema)(r, t) && e.ok((0, PN.validateArray)(e));
  }
};
function Wg(e, t, r = e.schema) {
  const { gen: n, parentSchema: i, data: o, keyword: a, it: s } = e;
  l(i), s.opts.unevaluated && r.length && s.items !== !0 && (s.items = ts.mergeEvaluated.items(n, r.length, s.items));
  const c = n.name("valid"), u = n.const("len", (0, Mh._)`${o}.length`);
  r.forEach((f, h) => {
    (0, ts.alwaysValidSchema)(s, f) || (n.if((0, Mh._)`${u} > ${h}`, () => e.subschema({
      keyword: a,
      schemaProp: h,
      dataProp: h
    }, c)), e.ok(c));
  });
  function l(f) {
    const { opts: h, errSchemaPath: p } = s, g = r.length, $ = g === f.minItems && (g === f.maxItems || f[t] === !1);
    if (h.strictTuples && !$) {
      const v = `"${a}" is ${g}-tuple, but minItems or maxItems/${t} are not specified or different at path "${p}"`;
      (0, ts.checkStrictMode)(s, v, h.strictTuples);
    }
  }
}
Vi.validateTuple = Wg;
Vi.default = TN;
Object.defineProperty(jf, "__esModule", { value: !0 });
const ON = Vi, AN = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, ON.validateTuple)(e, "items")
};
jf.default = AN;
var Ff = {};
Object.defineProperty(Ff, "__esModule", { value: !0 });
const xh = he, NN = Q, IN = me, CN = xi, RN = {
  message: ({ params: { len: e } }) => (0, xh.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, xh._)`{limit: ${e}}`
}, DN = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: RN,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: i } = r;
    n.items = !0, !(0, NN.alwaysValidSchema)(n, t) && (i ? (0, CN.validateAdditionalItems)(e, i) : e.ok((0, IN.validateArray)(e)));
  }
};
Ff.default = DN;
var Lf = {};
Object.defineProperty(Lf, "__esModule", { value: !0 });
const Vt = he, Sa = Q, kN = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Vt.str)`must contain at least ${e} valid item(s)` : (0, Vt.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Vt._)`{minContains: ${e}}` : (0, Vt._)`{minContains: ${e}, maxContains: ${t}}`
}, jN = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: kN,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: o } = e;
    let a, s;
    const { minContains: c, maxContains: u } = n;
    o.opts.next ? (a = c === void 0 ? 1 : c, s = u) : a = 1;
    const l = t.const("len", (0, Vt._)`${i}.length`);
    if (e.setParams({ min: a, max: s }), s === void 0 && a === 0) {
      (0, Sa.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (s !== void 0 && a > s) {
      (0, Sa.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Sa.alwaysValidSchema)(o, r)) {
      let $ = (0, Vt._)`${l} >= ${a}`;
      s !== void 0 && ($ = (0, Vt._)`${$} && ${l} <= ${s}`), e.pass($);
      return;
    }
    o.items = !0;
    const f = t.name("valid");
    s === void 0 && a === 1 ? p(f, () => t.if(f, () => t.break())) : a === 0 ? (t.let(f, !0), s !== void 0 && t.if((0, Vt._)`${i}.length > 0`, h)) : (t.let(f, !1), h()), e.result(f, () => e.reset());
    function h() {
      const $ = t.name("_valid"), v = t.let("count", 0);
      p($, () => t.if($, () => g(v)));
    }
    function p($, v) {
      t.forRange("i", 0, l, (y) => {
        e.subschema({
          keyword: "contains",
          dataProp: y,
          dataPropType: Sa.Type.Num,
          compositeRule: !0
        }, $), v();
      });
    }
    function g($) {
      t.code((0, Vt._)`${$}++`), s === void 0 ? t.if((0, Vt._)`${$} >= ${a}`, () => t.assign(f, !0).break()) : (t.if((0, Vt._)`${$} > ${s}`, () => t.assign(f, !1).break()), a === 1 ? t.assign(f, !0) : t.if((0, Vt._)`${$} >= ${a}`, () => t.assign(f, !0)));
    }
  }
};
Lf.default = jN;
var Yg = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = he, r = Q, n = me;
  e.error = {
    message: ({ params: { property: c, depsCount: u, deps: l } }) => {
      const f = u === 1 ? "property" : "properties";
      return (0, t.str)`must have ${f} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: u, deps: l, missingProperty: f } }) => (0, t._)`{property: ${c},
    missingProperty: ${f},
    depsCount: ${u},
    deps: ${l}}`
    // TODO change to reference
  };
  const i = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [u, l] = o(c);
      a(c, u), s(c, l);
    }
  };
  function o({ schema: c }) {
    const u = {}, l = {};
    for (const f in c) {
      if (f === "__proto__")
        continue;
      const h = Array.isArray(c[f]) ? u : l;
      h[f] = c[f];
    }
    return [u, l];
  }
  function a(c, u = c.schema) {
    const { gen: l, data: f, it: h } = c;
    if (Object.keys(u).length === 0)
      return;
    const p = l.let("missing");
    for (const g in u) {
      const $ = u[g];
      if ($.length === 0)
        continue;
      const v = (0, n.propertyInData)(l, f, g, h.opts.ownProperties);
      c.setParams({
        property: g,
        depsCount: $.length,
        deps: $.join(", ")
      }), h.allErrors ? l.if(v, () => {
        for (const y of $)
          (0, n.checkReportMissingProp)(c, y);
      }) : (l.if((0, t._)`${v} && (${(0, n.checkMissingProp)(c, $, p)})`), (0, n.reportMissingProp)(c, p), l.else());
    }
  }
  e.validatePropertyDeps = a;
  function s(c, u = c.schema) {
    const { gen: l, data: f, keyword: h, it: p } = c, g = l.name("valid");
    for (const $ in u)
      (0, r.alwaysValidSchema)(p, u[$]) || (l.if(
        (0, n.propertyInData)(l, f, $, p.opts.ownProperties),
        () => {
          const v = c.subschema({ keyword: h, schemaProp: $ }, g);
          c.mergeValidEvaluated(v, g);
        },
        () => l.var(g, !0)
        // TODO var
      ), c.ok(g));
  }
  e.validateSchemaDeps = s, e.default = i;
})(Yg);
var Uf = {};
Object.defineProperty(Uf, "__esModule", { value: !0 });
const Xg = he, FN = Q, LN = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Xg._)`{propertyName: ${e.propertyName}}`
}, UN = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: LN,
  code(e) {
    const { gen: t, schema: r, data: n, it: i } = e;
    if ((0, FN.alwaysValidSchema)(i, r))
      return;
    const o = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, o), t.if((0, Xg.not)(o), () => {
        e.error(!0), i.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
Uf.default = UN;
var Ks = {};
Object.defineProperty(Ks, "__esModule", { value: !0 });
const Pa = me, Wt = he, MN = mr, Ta = Q, xN = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Wt._)`{additionalProperty: ${e.additionalProperty}}`
}, VN = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: xN,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: s, opts: c } = a;
    if (a.props = !0, c.removeAdditional !== "all" && (0, Ta.alwaysValidSchema)(a, r))
      return;
    const u = (0, Pa.allSchemaProperties)(n.properties), l = (0, Pa.allSchemaProperties)(n.patternProperties);
    f(), e.ok((0, Wt._)`${o} === ${MN.default.errors}`);
    function f() {
      t.forIn("key", i, (v) => {
        !u.length && !l.length ? g(v) : t.if(h(v), () => g(v));
      });
    }
    function h(v) {
      let y;
      if (u.length > 8) {
        const E = (0, Ta.schemaRefOrVal)(a, n.properties, "properties");
        y = (0, Pa.isOwnProperty)(t, E, v);
      } else u.length ? y = (0, Wt.or)(...u.map((E) => (0, Wt._)`${v} === ${E}`)) : y = Wt.nil;
      return l.length && (y = (0, Wt.or)(y, ...l.map((E) => (0, Wt._)`${(0, Pa.usePattern)(e, E)}.test(${v})`))), (0, Wt.not)(y);
    }
    function p(v) {
      t.code((0, Wt._)`delete ${i}[${v}]`);
    }
    function g(v) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        p(v);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: v }), e.error(), s || t.break();
        return;
      }
      if (typeof r == "object" && !(0, Ta.alwaysValidSchema)(a, r)) {
        const y = t.name("valid");
        c.removeAdditional === "failing" ? ($(v, y, !1), t.if((0, Wt.not)(y), () => {
          e.reset(), p(v);
        })) : ($(v, y), s || t.if((0, Wt.not)(y), () => t.break()));
      }
    }
    function $(v, y, E) {
      const A = {
        keyword: "additionalProperties",
        dataProp: v,
        dataPropType: Ta.Type.Str
      };
      E === !1 && Object.assign(A, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(A, y);
    }
  }
};
Ks.default = VN;
var Mf = {};
Object.defineProperty(Mf, "__esModule", { value: !0 });
const qN = rr, Vh = me, Lc = Q, qh = Ks, BN = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && qh.default.code(new qN.KeywordCxt(o, qh.default, "additionalProperties"));
    const a = (0, Vh.allSchemaProperties)(r);
    for (const f of a)
      o.definedProperties.add(f);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = Lc.mergeEvaluated.props(t, (0, Lc.toHash)(a), o.props));
    const s = a.filter((f) => !(0, Lc.alwaysValidSchema)(o, r[f]));
    if (s.length === 0)
      return;
    const c = t.name("valid");
    for (const f of s)
      u(f) ? l(f) : (t.if((0, Vh.propertyInData)(t, i, f, o.opts.ownProperties)), l(f), o.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(f), e.ok(c);
    function u(f) {
      return o.opts.useDefaults && !o.compositeRule && r[f].default !== void 0;
    }
    function l(f) {
      e.subschema({
        keyword: "properties",
        schemaProp: f,
        dataProp: f
      }, c);
    }
  }
};
Mf.default = BN;
var xf = {};
Object.defineProperty(xf, "__esModule", { value: !0 });
const Bh = me, Oa = he, Hh = Q, zh = Q, HN = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: i, it: o } = e, { opts: a } = o, s = (0, Bh.allSchemaProperties)(r), c = s.filter(($) => (0, Hh.alwaysValidSchema)(o, r[$]));
    if (s.length === 0 || c.length === s.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const u = a.strictSchema && !a.allowMatchingProperties && i.properties, l = t.name("valid");
    o.props !== !0 && !(o.props instanceof Oa.Name) && (o.props = (0, zh.evaluatedPropsToName)(t, o.props));
    const { props: f } = o;
    h();
    function h() {
      for (const $ of s)
        u && p($), o.allErrors ? g($) : (t.var(l, !0), g($), t.if(l));
    }
    function p($) {
      for (const v in u)
        new RegExp($).test(v) && (0, Hh.checkStrictMode)(o, `property ${v} matches pattern ${$} (use allowMatchingProperties)`);
    }
    function g($) {
      t.forIn("key", n, (v) => {
        t.if((0, Oa._)`${(0, Bh.usePattern)(e, $)}.test(${v})`, () => {
          const y = c.includes($);
          y || e.subschema({
            keyword: "patternProperties",
            schemaProp: $,
            dataProp: v,
            dataPropType: zh.Type.Str
          }, l), o.opts.unevaluated && f !== !0 ? t.assign((0, Oa._)`${f}[${v}]`, !0) : !y && !o.allErrors && t.if((0, Oa.not)(l), () => t.break());
        });
      });
    }
  }
};
xf.default = HN;
var Vf = {};
Object.defineProperty(Vf, "__esModule", { value: !0 });
const zN = Q, GN = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, zN.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const i = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, i), e.failResult(i, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
Vf.default = GN;
var qf = {};
Object.defineProperty(qf, "__esModule", { value: !0 });
const KN = me, WN = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: KN.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
qf.default = WN;
var Bf = {};
Object.defineProperty(Bf, "__esModule", { value: !0 });
const rs = he, YN = Q, XN = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, rs._)`{passingSchemas: ${e.passing}}`
}, JN = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: XN,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: i } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (i.opts.discriminator && n.discriminator)
      return;
    const o = r, a = t.let("valid", !1), s = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: s }), t.block(u), e.result(a, () => e.reset(), () => e.error(!0));
    function u() {
      o.forEach((l, f) => {
        let h;
        (0, YN.alwaysValidSchema)(i, l) ? t.var(c, !0) : h = e.subschema({
          keyword: "oneOf",
          schemaProp: f,
          compositeRule: !0
        }, c), f > 0 && t.if((0, rs._)`${c} && ${a}`).assign(a, !1).assign(s, (0, rs._)`[${s}, ${f}]`).else(), t.if(c, () => {
          t.assign(a, !0), t.assign(s, f), h && e.mergeEvaluated(h, rs.Name);
        });
      });
    }
  }
};
Bf.default = JN;
var Hf = {};
Object.defineProperty(Hf, "__esModule", { value: !0 });
const QN = Q, ZN = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const i = t.name("valid");
    r.forEach((o, a) => {
      if ((0, QN.alwaysValidSchema)(n, o))
        return;
      const s = e.subschema({ keyword: "allOf", schemaProp: a }, i);
      e.ok(i), e.mergeEvaluated(s);
    });
  }
};
Hf.default = ZN;
var zf = {};
Object.defineProperty(zf, "__esModule", { value: !0 });
const _s = he, Jg = Q, eI = {
  message: ({ params: e }) => (0, _s.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, _s._)`{failingKeyword: ${e.ifClause}}`
}, tI = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: eI,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Jg.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const i = Gh(n, "then"), o = Gh(n, "else");
    if (!i && !o)
      return;
    const a = t.let("valid", !0), s = t.name("_valid");
    if (c(), e.reset(), i && o) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(s, u("then", l), u("else", l));
    } else i ? t.if(s, u("then")) : t.if((0, _s.not)(s), u("else"));
    e.pass(a, () => e.error(!0));
    function c() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, s);
      e.mergeEvaluated(l);
    }
    function u(l, f) {
      return () => {
        const h = e.subschema({ keyword: l }, s);
        t.assign(a, s), e.mergeValidEvaluated(h, a), f ? t.assign(f, (0, _s._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function Gh(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Jg.alwaysValidSchema)(e, r);
}
zf.default = tI;
var Gf = {};
Object.defineProperty(Gf, "__esModule", { value: !0 });
const rI = Q, nI = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, rI.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Gf.default = nI;
Object.defineProperty(kf, "__esModule", { value: !0 });
const iI = xi, oI = jf, aI = Vi, sI = Ff, cI = Lf, lI = Yg, uI = Uf, fI = Ks, dI = Mf, hI = xf, pI = Vf, mI = qf, yI = Bf, gI = Hf, vI = zf, _I = Gf;
function $I(e = !1) {
  const t = [
    // any
    pI.default,
    mI.default,
    yI.default,
    gI.default,
    vI.default,
    _I.default,
    // object
    uI.default,
    fI.default,
    lI.default,
    dI.default,
    hI.default
  ];
  return e ? t.push(oI.default, sI.default) : t.push(iI.default, aI.default), t.push(cI.default), t;
}
kf.default = $I;
var Kf = {}, Wf = {};
Object.defineProperty(Wf, "__esModule", { value: !0 });
const Ue = he, wI = {
  message: ({ schemaCode: e }) => (0, Ue.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, Ue._)`{format: ${e}}`
}, EI = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: wI,
  code(e, t) {
    const { gen: r, data: n, $data: i, schema: o, schemaCode: a, it: s } = e, { opts: c, errSchemaPath: u, schemaEnv: l, self: f } = s;
    if (!c.validateFormats)
      return;
    i ? h() : p();
    function h() {
      const g = r.scopeValue("formats", {
        ref: f.formats,
        code: c.code.formats
      }), $ = r.const("fDef", (0, Ue._)`${g}[${a}]`), v = r.let("fType"), y = r.let("format");
      r.if((0, Ue._)`typeof ${$} == "object" && !(${$} instanceof RegExp)`, () => r.assign(v, (0, Ue._)`${$}.type || "string"`).assign(y, (0, Ue._)`${$}.validate`), () => r.assign(v, (0, Ue._)`"string"`).assign(y, $)), e.fail$data((0, Ue.or)(E(), A()));
      function E() {
        return c.strictSchema === !1 ? Ue.nil : (0, Ue._)`${a} && !${y}`;
      }
      function A() {
        const C = l.$async ? (0, Ue._)`(${$}.async ? await ${y}(${n}) : ${y}(${n}))` : (0, Ue._)`${y}(${n})`, D = (0, Ue._)`(typeof ${y} == "function" ? ${C} : ${y}.test(${n}))`;
        return (0, Ue._)`${y} && ${y} !== true && ${v} === ${t} && !${D}`;
      }
    }
    function p() {
      const g = f.formats[o];
      if (!g) {
        E();
        return;
      }
      if (g === !0)
        return;
      const [$, v, y] = A(g);
      $ === t && e.pass(C());
      function E() {
        if (c.strictSchema === !1) {
          f.logger.warn(D());
          return;
        }
        throw new Error(D());
        function D() {
          return `unknown format "${o}" ignored in schema at path "${u}"`;
        }
      }
      function A(D) {
        const V = D instanceof RegExp ? (0, Ue.regexpCode)(D) : c.code.formats ? (0, Ue._)`${c.code.formats}${(0, Ue.getProperty)(o)}` : void 0, z = r.scopeValue("formats", { key: o, ref: D, code: V });
        return typeof D == "object" && !(D instanceof RegExp) ? [D.type || "string", D.validate, (0, Ue._)`${z}.validate`] : ["string", D, z];
      }
      function C() {
        if (typeof g == "object" && !(g instanceof RegExp) && g.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, Ue._)`await ${y}(${n})`;
        }
        return typeof v == "function" ? (0, Ue._)`${y}(${n})` : (0, Ue._)`${y}.test(${n})`;
      }
    }
  }
};
Wf.default = EI;
Object.defineProperty(Kf, "__esModule", { value: !0 });
const bI = Wf, SI = [bI.default];
Kf.default = SI;
var Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.contentVocabulary = Ai.metadataVocabulary = void 0;
Ai.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Ai.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(_f, "__esModule", { value: !0 });
const PI = $f, TI = Ef, OI = kf, AI = Kf, Kh = Ai, NI = [
  PI.default,
  TI.default,
  (0, OI.default)(),
  AI.default,
  Kh.metadataVocabulary,
  Kh.contentVocabulary
];
_f.default = NI;
var Yf = {}, Ws = {};
Object.defineProperty(Ws, "__esModule", { value: !0 });
Ws.DiscrError = void 0;
var Wh;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Wh || (Ws.DiscrError = Wh = {}));
Object.defineProperty(Yf, "__esModule", { value: !0 });
const ci = he, Ul = Ws, Yh = Pt, II = Mi, CI = Q, RI = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Ul.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, ci._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, DI = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: RI,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: i, it: o } = e, { oneOf: a } = i;
    if (!o.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const s = n.propertyName;
    if (typeof s != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!a)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), u = t.const("tag", (0, ci._)`${r}${(0, ci.getProperty)(s)}`);
    t.if((0, ci._)`typeof ${u} == "string"`, () => l(), () => e.error(!1, { discrError: Ul.DiscrError.Tag, tag: u, tagName: s })), e.ok(c);
    function l() {
      const p = h();
      t.if(!1);
      for (const g in p)
        t.elseIf((0, ci._)`${u} === ${g}`), t.assign(c, f(p[g]));
      t.else(), e.error(!1, { discrError: Ul.DiscrError.Mapping, tag: u, tagName: s }), t.endIf();
    }
    function f(p) {
      const g = t.name("valid"), $ = e.subschema({ keyword: "oneOf", schemaProp: p }, g);
      return e.mergeEvaluated($, ci.Name), g;
    }
    function h() {
      var p;
      const g = {}, $ = y(i);
      let v = !0;
      for (let C = 0; C < a.length; C++) {
        let D = a[C];
        if (D != null && D.$ref && !(0, CI.schemaHasRulesButRef)(D, o.self.RULES)) {
          const z = D.$ref;
          if (D = Yh.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, z), D instanceof Yh.SchemaEnv && (D = D.schema), D === void 0)
            throw new II.default(o.opts.uriResolver, o.baseId, z);
        }
        const V = (p = D == null ? void 0 : D.properties) === null || p === void 0 ? void 0 : p[s];
        if (typeof V != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${s}"`);
        v = v && ($ || y(D)), E(V, C);
      }
      if (!v)
        throw new Error(`discriminator: "${s}" must be required`);
      return g;
      function y({ required: C }) {
        return Array.isArray(C) && C.includes(s);
      }
      function E(C, D) {
        if (C.const)
          A(C.const, D);
        else if (C.enum)
          for (const V of C.enum)
            A(V, D);
        else
          throw new Error(`discriminator: "properties/${s}" must have "const" or "enum"`);
      }
      function A(C, D) {
        if (typeof C != "string" || C in g)
          throw new Error(`discriminator: "${s}" values must be unique strings`);
        g[C] = D;
      }
    }
  }
};
Yf.default = DI;
const kI = "http://json-schema.org/draft-07/schema#", jI = "http://json-schema.org/draft-07/schema#", FI = "Core schema meta-schema", LI = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, UI = [
  "object",
  "boolean"
], MI = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, xI = {
  $schema: kI,
  $id: jI,
  title: FI,
  definitions: LI,
  type: UI,
  properties: MI,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = fg, n = _f, i = Yf, o = xI, a = ["/properties"], s = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((g) => this.addVocabulary(g)), this.opts.discriminator && this.addKeyword(i.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const g = this.opts.$data ? this.$dataMetaSchema(o, a) : o;
      this.addMetaSchema(g, s, !1), this.refs["http://json-schema.org/schema"] = s;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(s) ? s : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var u = rr;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return u.KeywordCxt;
  } });
  var l = he;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return l._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return l.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return l.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return l.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return l.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return l.CodeGen;
  } });
  var f = Xo;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return f.default;
  } });
  var h = Mi;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(Cl, Cl.exports);
var VI = Cl.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = VI, r = he, n = r.operators, i = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, o = {
    message: ({ keyword: s, schemaCode: c }) => (0, r.str)`should be ${i[s].okStr} ${c}`,
    params: ({ keyword: s, schemaCode: c }) => (0, r._)`{comparison: ${i[s].okStr}, limit: ${c}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(i),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: o,
    code(s) {
      const { gen: c, data: u, schemaCode: l, keyword: f, it: h } = s, { opts: p, self: g } = h;
      if (!p.validateFormats)
        return;
      const $ = new t.KeywordCxt(h, g.RULES.all.format.definition, "format");
      $.$data ? v() : y();
      function v() {
        const A = c.scopeValue("formats", {
          ref: g.formats,
          code: p.code.formats
        }), C = c.const("fmt", (0, r._)`${A}[${$.schemaCode}]`);
        s.fail$data((0, r.or)((0, r._)`typeof ${C} != "object"`, (0, r._)`${C} instanceof RegExp`, (0, r._)`typeof ${C}.compare != "function"`, E(C)));
      }
      function y() {
        const A = $.schema, C = g.formats[A];
        if (!C || C === !0)
          return;
        if (typeof C != "object" || C instanceof RegExp || typeof C.compare != "function")
          throw new Error(`"${f}": format "${A}" does not define "compare" function`);
        const D = c.scopeValue("formats", {
          key: A,
          ref: C,
          code: p.code.formats ? (0, r._)`${p.code.formats}${(0, r.getProperty)(A)}` : void 0
        });
        s.fail$data(E(D));
      }
      function E(A) {
        return (0, r._)`${A}.compare(${u}, ${l}) ${i[f].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const a = (s) => (s.addKeyword(e.formatLimitDefinition), s);
  e.default = a;
})(ug);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = lg, n = ug, i = he, o = new i.Name("fullFormats"), a = new i.Name("fastFormats"), s = (u, l = { keywords: !0 }) => {
    if (Array.isArray(l))
      return c(u, l, r.fullFormats, o), u;
    const [f, h] = l.mode === "fast" ? [r.fastFormats, a] : [r.fullFormats, o], p = l.formats || r.formatNames;
    return c(u, p, f, h), l.keywords && (0, n.default)(u), u;
  };
  s.get = (u, l = "full") => {
    const h = (l === "fast" ? r.fastFormats : r.fullFormats)[u];
    if (!h)
      throw new Error(`Unknown format "${u}"`);
    return h;
  };
  function c(u, l, f, h) {
    var p, g;
    (p = (g = u.opts.code).formats) !== null && p !== void 0 || (g.formats = (0, i._)`require("ajv-formats/dist/formats").${h}`);
    for (const $ of l)
      u.addFormat($, f[$]);
  }
  e.exports = t = s, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = s;
})(Il, Il.exports);
var qI = Il.exports;
const BI = /* @__PURE__ */ ly(qI), HI = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const i = Object.getOwnPropertyDescriptor(e, r), o = Object.getOwnPropertyDescriptor(t, r);
  !zI(i, o) && n || Object.defineProperty(e, r, o);
}, zI = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, GI = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, KI = (e, t) => `/* Wrapped ${e}*/
${t}`, WI = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), YI = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), XI = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, i = KI.bind(null, n, t.toString());
  Object.defineProperty(i, "name", YI);
  const { writable: o, enumerable: a, configurable: s } = WI;
  Object.defineProperty(e, "toString", { value: i, writable: o, enumerable: a, configurable: s });
};
function JI(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const i of Reflect.ownKeys(t))
    HI(e, t, i, r);
  return GI(e, t), XI(e, t, n), e;
}
const Xh = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: i = !1,
    after: o = !0
  } = t;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!i && !o)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let a, s, c;
  const u = function(...l) {
    const f = this, h = () => {
      a = void 0, s && (clearTimeout(s), s = void 0), o && (c = e.apply(f, l));
    }, p = () => {
      s = void 0, a && (clearTimeout(a), a = void 0), o && (c = e.apply(f, l));
    }, g = i && !a;
    return clearTimeout(a), a = setTimeout(h, r), n > 0 && n !== Number.POSITIVE_INFINITY && !s && (s = setTimeout(p, n)), g && (c = e.apply(f, l)), c;
  };
  return JI(u, e), u.cancel = () => {
    a && (clearTimeout(a), a = void 0), s && (clearTimeout(s), s = void 0);
  }, u;
};
var Ml = { exports: {} };
const QI = "2.0.0", Qg = 256, ZI = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, eC = 16, tC = Qg - 6, rC = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Ys = {
  MAX_LENGTH: Qg,
  MAX_SAFE_COMPONENT_LENGTH: eC,
  MAX_SAFE_BUILD_LENGTH: tC,
  MAX_SAFE_INTEGER: ZI,
  RELEASE_TYPES: rC,
  SEMVER_SPEC_VERSION: QI,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const nC = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Xs = nC;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = Ys, o = Xs;
  t = e.exports = {};
  const a = t.re = [], s = t.safeRe = [], c = t.src = [], u = t.safeSrc = [], l = t.t = {};
  let f = 0;
  const h = "[a-zA-Z0-9-]", p = [
    ["\\s", 1],
    ["\\d", i],
    [h, n]
  ], g = (v) => {
    for (const [y, E] of p)
      v = v.split(`${y}*`).join(`${y}{0,${E}}`).split(`${y}+`).join(`${y}{1,${E}}`);
    return v;
  }, $ = (v, y, E) => {
    const A = g(y), C = f++;
    o(v, C, y), l[v] = C, c[C] = y, u[C] = A, a[C] = new RegExp(y, E ? "g" : void 0), s[C] = new RegExp(A, E ? "g" : void 0);
  };
  $("NUMERICIDENTIFIER", "0|[1-9]\\d*"), $("NUMERICIDENTIFIERLOOSE", "\\d+"), $("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), $("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), $("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), $("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), $("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), $("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), $("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), $("BUILDIDENTIFIER", `${h}+`), $("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), $("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), $("FULL", `^${c[l.FULLPLAIN]}$`), $("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), $("LOOSE", `^${c[l.LOOSEPLAIN]}$`), $("GTLT", "((?:<|>)?=?)"), $("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), $("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), $("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), $("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), $("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), $("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), $("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), $("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), $("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), $("COERCERTL", c[l.COERCE], !0), $("COERCERTLFULL", c[l.COERCEFULL], !0), $("LONETILDE", "(?:~>?)"), $("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", $("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), $("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), $("LONECARET", "(?:\\^)"), $("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", $("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), $("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), $("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), $("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), $("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", $("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), $("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), $("STAR", "(<|>)?=?\\s*\\*"), $("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), $("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Ml, Ml.exports);
var Qo = Ml.exports;
const iC = Object.freeze({ loose: !0 }), oC = Object.freeze({}), aC = (e) => e ? typeof e != "object" ? iC : e : oC;
var Xf = aC;
const Jh = /^[0-9]+$/, Zg = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Jh.test(e), n = Jh.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, sC = (e, t) => Zg(t, e);
var e0 = {
  compareIdentifiers: Zg,
  rcompareIdentifiers: sC
};
const Aa = Xs, { MAX_LENGTH: Qh, MAX_SAFE_INTEGER: Na } = Ys, { safeRe: Ia, t: Ca } = Qo, cC = Xf, { compareIdentifiers: Uc } = e0;
let lC = class sr {
  constructor(t, r) {
    if (r = cC(r), t instanceof sr) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Qh)
      throw new TypeError(
        `version is longer than ${Qh} characters`
      );
    Aa("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Ia[Ca.LOOSE] : Ia[Ca.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Na || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Na || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Na || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < Na)
          return o;
      }
      return i;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (Aa("SemVer.compare", this.version, this.options, t), !(t instanceof sr)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new sr(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof sr || (t = new sr(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof sr || (t = new sr(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (Aa("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Uc(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof sr || (t = new sr(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (Aa("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Uc(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? Ia[Ca.PRERELEASELOOSE] : Ia[Ca.PRERELEASE]);
        if (!i || i[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let o = this.prerelease.length;
          for (; --o >= 0; )
            typeof this.prerelease[o] == "number" && (this.prerelease[o]++, o = -2);
          if (o === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (r) {
          let o = [r, i];
          n === !1 && (o = [r]), Uc(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var gt = lC;
const Zh = gt, uC = (e, t, r = !1) => {
  if (e instanceof Zh)
    return e;
  try {
    return new Zh(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var qi = uC;
const fC = qi, dC = (e, t) => {
  const r = fC(e, t);
  return r ? r.version : null;
};
var hC = dC;
const pC = qi, mC = (e, t) => {
  const r = pC(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var yC = mC;
const ep = gt, gC = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new ep(
      e instanceof ep ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var vC = gC;
const tp = qi, _C = (e, t) => {
  const r = tp(e, null, !0), n = tp(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const o = i > 0, a = o ? r : n, s = o ? n : r, c = !!a.prerelease.length;
  if (!!s.prerelease.length && !c) {
    if (!s.patch && !s.minor)
      return "major";
    if (s.compareMain(a) === 0)
      return s.minor && !s.patch ? "minor" : "patch";
  }
  const l = c ? "pre" : "";
  return r.major !== n.major ? l + "major" : r.minor !== n.minor ? l + "minor" : r.patch !== n.patch ? l + "patch" : "prerelease";
};
var $C = _C;
const wC = gt, EC = (e, t) => new wC(e, t).major;
var bC = EC;
const SC = gt, PC = (e, t) => new SC(e, t).minor;
var TC = PC;
const OC = gt, AC = (e, t) => new OC(e, t).patch;
var NC = AC;
const IC = qi, CC = (e, t) => {
  const r = IC(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var RC = CC;
const rp = gt, DC = (e, t, r) => new rp(e, r).compare(new rp(t, r));
var nr = DC;
const kC = nr, jC = (e, t, r) => kC(t, e, r);
var FC = jC;
const LC = nr, UC = (e, t) => LC(e, t, !0);
var MC = UC;
const np = gt, xC = (e, t, r) => {
  const n = new np(e, r), i = new np(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var Jf = xC;
const VC = Jf, qC = (e, t) => e.sort((r, n) => VC(r, n, t));
var BC = qC;
const HC = Jf, zC = (e, t) => e.sort((r, n) => HC(n, r, t));
var GC = zC;
const KC = nr, WC = (e, t, r) => KC(e, t, r) > 0;
var Js = WC;
const YC = nr, XC = (e, t, r) => YC(e, t, r) < 0;
var Qf = XC;
const JC = nr, QC = (e, t, r) => JC(e, t, r) === 0;
var t0 = QC;
const ZC = nr, eR = (e, t, r) => ZC(e, t, r) !== 0;
var r0 = eR;
const tR = nr, rR = (e, t, r) => tR(e, t, r) >= 0;
var Zf = rR;
const nR = nr, iR = (e, t, r) => nR(e, t, r) <= 0;
var ed = iR;
const oR = t0, aR = r0, sR = Js, cR = Zf, lR = Qf, uR = ed, fR = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return oR(e, r, n);
    case "!=":
      return aR(e, r, n);
    case ">":
      return sR(e, r, n);
    case ">=":
      return cR(e, r, n);
    case "<":
      return lR(e, r, n);
    case "<=":
      return uR(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var n0 = fR;
const dR = gt, hR = qi, { safeRe: Ra, t: Da } = Qo, pR = (e, t) => {
  if (e instanceof dR)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Ra[Da.COERCEFULL] : Ra[Da.COERCE]);
  else {
    const c = t.includePrerelease ? Ra[Da.COERCERTLFULL] : Ra[Da.COERCERTL];
    let u;
    for (; (u = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || u.index + u[0].length !== r.index + r[0].length) && (r = u), c.lastIndex = u.index + u[1].length + u[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", o = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", s = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return hR(`${n}.${i}.${o}${a}${s}`, t);
};
var mR = pR;
class yR {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var gR = yR, Mc, ip;
function ir() {
  if (ip) return Mc;
  ip = 1;
  const e = /\s+/g;
  class t {
    constructor(L, H) {
      if (H = i(H), L instanceof t)
        return L.loose === !!H.loose && L.includePrerelease === !!H.includePrerelease ? L : new t(L.raw, H);
      if (L instanceof o)
        return this.raw = L.value, this.set = [[L]], this.formatted = void 0, this;
      if (this.options = H, this.loose = !!H.loose, this.includePrerelease = !!H.includePrerelease, this.raw = L.trim().replace(e, " "), this.set = this.raw.split("||").map((U) => this.parseRange(U.trim())).filter((U) => U.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const U = this.set[0];
        if (this.set = this.set.filter((K) => !$(K[0])), this.set.length === 0)
          this.set = [U];
        else if (this.set.length > 1) {
          for (const K of this.set)
            if (K.length === 1 && v(K[0])) {
              this.set = [K];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let L = 0; L < this.set.length; L++) {
          L > 0 && (this.formatted += "||");
          const H = this.set[L];
          for (let U = 0; U < H.length; U++)
            U > 0 && (this.formatted += " "), this.formatted += H[U].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(L) {
      const U = ((this.options.includePrerelease && p) | (this.options.loose && g)) + ":" + L, K = n.get(U);
      if (K)
        return K;
      const B = this.options.loose, R = B ? c[u.HYPHENRANGELOOSE] : c[u.HYPHENRANGE];
      L = L.replace(R, x(this.options.includePrerelease)), a("hyphen replace", L), L = L.replace(c[u.COMPARATORTRIM], l), a("comparator trim", L), L = L.replace(c[u.TILDETRIM], f), a("tilde trim", L), L = L.replace(c[u.CARETTRIM], h), a("caret trim", L);
      let b = L.split(" ").map((m) => E(m, this.options)).join(" ").split(/\s+/).map((m) => M(m, this.options));
      B && (b = b.filter((m) => (a("loose invalid filter", m, this.options), !!m.match(c[u.COMPARATORLOOSE])))), a("range list", b);
      const O = /* @__PURE__ */ new Map(), S = b.map((m) => new o(m, this.options));
      for (const m of S) {
        if ($(m))
          return [m];
        O.set(m.value, m);
      }
      O.size > 1 && O.has("") && O.delete("");
      const d = [...O.values()];
      return n.set(U, d), d;
    }
    intersects(L, H) {
      if (!(L instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((U) => y(U, H) && L.set.some((K) => y(K, H) && U.every((B) => K.every((R) => B.intersects(R, H)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(L) {
      if (!L)
        return !1;
      if (typeof L == "string")
        try {
          L = new s(L, this.options);
        } catch {
          return !1;
        }
      for (let H = 0; H < this.set.length; H++)
        if (J(this.set[H], L, this.options))
          return !0;
      return !1;
    }
  }
  Mc = t;
  const r = gR, n = new r(), i = Xf, o = Qs(), a = Xs, s = gt, {
    safeRe: c,
    t: u,
    comparatorTrimReplace: l,
    tildeTrimReplace: f,
    caretTrimReplace: h
  } = Qo, { FLAG_INCLUDE_PRERELEASE: p, FLAG_LOOSE: g } = Ys, $ = (F) => F.value === "<0.0.0-0", v = (F) => F.value === "", y = (F, L) => {
    let H = !0;
    const U = F.slice();
    let K = U.pop();
    for (; H && U.length; )
      H = U.every((B) => K.intersects(B, L)), K = U.pop();
    return H;
  }, E = (F, L) => (F = F.replace(c[u.BUILD], ""), a("comp", F, L), F = V(F, L), a("caret", F), F = C(F, L), a("tildes", F), F = G(F, L), a("xrange", F), F = W(F, L), a("stars", F), F), A = (F) => !F || F.toLowerCase() === "x" || F === "*", C = (F, L) => F.trim().split(/\s+/).map((H) => D(H, L)).join(" "), D = (F, L) => {
    const H = L.loose ? c[u.TILDELOOSE] : c[u.TILDE];
    return F.replace(H, (U, K, B, R, b) => {
      a("tilde", F, U, K, B, R, b);
      let O;
      return A(K) ? O = "" : A(B) ? O = `>=${K}.0.0 <${+K + 1}.0.0-0` : A(R) ? O = `>=${K}.${B}.0 <${K}.${+B + 1}.0-0` : b ? (a("replaceTilde pr", b), O = `>=${K}.${B}.${R}-${b} <${K}.${+B + 1}.0-0`) : O = `>=${K}.${B}.${R} <${K}.${+B + 1}.0-0`, a("tilde return", O), O;
    });
  }, V = (F, L) => F.trim().split(/\s+/).map((H) => z(H, L)).join(" "), z = (F, L) => {
    a("caret", F, L);
    const H = L.loose ? c[u.CARETLOOSE] : c[u.CARET], U = L.includePrerelease ? "-0" : "";
    return F.replace(H, (K, B, R, b, O) => {
      a("caret", F, K, B, R, b, O);
      let S;
      return A(B) ? S = "" : A(R) ? S = `>=${B}.0.0${U} <${+B + 1}.0.0-0` : A(b) ? B === "0" ? S = `>=${B}.${R}.0${U} <${B}.${+R + 1}.0-0` : S = `>=${B}.${R}.0${U} <${+B + 1}.0.0-0` : O ? (a("replaceCaret pr", O), B === "0" ? R === "0" ? S = `>=${B}.${R}.${b}-${O} <${B}.${R}.${+b + 1}-0` : S = `>=${B}.${R}.${b}-${O} <${B}.${+R + 1}.0-0` : S = `>=${B}.${R}.${b}-${O} <${+B + 1}.0.0-0`) : (a("no pr"), B === "0" ? R === "0" ? S = `>=${B}.${R}.${b}${U} <${B}.${R}.${+b + 1}-0` : S = `>=${B}.${R}.${b}${U} <${B}.${+R + 1}.0-0` : S = `>=${B}.${R}.${b} <${+B + 1}.0.0-0`), a("caret return", S), S;
    });
  }, G = (F, L) => (a("replaceXRanges", F, L), F.split(/\s+/).map((H) => N(H, L)).join(" ")), N = (F, L) => {
    F = F.trim();
    const H = L.loose ? c[u.XRANGELOOSE] : c[u.XRANGE];
    return F.replace(H, (U, K, B, R, b, O) => {
      a("xRange", F, U, K, B, R, b, O);
      const S = A(B), d = S || A(R), m = d || A(b), P = m;
      return K === "=" && P && (K = ""), O = L.includePrerelease ? "-0" : "", S ? K === ">" || K === "<" ? U = "<0.0.0-0" : U = "*" : K && P ? (d && (R = 0), b = 0, K === ">" ? (K = ">=", d ? (B = +B + 1, R = 0, b = 0) : (R = +R + 1, b = 0)) : K === "<=" && (K = "<", d ? B = +B + 1 : R = +R + 1), K === "<" && (O = "-0"), U = `${K + B}.${R}.${b}${O}`) : d ? U = `>=${B}.0.0${O} <${+B + 1}.0.0-0` : m && (U = `>=${B}.${R}.0${O} <${B}.${+R + 1}.0-0`), a("xRange return", U), U;
    });
  }, W = (F, L) => (a("replaceStars", F, L), F.trim().replace(c[u.STAR], "")), M = (F, L) => (a("replaceGTE0", F, L), F.trim().replace(c[L.includePrerelease ? u.GTE0PRE : u.GTE0], "")), x = (F) => (L, H, U, K, B, R, b, O, S, d, m, P) => (A(U) ? H = "" : A(K) ? H = `>=${U}.0.0${F ? "-0" : ""}` : A(B) ? H = `>=${U}.${K}.0${F ? "-0" : ""}` : R ? H = `>=${H}` : H = `>=${H}${F ? "-0" : ""}`, A(S) ? O = "" : A(d) ? O = `<${+S + 1}.0.0-0` : A(m) ? O = `<${S}.${+d + 1}.0-0` : P ? O = `<=${S}.${d}.${m}-${P}` : F ? O = `<${S}.${d}.${+m + 1}-0` : O = `<=${O}`, `${H} ${O}`.trim()), J = (F, L, H) => {
    for (let U = 0; U < F.length; U++)
      if (!F[U].test(L))
        return !1;
    if (L.prerelease.length && !H.includePrerelease) {
      for (let U = 0; U < F.length; U++)
        if (a(F[U].semver), F[U].semver !== o.ANY && F[U].semver.prerelease.length > 0) {
          const K = F[U].semver;
          if (K.major === L.major && K.minor === L.minor && K.patch === L.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Mc;
}
var xc, op;
function Qs() {
  if (op) return xc;
  op = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, f) {
      if (f = r(f), l instanceof t) {
        if (l.loose === !!f.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), a("comparator", l, f), this.options = f, this.loose = !!f.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(l) {
      const f = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], h = l.match(f);
      if (!h)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = h[1] !== void 0 ? h[1] : "", this.operator === "=" && (this.operator = ""), h[2] ? this.semver = new s(h[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (a("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new s(l, this.options);
        } catch {
          return !1;
        }
      return o(l, this.operator, this.semver, this.options);
    }
    intersects(l, f) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(l.value, f).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new c(this.value, f).test(l.semver) : (f = r(f), f.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || o(this.semver, "<", l.semver, f) && this.operator.startsWith(">") && l.operator.startsWith("<") || o(this.semver, ">", l.semver, f) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  xc = t;
  const r = Xf, { safeRe: n, t: i } = Qo, o = n0, a = Xs, s = gt, c = ir();
  return xc;
}
const vR = ir(), _R = (e, t, r) => {
  try {
    t = new vR(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Zs = _R;
const $R = ir(), wR = (e, t) => new $R(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var ER = wR;
const bR = gt, SR = ir(), PR = (e, t, r) => {
  let n = null, i = null, o = null;
  try {
    o = new SR(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || i.compare(a) === -1) && (n = a, i = new bR(n, r));
  }), n;
};
var TR = PR;
const OR = gt, AR = ir(), NR = (e, t, r) => {
  let n = null, i = null, o = null;
  try {
    o = new AR(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || i.compare(a) === 1) && (n = a, i = new OR(n, r));
  }), n;
};
var IR = NR;
const Vc = gt, CR = ir(), ap = Js, RR = (e, t) => {
  e = new CR(e, t);
  let r = new Vc("0.0.0");
  if (e.test(r) || (r = new Vc("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let o = null;
    i.forEach((a) => {
      const s = new Vc(a.semver.version);
      switch (a.operator) {
        case ">":
          s.prerelease.length === 0 ? s.patch++ : s.prerelease.push(0), s.raw = s.format();
        case "":
        case ">=":
          (!o || ap(s, o)) && (o = s);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!r || ap(r, o)) && (r = o);
  }
  return r && e.test(r) ? r : null;
};
var DR = RR;
const kR = ir(), jR = (e, t) => {
  try {
    return new kR(e, t).range || "*";
  } catch {
    return null;
  }
};
var FR = jR;
const LR = gt, i0 = Qs(), { ANY: UR } = i0, MR = ir(), xR = Zs, sp = Js, cp = Qf, VR = ed, qR = Zf, BR = (e, t, r, n) => {
  e = new LR(e, n), t = new MR(t, n);
  let i, o, a, s, c;
  switch (r) {
    case ">":
      i = sp, o = VR, a = cp, s = ">", c = ">=";
      break;
    case "<":
      i = cp, o = qR, a = sp, s = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (xR(e, t, n))
    return !1;
  for (let u = 0; u < t.set.length; ++u) {
    const l = t.set[u];
    let f = null, h = null;
    if (l.forEach((p) => {
      p.semver === UR && (p = new i0(">=0.0.0")), f = f || p, h = h || p, i(p.semver, f.semver, n) ? f = p : a(p.semver, h.semver, n) && (h = p);
    }), f.operator === s || f.operator === c || (!h.operator || h.operator === s) && o(e, h.semver))
      return !1;
    if (h.operator === c && a(e, h.semver))
      return !1;
  }
  return !0;
};
var td = BR;
const HR = td, zR = (e, t, r) => HR(e, t, ">", r);
var GR = zR;
const KR = td, WR = (e, t, r) => KR(e, t, "<", r);
var YR = WR;
const lp = ir(), XR = (e, t, r) => (e = new lp(e, r), t = new lp(t, r), e.intersects(t, r));
var JR = XR;
const QR = Zs, ZR = nr;
var eD = (e, t, r) => {
  const n = [];
  let i = null, o = null;
  const a = e.sort((l, f) => ZR(l, f, r));
  for (const l of a)
    QR(l, t, r) ? (o = l, i || (i = l)) : (o && n.push([i, o]), o = null, i = null);
  i && n.push([i, null]);
  const s = [];
  for (const [l, f] of n)
    l === f ? s.push(l) : !f && l === a[0] ? s.push("*") : f ? l === a[0] ? s.push(`<=${f}`) : s.push(`${l} - ${f}`) : s.push(`>=${l}`);
  const c = s.join(" || "), u = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < u.length ? c : t;
};
const up = ir(), rd = Qs(), { ANY: qc } = rd, to = Zs, nd = nr, tD = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new up(e, r), t = new up(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const a = nD(i, o, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, rD = [new rd(">=0.0.0-0")], fp = [new rd(">=0.0.0")], nD = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === qc) {
    if (t.length === 1 && t[0].semver === qc)
      return !0;
    r.includePrerelease ? e = rD : e = fp;
  }
  if (t.length === 1 && t[0].semver === qc) {
    if (r.includePrerelease)
      return !0;
    t = fp;
  }
  const n = /* @__PURE__ */ new Set();
  let i, o;
  for (const p of e)
    p.operator === ">" || p.operator === ">=" ? i = dp(i, p, r) : p.operator === "<" || p.operator === "<=" ? o = hp(o, p, r) : n.add(p.semver);
  if (n.size > 1)
    return null;
  let a;
  if (i && o) {
    if (a = nd(i.semver, o.semver, r), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const p of n) {
    if (i && !to(p, String(i), r) || o && !to(p, String(o), r))
      return null;
    for (const g of t)
      if (!to(p, String(g), r))
        return !1;
    return !0;
  }
  let s, c, u, l, f = o && !r.includePrerelease && o.semver.prerelease.length ? o.semver : !1, h = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const p of t) {
    if (l = l || p.operator === ">" || p.operator === ">=", u = u || p.operator === "<" || p.operator === "<=", i) {
      if (h && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === h.major && p.semver.minor === h.minor && p.semver.patch === h.patch && (h = !1), p.operator === ">" || p.operator === ">=") {
        if (s = dp(i, p, r), s === p && s !== i)
          return !1;
      } else if (i.operator === ">=" && !to(i.semver, String(p), r))
        return !1;
    }
    if (o) {
      if (f && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === f.major && p.semver.minor === f.minor && p.semver.patch === f.patch && (f = !1), p.operator === "<" || p.operator === "<=") {
        if (c = hp(o, p, r), c === p && c !== o)
          return !1;
      } else if (o.operator === "<=" && !to(o.semver, String(p), r))
        return !1;
    }
    if (!p.operator && (o || i) && a !== 0)
      return !1;
  }
  return !(i && u && !o && a !== 0 || o && l && !i && a !== 0 || h || f);
}, dp = (e, t, r) => {
  if (!e)
    return t;
  const n = nd(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, hp = (e, t, r) => {
  if (!e)
    return t;
  const n = nd(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var iD = tD;
const Bc = Qo, pp = Ys, oD = gt, mp = e0, aD = qi, sD = hC, cD = yC, lD = vC, uD = $C, fD = bC, dD = TC, hD = NC, pD = RC, mD = nr, yD = FC, gD = MC, vD = Jf, _D = BC, $D = GC, wD = Js, ED = Qf, bD = t0, SD = r0, PD = Zf, TD = ed, OD = n0, AD = mR, ND = Qs(), ID = ir(), CD = Zs, RD = ER, DD = TR, kD = IR, jD = DR, FD = FR, LD = td, UD = GR, MD = YR, xD = JR, VD = eD, qD = iD;
var id = {
  parse: aD,
  valid: sD,
  clean: cD,
  inc: lD,
  diff: uD,
  major: fD,
  minor: dD,
  patch: hD,
  prerelease: pD,
  compare: mD,
  rcompare: yD,
  compareLoose: gD,
  compareBuild: vD,
  sort: _D,
  rsort: $D,
  gt: wD,
  lt: ED,
  eq: bD,
  neq: SD,
  gte: PD,
  lte: TD,
  cmp: OD,
  coerce: AD,
  Comparator: ND,
  Range: ID,
  satisfies: CD,
  toComparators: RD,
  maxSatisfying: DD,
  minSatisfying: kD,
  minVersion: jD,
  validRange: FD,
  outside: LD,
  gtr: UD,
  ltr: MD,
  intersects: xD,
  simplifyRange: VD,
  subset: qD,
  SemVer: oD,
  re: Bc.re,
  src: Bc.src,
  tokens: Bc.t,
  SEMVER_SPEC_VERSION: pp.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: pp.RELEASE_TYPES,
  compareIdentifiers: mp.compareIdentifiers,
  rcompareIdentifiers: mp.rcompareIdentifiers
};
const ei = /* @__PURE__ */ ly(id), BD = Object.prototype.toString, HD = "[object Uint8Array]", zD = "[object ArrayBuffer]";
function o0(e, t, r) {
  return e ? e.constructor === t ? !0 : BD.call(e) === r : !1;
}
function a0(e) {
  return o0(e, Uint8Array, HD);
}
function GD(e) {
  return o0(e, ArrayBuffer, zD);
}
function KD(e) {
  return a0(e) || GD(e);
}
function WD(e) {
  if (!a0(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function YD(e) {
  if (!KD(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Hc(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((i, o) => i + o.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const i of e)
    WD(i), r.set(i, n), n += i.length;
  return r;
}
const ka = {
  utf8: new globalThis.TextDecoder("utf8")
};
function ja(e, t = "utf8") {
  return YD(e), ka[t] ?? (ka[t] = new globalThis.TextDecoder(t)), ka[t].decode(e);
}
function XD(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const JD = new globalThis.TextEncoder();
function Fa(e) {
  return XD(e), JD.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const zc = "aes-256-cbc", Kr = () => /* @__PURE__ */ Object.create(null), yp = (e) => e !== void 0, Gc = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Xr = "__internal__", Kc = `${Xr}.migrations.version`;
var en, Xt, Et, Mt, Fn, Ln, bi, cr, ze, s0, c0, l0, u0, f0, d0, h0, p0;
class QD {
  constructor(t = {}) {
    ar(this, ze);
    Xi(this, "path");
    Xi(this, "events");
    ar(this, en);
    ar(this, Xt);
    ar(this, Et);
    ar(this, Mt, {});
    ar(this, Fn, !1);
    ar(this, Ln);
    ar(this, bi);
    ar(this, cr);
    Xi(this, "_deserialize", (t) => JSON.parse(t));
    Xi(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = br(this, ze, s0).call(this, t);
    Ct(this, Et, r), br(this, ze, c0).call(this, r), br(this, ze, u0).call(this, r), br(this, ze, f0).call(this, r), this.events = new EventTarget(), Ct(this, Xt, r.encryptionKey), this.path = br(this, ze, d0).call(this, r), br(this, ze, h0).call(this, r), r.watch && this._watch();
  }
  get(t, r) {
    if (ce(this, Et).accessPropertiesByDotNotation)
      return this._get(t, r);
    const { store: n } = this;
    return t in n ? n[t] : r;
  }
  set(t, r) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && r === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${Xr} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, i = (o, a) => {
      if (Gc(o, a), ce(this, Et).accessPropertiesByDotNotation)
        ma(n, o, a);
      else {
        if (o === "__proto__" || o === "constructor" || o === "prototype")
          return;
        n[o] = a;
      }
    };
    if (typeof t == "object") {
      const o = t;
      for (const [a, s] of Object.entries(o))
        i(a, s);
    } else
      i(t, r);
    this.store = n;
  }
  has(t) {
    return ce(this, Et).accessPropertiesByDotNotation ? Pc(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    Gc(t, r);
    const n = ce(this, Et).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
    if (!Array.isArray(n))
      throw new TypeError(`The key \`${t}\` is already set to a non-array value`);
    this.set(t, [...n, r]);
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      yp(ce(this, Mt)[r]) && this.set(r, ce(this, Mt)[r]);
  }
  delete(t) {
    const { store: r } = this;
    ce(this, Et).accessPropertiesByDotNotation ? P$(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = Kr();
    for (const r of Object.keys(ce(this, Mt)))
      yp(ce(this, Mt)[r]) && (Gc(r, ce(this, Mt)[r]), ce(this, Et).accessPropertiesByDotNotation ? ma(t, r, ce(this, Mt)[r]) : t[r] = ce(this, Mt)[r]);
    this.store = t;
  }
  onDidChange(t, r) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof r != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof r}`);
    return this._handleValueChange(() => this.get(t), r);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleStoreChange(t);
  }
  get size() {
    return Object.keys(this.store).filter((r) => !this._isReservedKeyPath(r)).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    var t;
    try {
      const r = se.readFileSync(this.path, ce(this, Xt) ? null : "utf8"), n = this._decryptData(r), i = this._deserialize(n);
      return ce(this, Fn) || this._validate(i), Object.assign(Kr(), i);
    } catch (r) {
      if ((r == null ? void 0 : r.code) === "ENOENT")
        return this._ensureDirectory(), Kr();
      if (ce(this, Et).clearInvalidConfig) {
        const n = r;
        if (n.name === "SyntaxError" || (t = n.message) != null && t.startsWith("Config schema violation:"))
          return Kr();
      }
      throw r;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !Pc(t, Xr))
      try {
        const r = se.readFileSync(this.path, ce(this, Xt) ? null : "utf8"), n = this._decryptData(r), i = this._deserialize(n);
        Pc(i, Xr) && ma(t, Xr, Yd(i, Xr));
      } catch {
      }
    ce(this, Fn) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    ce(this, Ln) && (ce(this, Ln).close(), Ct(this, Ln, void 0)), ce(this, bi) && (se.unwatchFile(this.path), Ct(this, bi, !1)), Ct(this, cr, void 0);
  }
  _decryptData(t) {
    if (!ce(this, Xt))
      return typeof t == "string" ? t : ja(t);
    try {
      const r = t.slice(0, 16), n = Pr.pbkdf2Sync(ce(this, Xt), r, 1e4, 32, "sha512"), i = Pr.createDecipheriv(zc, n, r), o = t.slice(17), a = typeof o == "string" ? Fa(o) : o;
      return ja(Hc([i.update(a), i.final()]));
    } catch {
      try {
        const r = t.slice(0, 16), n = Pr.pbkdf2Sync(ce(this, Xt), r.toString(), 1e4, 32, "sha512"), i = Pr.createDecipheriv(zc, n, r), o = t.slice(17), a = typeof o == "string" ? Fa(o) : o;
        return ja(Hc([i.update(a), i.final()]));
      } catch {
      }
    }
    return typeof t == "string" ? t : ja(t);
  }
  _handleStoreChange(t) {
    let r = this.store;
    const n = () => {
      const i = r, o = this.store;
      Kd(o, i) || (r = o, t.call(this, o, i));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, r) {
    let n = t();
    const i = () => {
      const o = n, a = t();
      Kd(a, o) || (n = a, r.call(this, a, o));
    };
    return this.events.addEventListener("change", i), () => {
      this.events.removeEventListener("change", i);
    };
  }
  _validate(t) {
    if (!ce(this, en) || ce(this, en).call(this, t) || !ce(this, en).errors)
      return;
    const n = ce(this, en).errors.map(({ instancePath: i, message: o = "" }) => `\`${i.slice(1)}\` ${o}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    se.mkdirSync(ie.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    if (ce(this, Xt)) {
      const n = Pr.randomBytes(16), i = Pr.pbkdf2Sync(ce(this, Xt), n, 1e4, 32, "sha512"), o = Pr.createCipheriv(zc, i, n);
      r = Hc([n, Fa(":"), o.update(Fa(r)), o.final()]);
    }
    if (Ie.env.SNAP)
      se.writeFileSync(this.path, r, { mode: ce(this, Et).configFileMode });
    else
      try {
        cy(this.path, r, { mode: ce(this, Et).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          se.writeFileSync(this.path, r, { mode: ce(this, Et).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    if (this._ensureDirectory(), se.existsSync(this.path) || this._write(Kr()), Ie.platform === "win32" || Ie.platform === "darwin") {
      ce(this, cr) ?? Ct(this, cr, Xh(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = ie.dirname(this.path), r = ie.basename(this.path);
      Ct(this, Ln, se.watch(t, { persistent: !1, encoding: "utf8" }, (n, i) => {
        i && i !== r || typeof ce(this, cr) == "function" && ce(this, cr).call(this);
      }));
    } else
      ce(this, cr) ?? Ct(this, cr, Xh(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), se.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof ce(this, cr) == "function" && ce(this, cr).call(this);
      }), Ct(this, bi, !0);
  }
  _migrate(t, r, n) {
    let i = this._get(Kc, "0.0.0");
    const o = Object.keys(t).filter((s) => this._shouldPerformMigration(s, i, r));
    let a = structuredClone(this.store);
    for (const s of o)
      try {
        n && n(this, {
          fromVersion: i,
          toVersion: s,
          finalVersion: r,
          versions: o
        });
        const c = t[s];
        c == null || c(this), this._set(Kc, s), i = s, a = structuredClone(this.store);
      } catch (c) {
        this.store = a;
        try {
          this._write(a);
        } catch {
        }
        const u = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${u}`);
      }
    (this._isVersionInRangeFormat(i) || !ei.eq(i, r)) && this._set(Kc, r);
  }
  _containsReservedKey(t) {
    return typeof t == "string" ? this._isReservedKeyPath(t) : !t || typeof t != "object" ? !1 : this._objectContainsReservedKey(t);
  }
  _objectContainsReservedKey(t) {
    if (!t || typeof t != "object")
      return !1;
    for (const [r, n] of Object.entries(t))
      if (this._isReservedKeyPath(r) || this._objectContainsReservedKey(n))
        return !0;
    return !1;
  }
  _isReservedKeyPath(t) {
    return t === Xr || t.startsWith(`${Xr}.`);
  }
  _isVersionInRangeFormat(t) {
    return ei.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && ei.satisfies(r, t) ? !1 : ei.satisfies(n, t) : !(ei.lte(t, r) || ei.gt(t, n));
  }
  _get(t, r) {
    return Yd(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    ma(n, t, r), this.store = n;
  }
}
en = new WeakMap(), Xt = new WeakMap(), Et = new WeakMap(), Mt = new WeakMap(), Fn = new WeakMap(), Ln = new WeakMap(), bi = new WeakMap(), cr = new WeakMap(), ze = new WeakSet(), s0 = function(t) {
  const r = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (!r.cwd) {
    if (!r.projectName)
      throw new Error("Please specify the `projectName` option.");
    r.cwd = N$(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, c0 = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = BI.default, n = new IT.Ajv2020({
    allErrors: !0,
    useDefaults: !0,
    ...t.ajvOptions
  });
  r(n);
  const i = {
    ...t.rootSchema,
    type: "object",
    properties: t.schema
  };
  Ct(this, en, n.compile(i)), br(this, ze, l0).call(this, t.schema);
}, l0 = function(t) {
  const r = Object.entries(t ?? {});
  for (const [n, i] of r) {
    if (!i || typeof i != "object" || !Object.hasOwn(i, "default"))
      continue;
    const { default: o } = i;
    o !== void 0 && (ce(this, Mt)[n] = o);
  }
}, u0 = function(t) {
  t.defaults && Object.assign(ce(this, Mt), t.defaults);
}, f0 = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, d0 = function(t) {
  const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
  return ie.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
}, h0 = function(t) {
  if (t.migrations) {
    br(this, ze, p0).call(this, t), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(Kr(), t.defaults ?? {}, r);
  this._validate(n);
  try {
    Wd.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, p0 = function(t) {
  const { migrations: r, projectVersion: n } = t;
  if (r) {
    if (!n)
      throw new Error("Please specify the `projectVersion` option.");
    Ct(this, Fn, !0);
    try {
      const i = this.store, o = Object.assign(Kr(), t.defaults ?? {}, i);
      try {
        Wd.deepEqual(i, o);
      } catch {
        this._write(o);
      }
      this._migrate(r, n, t.beforeEachMigration);
    } finally {
      Ct(this, Fn, !1);
    }
  }
};
const { app: ns, ipcMain: xl, shell: ZD } = Cr;
let gp = !1;
const vp = () => {
  if (!xl || !ns)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: ns.getPath("userData"),
    appVersion: ns.getVersion()
  };
  return gp || (xl.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), gp = !0), e;
};
class ek extends QD {
  constructor(t) {
    let r, n;
    if (Ie.type === "renderer") {
      const i = Cr.ipcRenderer.sendSync("electron-store-get-data");
      if (!i)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = i);
    } else xl && ns && ({ defaultCwd: r, appVersion: n } = vp());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = ie.isAbsolute(t.cwd) ? t.cwd : ie.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    vp();
  }
  async openInEditor() {
    const t = await ZD.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
function tk(e) {
  var t, r;
  return e && typeof e == "string" && e.length >= 8 ? e : ((r = (t = Pr).randomUUID) == null ? void 0 : r.call(t)) ?? Pr.randomBytes(16).toString("hex");
}
const ro = new ek({
  name: "twitch-sorteos",
  defaults: {
    license: {},
    // ⬅️ SIEMPRE vacío al inicio
    deviceId: "pending"
  }
}), no = {
  // ✅ DEVICE ID
  getDeviceId() {
    const e = ro.get("deviceId"), t = tk(e);
    return t !== e && ro.set("deviceId", t), t;
  },
  // ✅ LICENSE
  get() {
    return ro.get("license");
  },
  set(e) {
    ro.set("license", e);
  },
  clear() {
    ro.set("license", {});
  }
};
var m0 = { exports: {} };
(function(e, t) {
  (function(r, n) {
    e.exports = n(Si, xn);
  })(ct, function(r, n) {
    return function(i) {
      function o(s) {
        if (a[s]) return a[s].exports;
        var c = a[s] = { exports: {}, id: s, loaded: !1 };
        return i[s].call(c.exports, c, c.exports, o), c.loaded = !0, c.exports;
      }
      var a = {};
      return o.m = i, o.c = a, o.p = "", o(0);
    }([function(i, o, a) {
      i.exports = a(34);
    }, function(i, o, a) {
      var s = a(29)("wks"), c = a(33), u = a(2).Symbol, l = typeof u == "function", f = i.exports = function(h) {
        return s[h] || (s[h] = l && u[h] || (l ? u : c)("Symbol." + h));
      };
      f.store = s;
    }, function(i, o) {
      var a = i.exports = typeof window < "u" && window.Math == Math ? window : typeof self < "u" && self.Math == Math ? self : Function("return this")();
      typeof __g == "number" && (__g = a);
    }, function(i, o, a) {
      var s = a(9);
      i.exports = function(c) {
        if (!s(c)) throw TypeError(c + " is not an object!");
        return c;
      };
    }, function(i, o, a) {
      i.exports = !a(24)(function() {
        return Object.defineProperty({}, "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    }, function(i, o, a) {
      var s = a(12), c = a(17);
      i.exports = a(4) ? function(u, l, f) {
        return s.f(u, l, c(1, f));
      } : function(u, l, f) {
        return u[l] = f, u;
      };
    }, function(i, o) {
      var a = i.exports = { version: "2.4.0" };
      typeof __e == "number" && (__e = a);
    }, function(i, o, a) {
      var s = a(14);
      i.exports = function(c, u, l) {
        if (s(c), u === void 0) return c;
        switch (l) {
          case 1:
            return function(f) {
              return c.call(u, f);
            };
          case 2:
            return function(f, h) {
              return c.call(u, f, h);
            };
          case 3:
            return function(f, h, p) {
              return c.call(u, f, h, p);
            };
        }
        return function() {
          return c.apply(u, arguments);
        };
      };
    }, function(i, o) {
      var a = {}.hasOwnProperty;
      i.exports = function(s, c) {
        return a.call(s, c);
      };
    }, function(i, o) {
      i.exports = function(a) {
        return typeof a == "object" ? a !== null : typeof a == "function";
      };
    }, function(i, o) {
      i.exports = {};
    }, function(i, o) {
      var a = {}.toString;
      i.exports = function(s) {
        return a.call(s).slice(8, -1);
      };
    }, function(i, o, a) {
      var s = a(3), c = a(26), u = a(32), l = Object.defineProperty;
      o.f = a(4) ? Object.defineProperty : function(f, h, p) {
        if (s(f), h = u(h, !0), s(p), c) try {
          return l(f, h, p);
        } catch {
        }
        if ("get" in p || "set" in p) throw TypeError("Accessors not supported!");
        return "value" in p && (f[h] = p.value), f;
      };
    }, function(i, o, a) {
      var s = a(42), c = a(15);
      i.exports = function(u) {
        return s(c(u));
      };
    }, function(i, o) {
      i.exports = function(a) {
        if (typeof a != "function") throw TypeError(a + " is not a function!");
        return a;
      };
    }, function(i, o) {
      i.exports = function(a) {
        if (a == null) throw TypeError("Can't call method on  " + a);
        return a;
      };
    }, function(i, o, a) {
      var s = a(9), c = a(2).document, u = s(c) && s(c.createElement);
      i.exports = function(l) {
        return u ? c.createElement(l) : {};
      };
    }, function(i, o) {
      i.exports = function(a, s) {
        return { enumerable: !(1 & a), configurable: !(2 & a), writable: !(4 & a), value: s };
      };
    }, function(i, o, a) {
      var s = a(12).f, c = a(8), u = a(1)("toStringTag");
      i.exports = function(l, f, h) {
        l && !c(l = h ? l : l.prototype, u) && s(l, u, { configurable: !0, value: f });
      };
    }, function(i, o, a) {
      var s = a(29)("keys"), c = a(33);
      i.exports = function(u) {
        return s[u] || (s[u] = c(u));
      };
    }, function(i, o) {
      var a = Math.ceil, s = Math.floor;
      i.exports = function(c) {
        return isNaN(c = +c) ? 0 : (c > 0 ? s : a)(c);
      };
    }, function(i, o, a) {
      var s = a(11), c = a(1)("toStringTag"), u = s(/* @__PURE__ */ function() {
        return arguments;
      }()) == "Arguments", l = function(f, h) {
        try {
          return f[h];
        } catch {
        }
      };
      i.exports = function(f) {
        var h, p, g;
        return f === void 0 ? "Undefined" : f === null ? "Null" : typeof (p = l(h = Object(f), c)) == "string" ? p : u ? s(h) : (g = s(h)) == "Object" && typeof h.callee == "function" ? "Arguments" : g;
      };
    }, function(i, o) {
      i.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
    }, function(i, o, a) {
      var s = a(2), c = a(6), u = a(7), l = a(5), f = "prototype", h = function(p, g, $) {
        var v, y, E, A = p & h.F, C = p & h.G, D = p & h.S, V = p & h.P, z = p & h.B, G = p & h.W, N = C ? c : c[g] || (c[g] = {}), W = N[f], M = C ? s : D ? s[g] : (s[g] || {})[f];
        C && ($ = g);
        for (v in $) y = !A && M && M[v] !== void 0, y && v in N || (E = y ? M[v] : $[v], N[v] = C && typeof M[v] != "function" ? $[v] : z && y ? u(E, s) : G && M[v] == E ? function(x) {
          var J = function(F, L, H) {
            if (this instanceof x) {
              switch (arguments.length) {
                case 0:
                  return new x();
                case 1:
                  return new x(F);
                case 2:
                  return new x(F, L);
              }
              return new x(F, L, H);
            }
            return x.apply(this, arguments);
          };
          return J[f] = x[f], J;
        }(E) : V && typeof E == "function" ? u(Function.call, E) : E, V && ((N.virtual || (N.virtual = {}))[v] = E, p & h.R && W && !W[v] && l(W, v, E)));
      };
      h.F = 1, h.G = 2, h.S = 4, h.P = 8, h.B = 16, h.W = 32, h.U = 64, h.R = 128, i.exports = h;
    }, function(i, o) {
      i.exports = function(a) {
        try {
          return !!a();
        } catch {
          return !0;
        }
      };
    }, function(i, o, a) {
      i.exports = a(2).document && document.documentElement;
    }, function(i, o, a) {
      i.exports = !a(4) && !a(24)(function() {
        return Object.defineProperty(a(16)("div"), "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    }, function(i, o, a) {
      var s = a(28), c = a(23), u = a(57), l = a(5), f = a(8), h = a(10), p = a(45), g = a(18), $ = a(52), v = a(1)("iterator"), y = !([].keys && "next" in [].keys()), E = "@@iterator", A = "keys", C = "values", D = function() {
        return this;
      };
      i.exports = function(V, z, G, N, W, M, x) {
        p(G, z, N);
        var J, F, L, H = function(m) {
          if (!y && m in R) return R[m];
          switch (m) {
            case A:
              return function() {
                return new G(this, m);
              };
            case C:
              return function() {
                return new G(this, m);
              };
          }
          return function() {
            return new G(this, m);
          };
        }, U = z + " Iterator", K = W == C, B = !1, R = V.prototype, b = R[v] || R[E] || W && R[W], O = b || H(W), S = W ? K ? H("entries") : O : void 0, d = z == "Array" && R.entries || b;
        if (d && (L = $(d.call(new V())), L !== Object.prototype && (g(L, U, !0), s || f(L, v) || l(L, v, D))), K && b && b.name !== C && (B = !0, O = function() {
          return b.call(this);
        }), s && !x || !y && !B && R[v] || l(R, v, O), h[z] = O, h[U] = D, W) if (J = { values: K ? O : H(C), keys: M ? O : H(A), entries: S }, x) for (F in J) F in R || u(R, F, J[F]);
        else c(c.P + c.F * (y || B), z, J);
        return J;
      };
    }, function(i, o) {
      i.exports = !0;
    }, function(i, o, a) {
      var s = a(2), c = "__core-js_shared__", u = s[c] || (s[c] = {});
      i.exports = function(l) {
        return u[l] || (u[l] = {});
      };
    }, function(i, o, a) {
      var s, c, u, l = a(7), f = a(41), h = a(25), p = a(16), g = a(2), $ = g.process, v = g.setImmediate, y = g.clearImmediate, E = g.MessageChannel, A = 0, C = {}, D = "onreadystatechange", V = function() {
        var G = +this;
        if (C.hasOwnProperty(G)) {
          var N = C[G];
          delete C[G], N();
        }
      }, z = function(G) {
        V.call(G.data);
      };
      v && y || (v = function(G) {
        for (var N = [], W = 1; arguments.length > W; ) N.push(arguments[W++]);
        return C[++A] = function() {
          f(typeof G == "function" ? G : Function(G), N);
        }, s(A), A;
      }, y = function(G) {
        delete C[G];
      }, a(11)($) == "process" ? s = function(G) {
        $.nextTick(l(V, G, 1));
      } : E ? (c = new E(), u = c.port2, c.port1.onmessage = z, s = l(u.postMessage, u, 1)) : g.addEventListener && typeof postMessage == "function" && !g.importScripts ? (s = function(G) {
        g.postMessage(G + "", "*");
      }, g.addEventListener("message", z, !1)) : s = D in p("script") ? function(G) {
        h.appendChild(p("script"))[D] = function() {
          h.removeChild(this), V.call(G);
        };
      } : function(G) {
        setTimeout(l(V, G, 1), 0);
      }), i.exports = { set: v, clear: y };
    }, function(i, o, a) {
      var s = a(20), c = Math.min;
      i.exports = function(u) {
        return u > 0 ? c(s(u), 9007199254740991) : 0;
      };
    }, function(i, o, a) {
      var s = a(9);
      i.exports = function(c, u) {
        if (!s(c)) return c;
        var l, f;
        if (u && typeof (l = c.toString) == "function" && !s(f = l.call(c)) || typeof (l = c.valueOf) == "function" && !s(f = l.call(c)) || !u && typeof (l = c.toString) == "function" && !s(f = l.call(c))) return f;
        throw TypeError("Can't convert object to primitive value");
      };
    }, function(i, o) {
      var a = 0, s = Math.random();
      i.exports = function(c) {
        return "Symbol(".concat(c === void 0 ? "" : c, ")_", (++a + s).toString(36));
      };
    }, function(i, o, a) {
      function s(D) {
        return D && D.__esModule ? D : { default: D };
      }
      function c() {
        return process.platform !== "win32" ? "" : process.arch === "ia32" && process.env.hasOwnProperty("PROCESSOR_ARCHITEW6432") ? "mixed" : "native";
      }
      function u(D) {
        return (0, v.createHash)("sha256").update(D).digest("hex");
      }
      function l(D) {
        switch (E) {
          case "darwin":
            return D.split("IOPlatformUUID")[1].split(`
`)[0].replace(/\=|\s+|\"/gi, "").toLowerCase();
          case "win32":
            return D.toString().split("REG_SZ")[1].replace(/\r+|\n+|\s+/gi, "").toLowerCase();
          case "linux":
            return D.toString().replace(/\r+|\n+|\s+/gi, "").toLowerCase();
          case "freebsd":
            return D.toString().replace(/\r+|\n+|\s+/gi, "").toLowerCase();
          default:
            throw new Error("Unsupported platform: " + process.platform);
        }
      }
      function f(D) {
        var V = l((0, $.execSync)(C[E]).toString());
        return D ? V : u(V);
      }
      function h(D) {
        return new g.default(function(V, z) {
          return (0, $.exec)(C[E], {}, function(G, N, W) {
            if (G) return z(new Error("Error while obtaining machine id: " + G.stack));
            var M = l(N.toString());
            return V(D ? M : u(M));
          });
        });
      }
      Object.defineProperty(o, "__esModule", { value: !0 });
      var p = a(35), g = s(p);
      o.machineIdSync = f, o.machineId = h;
      var $ = a(70), v = a(71), y = process, E = y.platform, A = { native: "%windir%\\System32", mixed: "%windir%\\sysnative\\cmd.exe /c %windir%\\System32" }, C = { darwin: "ioreg -rd1 -c IOPlatformExpertDevice", win32: A[c()] + "\\REG.exe QUERY HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography /v MachineGuid", linux: "( cat /var/lib/dbus/machine-id /etc/machine-id 2> /dev/null || hostname ) | head -n 1 || :", freebsd: "kenv -q smbios.system.uuid || sysctl -n kern.hostuuid" };
    }, function(i, o, a) {
      i.exports = { default: a(36), __esModule: !0 };
    }, function(i, o, a) {
      a(66), a(68), a(69), a(67), i.exports = a(6).Promise;
    }, function(i, o) {
      i.exports = function() {
      };
    }, function(i, o) {
      i.exports = function(a, s, c, u) {
        if (!(a instanceof s) || u !== void 0 && u in a) throw TypeError(c + ": incorrect invocation!");
        return a;
      };
    }, function(i, o, a) {
      var s = a(13), c = a(31), u = a(62);
      i.exports = function(l) {
        return function(f, h, p) {
          var g, $ = s(f), v = c($.length), y = u(p, v);
          if (l && h != h) {
            for (; v > y; ) if (g = $[y++], g != g) return !0;
          } else for (; v > y; y++) if ((l || y in $) && $[y] === h) return l || y || 0;
          return !l && -1;
        };
      };
    }, function(i, $, a) {
      var s = a(7), c = a(44), u = a(43), l = a(3), f = a(31), h = a(64), p = {}, g = {}, $ = i.exports = function(v, y, E, A, C) {
        var D, V, z, G, N = C ? function() {
          return v;
        } : h(v), W = s(E, A, y ? 2 : 1), M = 0;
        if (typeof N != "function") throw TypeError(v + " is not iterable!");
        if (u(N)) {
          for (D = f(v.length); D > M; M++) if (G = y ? W(l(V = v[M])[0], V[1]) : W(v[M]), G === p || G === g) return G;
        } else for (z = N.call(v); !(V = z.next()).done; ) if (G = c(z, W, V.value, y), G === p || G === g) return G;
      };
      $.BREAK = p, $.RETURN = g;
    }, function(i, o) {
      i.exports = function(a, s, c) {
        var u = c === void 0;
        switch (s.length) {
          case 0:
            return u ? a() : a.call(c);
          case 1:
            return u ? a(s[0]) : a.call(c, s[0]);
          case 2:
            return u ? a(s[0], s[1]) : a.call(c, s[0], s[1]);
          case 3:
            return u ? a(s[0], s[1], s[2]) : a.call(c, s[0], s[1], s[2]);
          case 4:
            return u ? a(s[0], s[1], s[2], s[3]) : a.call(c, s[0], s[1], s[2], s[3]);
        }
        return a.apply(c, s);
      };
    }, function(i, o, a) {
      var s = a(11);
      i.exports = Object("z").propertyIsEnumerable(0) ? Object : function(c) {
        return s(c) == "String" ? c.split("") : Object(c);
      };
    }, function(i, o, a) {
      var s = a(10), c = a(1)("iterator"), u = Array.prototype;
      i.exports = function(l) {
        return l !== void 0 && (s.Array === l || u[c] === l);
      };
    }, function(i, o, a) {
      var s = a(3);
      i.exports = function(c, u, l, f) {
        try {
          return f ? u(s(l)[0], l[1]) : u(l);
        } catch (p) {
          var h = c.return;
          throw h !== void 0 && s(h.call(c)), p;
        }
      };
    }, function(i, o, a) {
      var s = a(49), c = a(17), u = a(18), l = {};
      a(5)(l, a(1)("iterator"), function() {
        return this;
      }), i.exports = function(f, h, p) {
        f.prototype = s(l, { next: c(1, p) }), u(f, h + " Iterator");
      };
    }, function(i, o, a) {
      var s = a(1)("iterator"), c = !1;
      try {
        var u = [7][s]();
        u.return = function() {
          c = !0;
        }, Array.from(u, function() {
          throw 2;
        });
      } catch {
      }
      i.exports = function(l, f) {
        if (!f && !c) return !1;
        var h = !1;
        try {
          var p = [7], g = p[s]();
          g.next = function() {
            return { done: h = !0 };
          }, p[s] = function() {
            return g;
          }, l(p);
        } catch {
        }
        return h;
      };
    }, function(i, o) {
      i.exports = function(a, s) {
        return { value: s, done: !!a };
      };
    }, function(i, o, a) {
      var s = a(2), c = a(30).set, u = s.MutationObserver || s.WebKitMutationObserver, l = s.process, f = s.Promise, h = a(11)(l) == "process";
      i.exports = function() {
        var p, g, $, v = function() {
          var C, D;
          for (h && (C = l.domain) && C.exit(); p; ) {
            D = p.fn, p = p.next;
            try {
              D();
            } catch (V) {
              throw p ? $() : g = void 0, V;
            }
          }
          g = void 0, C && C.enter();
        };
        if (h) $ = function() {
          l.nextTick(v);
        };
        else if (u) {
          var y = !0, E = document.createTextNode("");
          new u(v).observe(E, { characterData: !0 }), $ = function() {
            E.data = y = !y;
          };
        } else if (f && f.resolve) {
          var A = f.resolve();
          $ = function() {
            A.then(v);
          };
        } else $ = function() {
          c.call(s, v);
        };
        return function(C) {
          var D = { fn: C, next: void 0 };
          g && (g.next = D), p || (p = D, $()), g = D;
        };
      };
    }, function(i, o, a) {
      var s = a(3), c = a(50), u = a(22), l = a(19)("IE_PROTO"), f = function() {
      }, h = "prototype", p = function() {
        var g, $ = a(16)("iframe"), v = u.length, y = ">";
        for ($.style.display = "none", a(25).appendChild($), $.src = "javascript:", g = $.contentWindow.document, g.open(), g.write("<script>document.F=Object<\/script" + y), g.close(), p = g.F; v--; ) delete p[h][u[v]];
        return p();
      };
      i.exports = Object.create || function(g, $) {
        var v;
        return g !== null ? (f[h] = s(g), v = new f(), f[h] = null, v[l] = g) : v = p(), $ === void 0 ? v : c(v, $);
      };
    }, function(i, o, a) {
      var s = a(12), c = a(3), u = a(54);
      i.exports = a(4) ? Object.defineProperties : function(l, f) {
        c(l);
        for (var h, p = u(f), g = p.length, $ = 0; g > $; ) s.f(l, h = p[$++], f[h]);
        return l;
      };
    }, function(i, o, a) {
      var s = a(55), c = a(17), u = a(13), l = a(32), f = a(8), h = a(26), p = Object.getOwnPropertyDescriptor;
      o.f = a(4) ? p : function(g, $) {
        if (g = u(g), $ = l($, !0), h) try {
          return p(g, $);
        } catch {
        }
        if (f(g, $)) return c(!s.f.call(g, $), g[$]);
      };
    }, function(i, o, a) {
      var s = a(8), c = a(63), u = a(19)("IE_PROTO"), l = Object.prototype;
      i.exports = Object.getPrototypeOf || function(f) {
        return f = c(f), s(f, u) ? f[u] : typeof f.constructor == "function" && f instanceof f.constructor ? f.constructor.prototype : f instanceof Object ? l : null;
      };
    }, function(i, o, a) {
      var s = a(8), c = a(13), u = a(39)(!1), l = a(19)("IE_PROTO");
      i.exports = function(f, h) {
        var p, g = c(f), $ = 0, v = [];
        for (p in g) p != l && s(g, p) && v.push(p);
        for (; h.length > $; ) s(g, p = h[$++]) && (~u(v, p) || v.push(p));
        return v;
      };
    }, function(i, o, a) {
      var s = a(53), c = a(22);
      i.exports = Object.keys || function(u) {
        return s(u, c);
      };
    }, function(i, o) {
      o.f = {}.propertyIsEnumerable;
    }, function(i, o, a) {
      var s = a(5);
      i.exports = function(c, u, l) {
        for (var f in u) l && c[f] ? c[f] = u[f] : s(c, f, u[f]);
        return c;
      };
    }, function(i, o, a) {
      i.exports = a(5);
    }, function(i, o, a) {
      var s = a(9), c = a(3), u = function(l, f) {
        if (c(l), !s(f) && f !== null) throw TypeError(f + ": can't set as prototype!");
      };
      i.exports = { set: Object.setPrototypeOf || ("__proto__" in {} ? function(l, f, h) {
        try {
          h = a(7)(Function.call, a(51).f(Object.prototype, "__proto__").set, 2), h(l, []), f = !(l instanceof Array);
        } catch {
          f = !0;
        }
        return function(p, g) {
          return u(p, g), f ? p.__proto__ = g : h(p, g), p;
        };
      }({}, !1) : void 0), check: u };
    }, function(i, o, a) {
      var s = a(2), c = a(6), u = a(12), l = a(4), f = a(1)("species");
      i.exports = function(h) {
        var p = typeof c[h] == "function" ? c[h] : s[h];
        l && p && !p[f] && u.f(p, f, { configurable: !0, get: function() {
          return this;
        } });
      };
    }, function(i, o, a) {
      var s = a(3), c = a(14), u = a(1)("species");
      i.exports = function(l, f) {
        var h, p = s(l).constructor;
        return p === void 0 || (h = s(p)[u]) == null ? f : c(h);
      };
    }, function(i, o, a) {
      var s = a(20), c = a(15);
      i.exports = function(u) {
        return function(l, f) {
          var h, p, g = String(c(l)), $ = s(f), v = g.length;
          return $ < 0 || $ >= v ? u ? "" : void 0 : (h = g.charCodeAt($), h < 55296 || h > 56319 || $ + 1 === v || (p = g.charCodeAt($ + 1)) < 56320 || p > 57343 ? u ? g.charAt($) : h : u ? g.slice($, $ + 2) : (h - 55296 << 10) + (p - 56320) + 65536);
        };
      };
    }, function(i, o, a) {
      var s = a(20), c = Math.max, u = Math.min;
      i.exports = function(l, f) {
        return l = s(l), l < 0 ? c(l + f, 0) : u(l, f);
      };
    }, function(i, o, a) {
      var s = a(15);
      i.exports = function(c) {
        return Object(s(c));
      };
    }, function(i, o, a) {
      var s = a(21), c = a(1)("iterator"), u = a(10);
      i.exports = a(6).getIteratorMethod = function(l) {
        if (l != null) return l[c] || l["@@iterator"] || u[s(l)];
      };
    }, function(i, o, a) {
      var s = a(37), c = a(47), u = a(10), l = a(13);
      i.exports = a(27)(Array, "Array", function(f, h) {
        this._t = l(f), this._i = 0, this._k = h;
      }, function() {
        var f = this._t, h = this._k, p = this._i++;
        return !f || p >= f.length ? (this._t = void 0, c(1)) : h == "keys" ? c(0, p) : h == "values" ? c(0, f[p]) : c(0, [p, f[p]]);
      }, "values"), u.Arguments = u.Array, s("keys"), s("values"), s("entries");
    }, function(i, o) {
    }, function(i, o, a) {
      var s, c, u, l = a(28), f = a(2), h = a(7), p = a(21), g = a(23), $ = a(9), v = (a(3), a(14)), y = a(38), E = a(40), A = (a(58).set, a(60)), C = a(30).set, D = a(48)(), V = "Promise", z = f.TypeError, N = f.process, G = f[V], N = f.process, W = p(N) == "process", M = function() {
      }, x = !!function() {
        try {
          var d = G.resolve(1), m = (d.constructor = {})[a(1)("species")] = function(P) {
            P(M, M);
          };
          return (W || typeof PromiseRejectionEvent == "function") && d.then(M) instanceof m;
        } catch {
        }
      }(), J = function(d, m) {
        return d === m || d === G && m === u;
      }, F = function(d) {
        var m;
        return !(!$(d) || typeof (m = d.then) != "function") && m;
      }, L = function(d) {
        return J(G, d) ? new H(d) : new c(d);
      }, H = c = function(d) {
        var m, P;
        this.promise = new d(function(w, _) {
          if (m !== void 0 || P !== void 0) throw z("Bad Promise constructor");
          m = w, P = _;
        }), this.resolve = v(m), this.reject = v(P);
      }, U = function(d) {
        try {
          d();
        } catch (m) {
          return { error: m };
        }
      }, K = function(d, m) {
        if (!d._n) {
          d._n = !0;
          var P = d._c;
          D(function() {
            for (var w = d._v, _ = d._s == 1, k = 0, I = function(Y) {
              var ne, ye, _e = _ ? Y.ok : Y.fail, $e = Y.resolve, Ce = Y.reject, ve = Y.domain;
              try {
                _e ? (_ || (d._h == 2 && b(d), d._h = 1), _e === !0 ? ne = w : (ve && ve.enter(), ne = _e(w), ve && ve.exit()), ne === Y.promise ? Ce(z("Promise-chain cycle")) : (ye = F(ne)) ? ye.call(ne, $e, Ce) : $e(ne)) : Ce(w);
              } catch (Fe) {
                Ce(Fe);
              }
            }; P.length > k; ) I(P[k++]);
            d._c = [], d._n = !1, m && !d._h && B(d);
          });
        }
      }, B = function(d) {
        C.call(f, function() {
          var m, P, w, _ = d._v;
          if (R(d) && (m = U(function() {
            W ? N.emit("unhandledRejection", _, d) : (P = f.onunhandledrejection) ? P({ promise: d, reason: _ }) : (w = f.console) && w.error && w.error("Unhandled promise rejection", _);
          }), d._h = W || R(d) ? 2 : 1), d._a = void 0, m) throw m.error;
        });
      }, R = function(d) {
        if (d._h == 1) return !1;
        for (var m, P = d._a || d._c, w = 0; P.length > w; ) if (m = P[w++], m.fail || !R(m.promise)) return !1;
        return !0;
      }, b = function(d) {
        C.call(f, function() {
          var m;
          W ? N.emit("rejectionHandled", d) : (m = f.onrejectionhandled) && m({ promise: d, reason: d._v });
        });
      }, O = function(d) {
        var m = this;
        m._d || (m._d = !0, m = m._w || m, m._v = d, m._s = 2, m._a || (m._a = m._c.slice()), K(m, !0));
      }, S = function(d) {
        var m, P = this;
        if (!P._d) {
          P._d = !0, P = P._w || P;
          try {
            if (P === d) throw z("Promise can't be resolved itself");
            (m = F(d)) ? D(function() {
              var w = { _w: P, _d: !1 };
              try {
                m.call(d, h(S, w, 1), h(O, w, 1));
              } catch (_) {
                O.call(w, _);
              }
            }) : (P._v = d, P._s = 1, K(P, !1));
          } catch (w) {
            O.call({ _w: P, _d: !1 }, w);
          }
        }
      };
      x || (G = function(d) {
        y(this, G, V, "_h"), v(d), s.call(this);
        try {
          d(h(S, this, 1), h(O, this, 1));
        } catch (m) {
          O.call(this, m);
        }
      }, s = function(d) {
        this._c = [], this._a = void 0, this._s = 0, this._d = !1, this._v = void 0, this._h = 0, this._n = !1;
      }, s.prototype = a(56)(G.prototype, { then: function(d, m) {
        var P = L(A(this, G));
        return P.ok = typeof d != "function" || d, P.fail = typeof m == "function" && m, P.domain = W ? N.domain : void 0, this._c.push(P), this._a && this._a.push(P), this._s && K(this, !1), P.promise;
      }, catch: function(d) {
        return this.then(void 0, d);
      } }), H = function() {
        var d = new s();
        this.promise = d, this.resolve = h(S, d, 1), this.reject = h(O, d, 1);
      }), g(g.G + g.W + g.F * !x, { Promise: G }), a(18)(G, V), a(59)(V), u = a(6)[V], g(g.S + g.F * !x, V, { reject: function(d) {
        var m = L(this), P = m.reject;
        return P(d), m.promise;
      } }), g(g.S + g.F * (l || !x), V, { resolve: function(d) {
        if (d instanceof G && J(d.constructor, this)) return d;
        var m = L(this), P = m.resolve;
        return P(d), m.promise;
      } }), g(g.S + g.F * !(x && a(46)(function(d) {
        G.all(d).catch(M);
      })), V, { all: function(d) {
        var m = this, P = L(m), w = P.resolve, _ = P.reject, k = U(function() {
          var I = [], Y = 0, ne = 1;
          E(d, !1, function(ye) {
            var _e = Y++, $e = !1;
            I.push(void 0), ne++, m.resolve(ye).then(function(Ce) {
              $e || ($e = !0, I[_e] = Ce, --ne || w(I));
            }, _);
          }), --ne || w(I);
        });
        return k && _(k.error), P.promise;
      }, race: function(d) {
        var m = this, P = L(m), w = P.reject, _ = U(function() {
          E(d, !1, function(k) {
            m.resolve(k).then(P.resolve, w);
          });
        });
        return _ && w(_.error), P.promise;
      } });
    }, function(i, o, a) {
      var s = a(61)(!0);
      a(27)(String, "String", function(c) {
        this._t = String(c), this._i = 0;
      }, function() {
        var c, u = this._t, l = this._i;
        return l >= u.length ? { value: void 0, done: !0 } : (c = s(u, l), this._i += c.length, { value: c, done: !1 });
      });
    }, function(i, o, a) {
      a(65);
      for (var s = a(2), c = a(5), u = a(10), l = a(1)("toStringTag"), f = ["NodeList", "DOMTokenList", "MediaList", "StyleSheetList", "CSSRuleList"], h = 0; h < 5; h++) {
        var p = f[h], g = s[p], $ = g && g.prototype;
        $ && !$[l] && c($, l, p), u[p] = u.Array;
      }
    }, function(i, o) {
      i.exports = Si;
    }, function(i, o) {
      i.exports = xn;
    }]);
  });
})(m0);
var _p = m0.exports;
const Wc = "http://127.0.0.1:3001";
function rk() {
  const e = async () => {
    const t = await _p.machineId(!0);
    return String(t);
  };
  ht.handle("license:status", async () => {
    const t = no.get();
    if (!t.key) return { valid: !1, expiresAt: null };
    try {
      const r = await e(), n = await fetch(`${Wc}/license/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: t.key,
          deviceId: r
        })
      });
      if (!n.ok) throw new Error("verify failed");
      const i = await n.json();
      return i.valid ? {
        valid: !0,
        expiresAt: i.expiresAt ?? null,
        key: t.key ?? null,
        capabilities: i.capabilities ?? {}
      } : (no.clear(), { valid: !1, expiresAt: null });
    } catch {
      return { valid: !1, expiresAt: null };
    }
  }), ht.handle("license:activate", async (t, r) => {
    try {
      const n = await e(), i = await fetch(`${Wc}/license/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: r,
          deviceId: n
        })
      }), o = await i.json();
      return !i.ok || !o.ok ? { ok: !1, error: o.error ?? "Activation failed" } : (no.set({
        key: r,
        expiresAt: o.expiresAt,
        lastVerifiedAt: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        ok: !0,
        expiresAt: o.expiresAt,
        capabilities: o.capabilities
      });
    } catch {
      return { ok: !1, error: "No se pudo conectar con el servidor" };
    }
  }), ht.handle("license:trialStart", async (t, r) => {
    try {
      const n = await e(), i = await fetch(`${Wc}/trial/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId: n, twitchUser: r })
      }), o = await i.json().catch(() => null);
      return !i.ok || !(o != null && o.ok) ? { ok: !1, error: (o == null ? void 0 : o.error) ?? "Trial failed" } : (no.set({
        key: o.key,
        expiresAt: o.expiresAt,
        lastVerifiedAt: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        ok: !0,
        key: o.key,
        expiresAt: o.expiresAt,
        capabilities: o.capabilities
      });
    } catch {
      return { ok: !1, error: "No se pudo conectar con el servidor" };
    }
  }), ht.handle("license:clear", () => (no.clear(), !0)), ht.handle("device:getId", async () => {
    try {
      return { deviceId: await _p.machineId() };
    } catch (t) {
      return console.error("device:getId failed", t), { deviceId: null };
    }
  });
}
let Oe = null, La = {};
function nk() {
  ht.handle("overlay:open", async () => {
    if (Oe && !Oe.isDestroyed())
      return Oe.show(), Oe.focus(), !0;
    const e = ie.dirname(Zm(import.meta.url));
    Oe = new Ds({
      width: 520,
      height: 220,
      transparent: !0,
      frame: !1,
      alwaysOnTop: !0,
      resizable: !0,
      hasShadow: !1,
      skipTaskbar: !0,
      webPreferences: {
        preload: ie.join(e, "preload.mjs"),
        contextIsolation: !0,
        nodeIntegration: !1
      }
    }), Oe.on("closed", () => Oe = null);
    const t = process.env.VITE_DEV_SERVER_URL;
    if (t)
      await Oe.loadURL(`${t}#/overlay`);
    else {
      const r = process.env.APP_ROOT, n = ie.join(r, "dist");
      await Oe.loadFile(ie.join(n, "index.html"), {
        hash: "/overlay"
      });
    }
    return Oe.webContents.once("did-finish-load", () => {
      Oe == null || Oe.webContents.send("overlay:update", La);
    }), !0;
  }), ht.handle("overlay:close", () => (Oe && !Oe.isDestroyed() && (Oe.close(), Oe = null), !0)), ht.handle("overlay:setState", (e, t) => (La = { ...La, ...t }, Oe && !Oe.isDestroyed() && Oe.webContents.send("overlay:update", La), !0)), ht.handle("overlay:isOpen", () => !!Oe && !Oe.isDestroyed()), ht.handle("overlay:clickThrough", (e, t) => (Oe && !Oe.isDestroyed() && Oe.setIgnoreMouseEvents(t, { forward: !0 }), !0));
}
var Yt = {}, Gn = {}, vt = {};
vt.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, o) => i != null ? n(i) : r(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
vt.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var Wr = $$, ik = process.cwd, is = null, ok = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return is || (is = ik.call(process)), is;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var $p = process.chdir;
  process.chdir = function(e) {
    is = null, $p.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, $p);
}
var ak = sk;
function sk(e) {
  Wr.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = c(e.statSync), e.fstatSync = c(e.fstatSync), e.lstatSync = c(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(l, f, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(l, f, h, p) {
    p && process.nextTick(p);
  }, e.lchownSync = function() {
  }), ok === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(l) {
    function f(h, p, g) {
      var $ = Date.now(), v = 0;
      l(h, p, function y(E) {
        if (E && (E.code === "EACCES" || E.code === "EPERM" || E.code === "EBUSY") && Date.now() - $ < 6e4) {
          setTimeout(function() {
            e.stat(p, function(A, C) {
              A && A.code === "ENOENT" ? l(h, p, y) : g(E);
            });
          }, v), v < 100 && (v += 10);
          return;
        }
        g && g(E);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, l), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(l) {
    function f(h, p, g, $, v, y) {
      var E;
      if (y && typeof y == "function") {
        var A = 0;
        E = function(C, D, V) {
          if (C && C.code === "EAGAIN" && A < 10)
            return A++, l.call(e, h, p, g, $, v, E);
          y.apply(this, arguments);
        };
      }
      return l.call(e, h, p, g, $, v, E);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, l), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(l) {
    return function(f, h, p, g, $) {
      for (var v = 0; ; )
        try {
          return l.call(e, f, h, p, g, $);
        } catch (y) {
          if (y.code === "EAGAIN" && v < 10) {
            v++;
            continue;
          }
          throw y;
        }
    };
  }(e.readSync);
  function t(l) {
    l.lchmod = function(f, h, p) {
      l.open(
        f,
        Wr.O_WRONLY | Wr.O_SYMLINK,
        h,
        function(g, $) {
          if (g) {
            p && p(g);
            return;
          }
          l.fchmod($, h, function(v) {
            l.close($, function(y) {
              p && p(v || y);
            });
          });
        }
      );
    }, l.lchmodSync = function(f, h) {
      var p = l.openSync(f, Wr.O_WRONLY | Wr.O_SYMLINK, h), g = !0, $;
      try {
        $ = l.fchmodSync(p, h), g = !1;
      } finally {
        if (g)
          try {
            l.closeSync(p);
          } catch {
          }
        else
          l.closeSync(p);
      }
      return $;
    };
  }
  function r(l) {
    Wr.hasOwnProperty("O_SYMLINK") && l.futimes ? (l.lutimes = function(f, h, p, g) {
      l.open(f, Wr.O_SYMLINK, function($, v) {
        if ($) {
          g && g($);
          return;
        }
        l.futimes(v, h, p, function(y) {
          l.close(v, function(E) {
            g && g(y || E);
          });
        });
      });
    }, l.lutimesSync = function(f, h, p) {
      var g = l.openSync(f, Wr.O_SYMLINK), $, v = !0;
      try {
        $ = l.futimesSync(g, h, p), v = !1;
      } finally {
        if (v)
          try {
            l.closeSync(g);
          } catch {
          }
        else
          l.closeSync(g);
      }
      return $;
    }) : l.futimes && (l.lutimes = function(f, h, p, g) {
      g && process.nextTick(g);
    }, l.lutimesSync = function() {
    });
  }
  function n(l) {
    return l && function(f, h, p) {
      return l.call(e, f, h, function(g) {
        u(g) && (g = null), p && p.apply(this, arguments);
      });
    };
  }
  function i(l) {
    return l && function(f, h) {
      try {
        return l.call(e, f, h);
      } catch (p) {
        if (!u(p)) throw p;
      }
    };
  }
  function o(l) {
    return l && function(f, h, p, g) {
      return l.call(e, f, h, p, function($) {
        u($) && ($ = null), g && g.apply(this, arguments);
      });
    };
  }
  function a(l) {
    return l && function(f, h, p) {
      try {
        return l.call(e, f, h, p);
      } catch (g) {
        if (!u(g)) throw g;
      }
    };
  }
  function s(l) {
    return l && function(f, h, p) {
      typeof h == "function" && (p = h, h = null);
      function g($, v) {
        v && (v.uid < 0 && (v.uid += 4294967296), v.gid < 0 && (v.gid += 4294967296)), p && p.apply(this, arguments);
      }
      return h ? l.call(e, f, h, g) : l.call(e, f, g);
    };
  }
  function c(l) {
    return l && function(f, h) {
      var p = h ? l.call(e, f, h) : l.call(e, f);
      return p && (p.uid < 0 && (p.uid += 4294967296), p.gid < 0 && (p.gid += 4294967296)), p;
    };
  }
  function u(l) {
    if (!l || l.code === "ENOSYS")
      return !0;
    var f = !process.getuid || process.getuid() !== 0;
    return !!(f && (l.code === "EINVAL" || l.code === "EPERM"));
  }
}
var wp = zo.Stream, ck = lk;
function lk(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    wp.call(this);
    var o = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var a = Object.keys(i), s = 0, c = a.length; s < c; s++) {
      var u = a[s];
      this[u] = i[u];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        o._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(l, f) {
      if (l) {
        o.emit("error", l), o.readable = !1;
        return;
      }
      o.fd = f, o.emit("open", f), o._read();
    });
  }
  function r(n, i) {
    if (!(this instanceof r)) return new r(n, i);
    wp.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var o = Object.keys(i), a = 0, s = o.length; a < s; a++) {
      var c = o[a];
      this[c] = i[c];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var uk = dk, fk = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function dk(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: fk(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var De = pn, hk = ak, pk = ck, mk = uk, Ua = nu, Qe, $s;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (Qe = Symbol.for("graceful-fs.queue"), $s = Symbol.for("graceful-fs.previous")) : (Qe = "___graceful-fs.queue", $s = "___graceful-fs.previous");
function yk() {
}
function y0(e, t) {
  Object.defineProperty(e, Qe, {
    get: function() {
      return t;
    }
  });
}
var Un = yk;
Ua.debuglog ? Un = Ua.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Un = function() {
  var e = Ua.format.apply(Ua, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!De[Qe]) {
  var gk = ct[Qe] || [];
  y0(De, gk), De.close = function(e) {
    function t(r, n) {
      return e.call(De, r, function(i) {
        i || Ep(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, $s, {
      value: e
    }), t;
  }(De.close), De.closeSync = function(e) {
    function t(r) {
      e.apply(De, arguments), Ep();
    }
    return Object.defineProperty(t, $s, {
      value: e
    }), t;
  }(De.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Un(De[Qe]), ey.equal(De[Qe].length, 0);
  });
}
ct[Qe] || y0(ct, De[Qe]);
var _t = od(mk(De));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !De.__patched && (_t = od(De), De.__patched = !0);
function od(e) {
  hk(e), e.gracefulify = od, e.createReadStream = D, e.createWriteStream = V;
  var t = e.readFile;
  e.readFile = r;
  function r(N, W, M) {
    return typeof W == "function" && (M = W, W = null), x(N, W, M);
    function x(J, F, L, H) {
      return t(J, F, function(U) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? ti([x, [J, F, L], U, H || Date.now(), Date.now()]) : typeof L == "function" && L.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(N, W, M, x) {
    return typeof M == "function" && (x = M, M = null), J(N, W, M, x);
    function J(F, L, H, U, K) {
      return n(F, L, H, function(B) {
        B && (B.code === "EMFILE" || B.code === "ENFILE") ? ti([J, [F, L, H, U], B, K || Date.now(), Date.now()]) : typeof U == "function" && U.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = a);
  function a(N, W, M, x) {
    return typeof M == "function" && (x = M, M = null), J(N, W, M, x);
    function J(F, L, H, U, K) {
      return o(F, L, H, function(B) {
        B && (B.code === "EMFILE" || B.code === "ENFILE") ? ti([J, [F, L, H, U], B, K || Date.now(), Date.now()]) : typeof U == "function" && U.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = c);
  function c(N, W, M, x) {
    return typeof M == "function" && (x = M, M = 0), J(N, W, M, x);
    function J(F, L, H, U, K) {
      return s(F, L, H, function(B) {
        B && (B.code === "EMFILE" || B.code === "ENFILE") ? ti([J, [F, L, H, U], B, K || Date.now(), Date.now()]) : typeof U == "function" && U.apply(this, arguments);
      });
    }
  }
  var u = e.readdir;
  e.readdir = f;
  var l = /^v[0-5]\./;
  function f(N, W, M) {
    typeof W == "function" && (M = W, W = null);
    var x = l.test(process.version) ? function(L, H, U, K) {
      return u(L, J(
        L,
        H,
        U,
        K
      ));
    } : function(L, H, U, K) {
      return u(L, H, J(
        L,
        H,
        U,
        K
      ));
    };
    return x(N, W, M);
    function J(F, L, H, U) {
      return function(K, B) {
        K && (K.code === "EMFILE" || K.code === "ENFILE") ? ti([
          x,
          [F, L, H],
          K,
          U || Date.now(),
          Date.now()
        ]) : (B && B.sort && B.sort(), typeof H == "function" && H.call(this, K, B));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = pk(e);
    y = h.ReadStream, A = h.WriteStream;
  }
  var p = e.ReadStream;
  p && (y.prototype = Object.create(p.prototype), y.prototype.open = E);
  var g = e.WriteStream;
  g && (A.prototype = Object.create(g.prototype), A.prototype.open = C), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return y;
    },
    set: function(N) {
      y = N;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return A;
    },
    set: function(N) {
      A = N;
    },
    enumerable: !0,
    configurable: !0
  });
  var $ = y;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return $;
    },
    set: function(N) {
      $ = N;
    },
    enumerable: !0,
    configurable: !0
  });
  var v = A;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return v;
    },
    set: function(N) {
      v = N;
    },
    enumerable: !0,
    configurable: !0
  });
  function y(N, W) {
    return this instanceof y ? (p.apply(this, arguments), this) : y.apply(Object.create(y.prototype), arguments);
  }
  function E() {
    var N = this;
    G(N.path, N.flags, N.mode, function(W, M) {
      W ? (N.autoClose && N.destroy(), N.emit("error", W)) : (N.fd = M, N.emit("open", M), N.read());
    });
  }
  function A(N, W) {
    return this instanceof A ? (g.apply(this, arguments), this) : A.apply(Object.create(A.prototype), arguments);
  }
  function C() {
    var N = this;
    G(N.path, N.flags, N.mode, function(W, M) {
      W ? (N.destroy(), N.emit("error", W)) : (N.fd = M, N.emit("open", M));
    });
  }
  function D(N, W) {
    return new e.ReadStream(N, W);
  }
  function V(N, W) {
    return new e.WriteStream(N, W);
  }
  var z = e.open;
  e.open = G;
  function G(N, W, M, x) {
    return typeof M == "function" && (x = M, M = null), J(N, W, M, x);
    function J(F, L, H, U, K) {
      return z(F, L, H, function(B, R) {
        B && (B.code === "EMFILE" || B.code === "ENFILE") ? ti([J, [F, L, H, U], B, K || Date.now(), Date.now()]) : typeof U == "function" && U.apply(this, arguments);
      });
    }
  }
  return e;
}
function ti(e) {
  Un("ENQUEUE", e[0].name, e[1]), De[Qe].push(e), ad();
}
var Ma;
function Ep() {
  for (var e = Date.now(), t = 0; t < De[Qe].length; ++t)
    De[Qe][t].length > 2 && (De[Qe][t][3] = e, De[Qe][t][4] = e);
  ad();
}
function ad() {
  if (clearTimeout(Ma), Ma = void 0, De[Qe].length !== 0) {
    var e = De[Qe].shift(), t = e[0], r = e[1], n = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Un("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Un("TIMEOUT", t.name, r);
      var a = r.pop();
      typeof a == "function" && a.call(null, n);
    } else {
      var s = Date.now() - o, c = Math.max(o - i, 1), u = Math.min(c * 1.2, 100);
      s >= u ? (Un("RETRY", t.name, r), t.apply(null, r.concat([i]))) : De[Qe].push(e);
    }
    Ma === void 0 && (Ma = setTimeout(ad, 0));
  }
}
(function(e) {
  const t = vt.fromCallback, r = _t, n = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof r[i] == "function");
  Object.assign(e, r), n.forEach((i) => {
    e[i] = t(r[i]);
  }), e.exists = function(i, o) {
    return typeof o == "function" ? r.exists(i, o) : new Promise((a) => r.exists(i, a));
  }, e.read = function(i, o, a, s, c, u) {
    return typeof u == "function" ? r.read(i, o, a, s, c, u) : new Promise((l, f) => {
      r.read(i, o, a, s, c, (h, p, g) => {
        if (h) return f(h);
        l({ bytesRead: p, buffer: g });
      });
    });
  }, e.write = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? r.write(i, o, ...a) : new Promise((s, c) => {
      r.write(i, o, ...a, (u, l, f) => {
        if (u) return c(u);
        s({ bytesWritten: l, buffer: f });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? r.writev(i, o, ...a) : new Promise((s, c) => {
      r.writev(i, o, ...a, (u, l, f) => {
        if (u) return c(u);
        s({ bytesWritten: l, buffers: f });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(Gn);
var sd = {}, g0 = {};
const vk = ke;
g0.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(vk.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const v0 = Gn, { checkPath: _0 } = g0, $0 = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
sd.makeDir = async (e, t) => (_0(e), v0.mkdir(e, {
  mode: $0(t),
  recursive: !0
}));
sd.makeDirSync = (e, t) => (_0(e), v0.mkdirSync(e, {
  mode: $0(t),
  recursive: !0
}));
const _k = vt.fromPromise, { makeDir: $k, makeDirSync: Yc } = sd, Xc = _k($k);
var yr = {
  mkdirs: Xc,
  mkdirsSync: Yc,
  // alias
  mkdirp: Xc,
  mkdirpSync: Yc,
  ensureDir: Xc,
  ensureDirSync: Yc
};
const wk = vt.fromPromise, w0 = Gn;
function Ek(e) {
  return w0.access(e).then(() => !0).catch(() => !1);
}
var Kn = {
  pathExists: wk(Ek),
  pathExistsSync: w0.existsSync
};
const wi = _t;
function bk(e, t, r, n) {
  wi.open(e, "r+", (i, o) => {
    if (i) return n(i);
    wi.futimes(o, t, r, (a) => {
      wi.close(o, (s) => {
        n && n(a || s);
      });
    });
  });
}
function Sk(e, t, r) {
  const n = wi.openSync(e, "r+");
  return wi.futimesSync(n, t, r), wi.closeSync(n);
}
var E0 = {
  utimesMillis: bk,
  utimesMillisSync: Sk
};
const Ni = Gn, He = ke, Pk = nu;
function Tk(e, t, r) {
  const n = r.dereference ? (i) => Ni.stat(i, { bigint: !0 }) : (i) => Ni.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function Ok(e, t, r) {
  let n;
  const i = r.dereference ? (a) => Ni.statSync(a, { bigint: !0 }) : (a) => Ni.lstatSync(a, { bigint: !0 }), o = i(e);
  try {
    n = i(t);
  } catch (a) {
    if (a.code === "ENOENT") return { srcStat: o, destStat: null };
    throw a;
  }
  return { srcStat: o, destStat: n };
}
function Ak(e, t, r, n, i) {
  Pk.callbackify(Tk)(e, t, n, (o, a) => {
    if (o) return i(o);
    const { srcStat: s, destStat: c } = a;
    if (c) {
      if (Zo(s, c)) {
        const u = He.basename(e), l = He.basename(t);
        return r === "move" && u !== l && u.toLowerCase() === l.toLowerCase() ? i(null, { srcStat: s, destStat: c, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (s.isDirectory() && !c.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!s.isDirectory() && c.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return s.isDirectory() && cd(e, t) ? i(new Error(ec(e, t, r))) : i(null, { srcStat: s, destStat: c });
  });
}
function Nk(e, t, r, n) {
  const { srcStat: i, destStat: o } = Ok(e, t, n);
  if (o) {
    if (Zo(i, o)) {
      const a = He.basename(e), s = He.basename(t);
      if (r === "move" && a !== s && a.toLowerCase() === s.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && cd(e, t))
    throw new Error(ec(e, t, r));
  return { srcStat: i, destStat: o };
}
function b0(e, t, r, n, i) {
  const o = He.resolve(He.dirname(e)), a = He.resolve(He.dirname(r));
  if (a === o || a === He.parse(a).root) return i();
  Ni.stat(a, { bigint: !0 }, (s, c) => s ? s.code === "ENOENT" ? i() : i(s) : Zo(t, c) ? i(new Error(ec(e, r, n))) : b0(e, t, a, n, i));
}
function S0(e, t, r, n) {
  const i = He.resolve(He.dirname(e)), o = He.resolve(He.dirname(r));
  if (o === i || o === He.parse(o).root) return;
  let a;
  try {
    a = Ni.statSync(o, { bigint: !0 });
  } catch (s) {
    if (s.code === "ENOENT") return;
    throw s;
  }
  if (Zo(t, a))
    throw new Error(ec(e, r, n));
  return S0(e, t, o, n);
}
function Zo(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function cd(e, t) {
  const r = He.resolve(e).split(He.sep).filter((i) => i), n = He.resolve(t).split(He.sep).filter((i) => i);
  return r.reduce((i, o, a) => i && n[a] === o, !0);
}
function ec(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var Bi = {
  checkPaths: Ak,
  checkPathsSync: Nk,
  checkParentPaths: b0,
  checkParentPathsSync: S0,
  isSrcSubdir: cd,
  areIdentical: Zo
};
const Tt = _t, Io = ke, Ik = yr.mkdirs, Ck = Kn.pathExists, Rk = E0.utimesMillis, Co = Bi;
function Dk(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Co.checkPaths(e, t, "copy", r, (i, o) => {
    if (i) return n(i);
    const { srcStat: a, destStat: s } = o;
    Co.checkParentPaths(e, a, t, "copy", (c) => c ? n(c) : r.filter ? P0(bp, s, e, t, r, n) : bp(s, e, t, r, n));
  });
}
function bp(e, t, r, n, i) {
  const o = Io.dirname(r);
  Ck(o, (a, s) => {
    if (a) return i(a);
    if (s) return ws(e, t, r, n, i);
    Ik(o, (c) => c ? i(c) : ws(e, t, r, n, i));
  });
}
function P0(e, t, r, n, i, o) {
  Promise.resolve(i.filter(r, n)).then((a) => a ? e(t, r, n, i, o) : o(), (a) => o(a));
}
function kk(e, t, r, n, i) {
  return n.filter ? P0(ws, e, t, r, n, i) : ws(e, t, r, n, i);
}
function ws(e, t, r, n, i) {
  (n.dereference ? Tt.stat : Tt.lstat)(t, (a, s) => a ? i(a) : s.isDirectory() ? Vk(s, e, t, r, n, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? jk(s, e, t, r, n, i) : s.isSymbolicLink() ? Hk(e, t, r, n, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function jk(e, t, r, n, i, o) {
  return t ? Fk(e, r, n, i, o) : T0(e, r, n, i, o);
}
function Fk(e, t, r, n, i) {
  if (n.overwrite)
    Tt.unlink(r, (o) => o ? i(o) : T0(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function T0(e, t, r, n, i) {
  Tt.copyFile(t, r, (o) => o ? i(o) : n.preserveTimestamps ? Lk(e.mode, t, r, i) : tc(r, e.mode, i));
}
function Lk(e, t, r, n) {
  return Uk(e) ? Mk(r, e, (i) => i ? n(i) : Sp(e, t, r, n)) : Sp(e, t, r, n);
}
function Uk(e) {
  return (e & 128) === 0;
}
function Mk(e, t, r) {
  return tc(e, t | 128, r);
}
function Sp(e, t, r, n) {
  xk(t, r, (i) => i ? n(i) : tc(r, e, n));
}
function tc(e, t, r) {
  return Tt.chmod(e, t, r);
}
function xk(e, t, r) {
  Tt.stat(e, (n, i) => n ? r(n) : Rk(t, i.atime, i.mtime, r));
}
function Vk(e, t, r, n, i, o) {
  return t ? O0(r, n, i, o) : qk(e.mode, r, n, i, o);
}
function qk(e, t, r, n, i) {
  Tt.mkdir(r, (o) => {
    if (o) return i(o);
    O0(t, r, n, (a) => a ? i(a) : tc(r, e, i));
  });
}
function O0(e, t, r, n) {
  Tt.readdir(e, (i, o) => i ? n(i) : A0(o, e, t, r, n));
}
function A0(e, t, r, n, i) {
  const o = e.pop();
  return o ? Bk(e, o, t, r, n, i) : i();
}
function Bk(e, t, r, n, i, o) {
  const a = Io.join(r, t), s = Io.join(n, t);
  Co.checkPaths(a, s, "copy", i, (c, u) => {
    if (c) return o(c);
    const { destStat: l } = u;
    kk(l, a, s, i, (f) => f ? o(f) : A0(e, r, n, i, o));
  });
}
function Hk(e, t, r, n, i) {
  Tt.readlink(t, (o, a) => {
    if (o) return i(o);
    if (n.dereference && (a = Io.resolve(process.cwd(), a)), e)
      Tt.readlink(r, (s, c) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? Tt.symlink(a, r, i) : i(s) : (n.dereference && (c = Io.resolve(process.cwd(), c)), Co.isSrcSubdir(a, c) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${c}'.`)) : e.isDirectory() && Co.isSrcSubdir(c, a) ? i(new Error(`Cannot overwrite '${c}' with '${a}'.`)) : zk(a, r, i)));
    else
      return Tt.symlink(a, r, i);
  });
}
function zk(e, t, r) {
  Tt.unlink(t, (n) => n ? r(n) : Tt.symlink(e, t, r));
}
var Gk = Dk;
const st = _t, Ro = ke, Kk = yr.mkdirsSync, Wk = E0.utimesMillisSync, Do = Bi;
function Yk(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Do.checkPathsSync(e, t, "copy", r);
  return Do.checkParentPathsSync(e, n, t, "copy"), Xk(i, e, t, r);
}
function Xk(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Ro.dirname(r);
  return st.existsSync(i) || Kk(i), N0(e, t, r, n);
}
function Jk(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return N0(e, t, r, n);
}
function N0(e, t, r, n) {
  const o = (n.dereference ? st.statSync : st.lstatSync)(t);
  if (o.isDirectory()) return i2(o, e, t, r, n);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return Qk(o, e, t, r, n);
  if (o.isSymbolicLink()) return s2(e, t, r, n);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function Qk(e, t, r, n, i) {
  return t ? Zk(e, r, n, i) : I0(e, r, n, i);
}
function Zk(e, t, r, n) {
  if (n.overwrite)
    return st.unlinkSync(r), I0(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function I0(e, t, r, n) {
  return st.copyFileSync(t, r), n.preserveTimestamps && e2(e.mode, t, r), ld(r, e.mode);
}
function e2(e, t, r) {
  return t2(e) && r2(r, e), n2(t, r);
}
function t2(e) {
  return (e & 128) === 0;
}
function r2(e, t) {
  return ld(e, t | 128);
}
function ld(e, t) {
  return st.chmodSync(e, t);
}
function n2(e, t) {
  const r = st.statSync(e);
  return Wk(t, r.atime, r.mtime);
}
function i2(e, t, r, n, i) {
  return t ? C0(r, n, i) : o2(e.mode, r, n, i);
}
function o2(e, t, r, n) {
  return st.mkdirSync(r), C0(t, r, n), ld(r, e);
}
function C0(e, t, r) {
  st.readdirSync(e).forEach((n) => a2(n, e, t, r));
}
function a2(e, t, r, n) {
  const i = Ro.join(t, e), o = Ro.join(r, e), { destStat: a } = Do.checkPathsSync(i, o, "copy", n);
  return Jk(a, i, o, n);
}
function s2(e, t, r, n) {
  let i = st.readlinkSync(t);
  if (n.dereference && (i = Ro.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = st.readlinkSync(r);
    } catch (a) {
      if (a.code === "EINVAL" || a.code === "UNKNOWN") return st.symlinkSync(i, r);
      throw a;
    }
    if (n.dereference && (o = Ro.resolve(process.cwd(), o)), Do.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (st.statSync(r).isDirectory() && Do.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return c2(i, r);
  } else
    return st.symlinkSync(i, r);
}
function c2(e, t) {
  return st.unlinkSync(t), st.symlinkSync(e, t);
}
var l2 = Yk;
const u2 = vt.fromCallback;
var ud = {
  copy: u2(Gk),
  copySync: l2
};
const Pp = _t, R0 = ke, Se = ey, ko = process.platform === "win32";
function D0(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || Pp[r], r = r + "Sync", e[r] = e[r] || Pp[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function fd(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), Se(e, "rimraf: missing path"), Se.strictEqual(typeof e, "string", "rimraf: path should be a string"), Se.strictEqual(typeof r, "function", "rimraf: callback function required"), Se(t, "rimraf: invalid options argument provided"), Se.strictEqual(typeof t, "object", "rimraf: options should be object"), D0(t), Tp(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const a = n * 100;
        return setTimeout(() => Tp(e, t, i), a);
      }
      o.code === "ENOENT" && (o = null);
    }
    r(o);
  });
}
function Tp(e, t, r) {
  Se(e), Se(t), Se(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && ko)
      return Op(e, t, n, r);
    if (i && i.isDirectory())
      return os(e, t, n, r);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return r(null);
        if (o.code === "EPERM")
          return ko ? Op(e, t, o, r) : os(e, t, o, r);
        if (o.code === "EISDIR")
          return os(e, t, o, r);
      }
      return r(o);
    });
  });
}
function Op(e, t, r, n) {
  Se(e), Se(t), Se(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (o, a) => {
      o ? n(o.code === "ENOENT" ? null : r) : a.isDirectory() ? os(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Ap(e, t, r) {
  let n;
  Se(e), Se(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  try {
    n = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  n.isDirectory() ? as(e, t, r) : t.unlinkSync(e);
}
function os(e, t, r, n) {
  Se(e), Se(t), Se(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? f2(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function f2(e, t, r) {
  Se(e), Se(t), Se(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let o = i.length, a;
    if (o === 0) return t.rmdir(e, r);
    i.forEach((s) => {
      fd(R0.join(e, s), t, (c) => {
        if (!a) {
          if (c) return r(a = c);
          --o === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function k0(e, t) {
  let r;
  t = t || {}, D0(t), Se(e, "rimraf: missing path"), Se.strictEqual(typeof e, "string", "rimraf: path should be a string"), Se(t, "rimraf: missing options"), Se.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && ko && Ap(e, t, n);
  }
  try {
    r && r.isDirectory() ? as(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return ko ? Ap(e, t, n) : as(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    as(e, t, n);
  }
}
function as(e, t, r) {
  Se(e), Se(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      d2(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function d2(e, t) {
  if (Se(e), Se(t), t.readdirSync(e).forEach((r) => k0(R0.join(e, r), t)), ko) {
    const r = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - r < 500);
  } else
    return t.rmdirSync(e, t);
}
var h2 = fd;
fd.sync = k0;
const Es = _t, p2 = vt.fromCallback, j0 = h2;
function m2(e, t) {
  if (Es.rm) return Es.rm(e, { recursive: !0, force: !0 }, t);
  j0(e, t);
}
function y2(e) {
  if (Es.rmSync) return Es.rmSync(e, { recursive: !0, force: !0 });
  j0.sync(e);
}
var rc = {
  remove: p2(m2),
  removeSync: y2
};
const g2 = vt.fromPromise, F0 = Gn, L0 = ke, U0 = yr, M0 = rc, Np = g2(async function(t) {
  let r;
  try {
    r = await F0.readdir(t);
  } catch {
    return U0.mkdirs(t);
  }
  return Promise.all(r.map((n) => M0.remove(L0.join(t, n))));
});
function Ip(e) {
  let t;
  try {
    t = F0.readdirSync(e);
  } catch {
    return U0.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = L0.join(e, r), M0.removeSync(r);
  });
}
var v2 = {
  emptyDirSync: Ip,
  emptydirSync: Ip,
  emptyDir: Np,
  emptydir: Np
};
const _2 = vt.fromCallback, x0 = ke, nn = _t, V0 = yr;
function $2(e, t) {
  function r() {
    nn.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  nn.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const o = x0.dirname(e);
    nn.stat(o, (a, s) => {
      if (a)
        return a.code === "ENOENT" ? V0.mkdirs(o, (c) => {
          if (c) return t(c);
          r();
        }) : t(a);
      s.isDirectory() ? r() : nn.readdir(o, (c) => {
        if (c) return t(c);
      });
    });
  });
}
function w2(e) {
  let t;
  try {
    t = nn.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = x0.dirname(e);
  try {
    nn.statSync(r).isDirectory() || nn.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") V0.mkdirsSync(r);
    else throw n;
  }
  nn.writeFileSync(e, "");
}
var E2 = {
  createFile: _2($2),
  createFileSync: w2
};
const b2 = vt.fromCallback, q0 = ke, Zr = _t, B0 = yr, S2 = Kn.pathExists, { areIdentical: H0 } = Bi;
function P2(e, t, r) {
  function n(i, o) {
    Zr.link(i, o, (a) => {
      if (a) return r(a);
      r(null);
    });
  }
  Zr.lstat(t, (i, o) => {
    Zr.lstat(e, (a, s) => {
      if (a)
        return a.message = a.message.replace("lstat", "ensureLink"), r(a);
      if (o && H0(s, o)) return r(null);
      const c = q0.dirname(t);
      S2(c, (u, l) => {
        if (u) return r(u);
        if (l) return n(e, t);
        B0.mkdirs(c, (f) => {
          if (f) return r(f);
          n(e, t);
        });
      });
    });
  });
}
function T2(e, t) {
  let r;
  try {
    r = Zr.lstatSync(t);
  } catch {
  }
  try {
    const o = Zr.lstatSync(e);
    if (r && H0(o, r)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const n = q0.dirname(t);
  return Zr.existsSync(n) || B0.mkdirsSync(n), Zr.linkSync(e, t);
}
var O2 = {
  createLink: b2(P2),
  createLinkSync: T2
};
const on = ke, So = _t, A2 = Kn.pathExists;
function N2(e, t, r) {
  if (on.isAbsolute(e))
    return So.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = on.dirname(t), i = on.join(n, e);
    return A2(i, (o, a) => o ? r(o) : a ? r(null, {
      toCwd: i,
      toDst: e
    }) : So.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), r(s)) : r(null, {
      toCwd: e,
      toDst: on.relative(n, e)
    })));
  }
}
function I2(e, t) {
  let r;
  if (on.isAbsolute(e)) {
    if (r = So.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = on.dirname(t), i = on.join(n, e);
    if (r = So.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = So.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: on.relative(n, e)
    };
  }
}
var C2 = {
  symlinkPaths: N2,
  symlinkPathsSync: I2
};
const z0 = _t;
function R2(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  z0.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function D2(e, t) {
  let r;
  if (t) return t;
  try {
    r = z0.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var k2 = {
  symlinkType: R2,
  symlinkTypeSync: D2
};
const j2 = vt.fromCallback, G0 = ke, Qt = Gn, K0 = yr, F2 = K0.mkdirs, L2 = K0.mkdirsSync, W0 = C2, U2 = W0.symlinkPaths, M2 = W0.symlinkPathsSync, Y0 = k2, x2 = Y0.symlinkType, V2 = Y0.symlinkTypeSync, q2 = Kn.pathExists, { areIdentical: X0 } = Bi;
function B2(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, Qt.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      Qt.stat(e),
      Qt.stat(t)
    ]).then(([a, s]) => {
      if (X0(a, s)) return n(null);
      Cp(e, t, r, n);
    }) : Cp(e, t, r, n);
  });
}
function Cp(e, t, r, n) {
  U2(e, t, (i, o) => {
    if (i) return n(i);
    e = o.toDst, x2(o.toCwd, r, (a, s) => {
      if (a) return n(a);
      const c = G0.dirname(t);
      q2(c, (u, l) => {
        if (u) return n(u);
        if (l) return Qt.symlink(e, t, s, n);
        F2(c, (f) => {
          if (f) return n(f);
          Qt.symlink(e, t, s, n);
        });
      });
    });
  });
}
function H2(e, t, r) {
  let n;
  try {
    n = Qt.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const s = Qt.statSync(e), c = Qt.statSync(t);
    if (X0(s, c)) return;
  }
  const i = M2(e, t);
  e = i.toDst, r = V2(i.toCwd, r);
  const o = G0.dirname(t);
  return Qt.existsSync(o) || L2(o), Qt.symlinkSync(e, t, r);
}
var z2 = {
  createSymlink: j2(B2),
  createSymlinkSync: H2
};
const { createFile: Rp, createFileSync: Dp } = E2, { createLink: kp, createLinkSync: jp } = O2, { createSymlink: Fp, createSymlinkSync: Lp } = z2;
var G2 = {
  // file
  createFile: Rp,
  createFileSync: Dp,
  ensureFile: Rp,
  ensureFileSync: Dp,
  // link
  createLink: kp,
  createLinkSync: jp,
  ensureLink: kp,
  ensureLinkSync: jp,
  // symlink
  createSymlink: Fp,
  createSymlinkSync: Lp,
  ensureSymlink: Fp,
  ensureSymlinkSync: Lp
};
function K2(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const o = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + o;
}
function W2(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var dd = { stringify: K2, stripBom: W2 };
let Ii;
try {
  Ii = _t;
} catch {
  Ii = pn;
}
const nc = vt, { stringify: J0, stripBom: Q0 } = dd;
async function Y2(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || Ii, n = "throws" in t ? t.throws : !0;
  let i = await nc.fromCallback(r.readFile)(e, t);
  i = Q0(i);
  let o;
  try {
    o = JSON.parse(i, t ? t.reviver : null);
  } catch (a) {
    if (n)
      throw a.message = `${e}: ${a.message}`, a;
    return null;
  }
  return o;
}
const X2 = nc.fromPromise(Y2);
function J2(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || Ii, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = Q0(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function Q2(e, t, r = {}) {
  const n = r.fs || Ii, i = J0(t, r);
  await nc.fromCallback(n.writeFile)(e, i, r);
}
const Z2 = nc.fromPromise(Q2);
function ej(e, t, r = {}) {
  const n = r.fs || Ii, i = J0(t, r);
  return n.writeFileSync(e, i, r);
}
var tj = {
  readFile: X2,
  readFileSync: J2,
  writeFile: Z2,
  writeFileSync: ej
};
const xa = tj;
var rj = {
  // jsonfile exports
  readJson: xa.readFile,
  readJsonSync: xa.readFileSync,
  writeJson: xa.writeFile,
  writeJsonSync: xa.writeFileSync
};
const nj = vt.fromCallback, Po = _t, Z0 = ke, ev = yr, ij = Kn.pathExists;
function oj(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = Z0.dirname(e);
  ij(i, (o, a) => {
    if (o) return n(o);
    if (a) return Po.writeFile(e, t, r, n);
    ev.mkdirs(i, (s) => {
      if (s) return n(s);
      Po.writeFile(e, t, r, n);
    });
  });
}
function aj(e, ...t) {
  const r = Z0.dirname(e);
  if (Po.existsSync(r))
    return Po.writeFileSync(e, ...t);
  ev.mkdirsSync(r), Po.writeFileSync(e, ...t);
}
var hd = {
  outputFile: nj(oj),
  outputFileSync: aj
};
const { stringify: sj } = dd, { outputFile: cj } = hd;
async function lj(e, t, r = {}) {
  const n = sj(t, r);
  await cj(e, n, r);
}
var uj = lj;
const { stringify: fj } = dd, { outputFileSync: dj } = hd;
function hj(e, t, r) {
  const n = fj(t, r);
  dj(e, n, r);
}
var pj = hj;
const mj = vt.fromPromise, yt = rj;
yt.outputJson = mj(uj);
yt.outputJsonSync = pj;
yt.outputJSON = yt.outputJson;
yt.outputJSONSync = yt.outputJsonSync;
yt.writeJSON = yt.writeJson;
yt.writeJSONSync = yt.writeJsonSync;
yt.readJSON = yt.readJson;
yt.readJSONSync = yt.readJsonSync;
var yj = yt;
const gj = _t, Vl = ke, vj = ud.copy, tv = rc.remove, _j = yr.mkdirp, $j = Kn.pathExists, Up = Bi;
function wj(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  Up.checkPaths(e, t, "move", r, (o, a) => {
    if (o) return n(o);
    const { srcStat: s, isChangingCase: c = !1 } = a;
    Up.checkParentPaths(e, s, t, "move", (u) => {
      if (u) return n(u);
      if (Ej(t)) return Mp(e, t, i, c, n);
      _j(Vl.dirname(t), (l) => l ? n(l) : Mp(e, t, i, c, n));
    });
  });
}
function Ej(e) {
  const t = Vl.dirname(e);
  return Vl.parse(t).root === t;
}
function Mp(e, t, r, n, i) {
  if (n) return Jc(e, t, r, i);
  if (r)
    return tv(t, (o) => o ? i(o) : Jc(e, t, r, i));
  $j(t, (o, a) => o ? i(o) : a ? i(new Error("dest already exists.")) : Jc(e, t, r, i));
}
function Jc(e, t, r, n) {
  gj.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : bj(e, t, r, n) : n());
}
function bj(e, t, r, n) {
  vj(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (o) => o ? n(o) : tv(e, n));
}
var Sj = wj;
const rv = _t, ql = ke, Pj = ud.copySync, nv = rc.removeSync, Tj = yr.mkdirpSync, xp = Bi;
function Oj(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = xp.checkPathsSync(e, t, "move", r);
  return xp.checkParentPathsSync(e, i, t, "move"), Aj(t) || Tj(ql.dirname(t)), Nj(e, t, n, o);
}
function Aj(e) {
  const t = ql.dirname(e);
  return ql.parse(t).root === t;
}
function Nj(e, t, r, n) {
  if (n) return Qc(e, t, r);
  if (r)
    return nv(t), Qc(e, t, r);
  if (rv.existsSync(t)) throw new Error("dest already exists.");
  return Qc(e, t, r);
}
function Qc(e, t, r) {
  try {
    rv.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return Ij(e, t, r);
  }
}
function Ij(e, t, r) {
  return Pj(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), nv(e);
}
var Cj = Oj;
const Rj = vt.fromCallback;
var Dj = {
  move: Rj(Sj),
  moveSync: Cj
}, mn = {
  // Export promiseified graceful-fs:
  ...Gn,
  // Export extra methods:
  ...ud,
  ...v2,
  ...G2,
  ...yj,
  ...yr,
  ...Dj,
  ...hd,
  ...Kn,
  ...rc
}, jr = {}, ln = {}, Ge = {}, un = {};
Object.defineProperty(un, "__esModule", { value: !0 });
un.CancellationError = un.CancellationToken = void 0;
const kj = ty;
class jj extends kj.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new Bl());
    const r = () => {
      if (n != null)
        try {
          this.removeListener("cancel", n), n = null;
        } catch {
        }
    };
    let n = null;
    return new Promise((i, o) => {
      let a = null;
      if (n = () => {
        try {
          a != null && (a(), a = null);
        } finally {
          o(new Bl());
        }
      }, this.cancelled) {
        n();
        return;
      }
      this.onCancel(n), t(i, o, (s) => {
        a = s;
      });
    }).then((i) => (r(), i)).catch((i) => {
      throw r(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
un.CancellationToken = jj;
class Bl extends Error {
  constructor() {
    super("cancelled");
  }
}
un.CancellationError = Bl;
var Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.newError = Fj;
function Fj(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var mt = {}, Hl = { exports: {} }, Va = { exports: {} }, Zc, Vp;
function Lj() {
  if (Vp) return Zc;
  Vp = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, o = n * 365.25;
  Zc = function(l, f) {
    f = f || {};
    var h = typeof l;
    if (h === "string" && l.length > 0)
      return a(l);
    if (h === "number" && isFinite(l))
      return f.long ? c(l) : s(l);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(l)
    );
  };
  function a(l) {
    if (l = String(l), !(l.length > 100)) {
      var f = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        l
      );
      if (f) {
        var h = parseFloat(f[1]), p = (f[2] || "ms").toLowerCase();
        switch (p) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return h * o;
          case "weeks":
          case "week":
          case "w":
            return h * i;
          case "days":
          case "day":
          case "d":
            return h * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return h * r;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return h * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return h * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return h;
          default:
            return;
        }
      }
    }
  }
  function s(l) {
    var f = Math.abs(l);
    return f >= n ? Math.round(l / n) + "d" : f >= r ? Math.round(l / r) + "h" : f >= t ? Math.round(l / t) + "m" : f >= e ? Math.round(l / e) + "s" : l + "ms";
  }
  function c(l) {
    var f = Math.abs(l);
    return f >= n ? u(l, f, n, "day") : f >= r ? u(l, f, r, "hour") : f >= t ? u(l, f, t, "minute") : f >= e ? u(l, f, e, "second") : l + " ms";
  }
  function u(l, f, h, p) {
    var g = f >= h * 1.5;
    return Math.round(l / h) + " " + p + (g ? "s" : "");
  }
  return Zc;
}
var el, qp;
function iv() {
  if (qp) return el;
  qp = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = u, n.disable = s, n.enable = o, n.enabled = c, n.humanize = Lj(), n.destroy = l, Object.keys(t).forEach((f) => {
      n[f] = t[f];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(f) {
      let h = 0;
      for (let p = 0; p < f.length; p++)
        h = (h << 5) - h + f.charCodeAt(p), h |= 0;
      return n.colors[Math.abs(h) % n.colors.length];
    }
    n.selectColor = r;
    function n(f) {
      let h, p = null, g, $;
      function v(...y) {
        if (!v.enabled)
          return;
        const E = v, A = Number(/* @__PURE__ */ new Date()), C = A - (h || A);
        E.diff = C, E.prev = h, E.curr = A, h = A, y[0] = n.coerce(y[0]), typeof y[0] != "string" && y.unshift("%O");
        let D = 0;
        y[0] = y[0].replace(/%([a-zA-Z%])/g, (z, G) => {
          if (z === "%%")
            return "%";
          D++;
          const N = n.formatters[G];
          if (typeof N == "function") {
            const W = y[D];
            z = N.call(E, W), y.splice(D, 1), D--;
          }
          return z;
        }), n.formatArgs.call(E, y), (E.log || n.log).apply(E, y);
      }
      return v.namespace = f, v.useColors = n.useColors(), v.color = n.selectColor(f), v.extend = i, v.destroy = n.destroy, Object.defineProperty(v, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => p !== null ? p : (g !== n.namespaces && (g = n.namespaces, $ = n.enabled(f)), $),
        set: (y) => {
          p = y;
        }
      }), typeof n.init == "function" && n.init(v), v;
    }
    function i(f, h) {
      const p = n(this.namespace + (typeof h > "u" ? ":" : h) + f);
      return p.log = this.log, p;
    }
    function o(f) {
      n.save(f), n.namespaces = f, n.names = [], n.skips = [];
      const h = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const p of h)
        p[0] === "-" ? n.skips.push(p.slice(1)) : n.names.push(p);
    }
    function a(f, h) {
      let p = 0, g = 0, $ = -1, v = 0;
      for (; p < f.length; )
        if (g < h.length && (h[g] === f[p] || h[g] === "*"))
          h[g] === "*" ? ($ = g, v = p, g++) : (p++, g++);
        else if ($ !== -1)
          g = $ + 1, v++, p = v;
        else
          return !1;
      for (; g < h.length && h[g] === "*"; )
        g++;
      return g === h.length;
    }
    function s() {
      const f = [
        ...n.names,
        ...n.skips.map((h) => "-" + h)
      ].join(",");
      return n.enable(""), f;
    }
    function c(f) {
      for (const h of n.skips)
        if (a(f, h))
          return !1;
      for (const h of n.names)
        if (a(f, h))
          return !0;
      return !1;
    }
    function u(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function l() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return el = e, el;
}
var Bp;
function Uj() {
  return Bp || (Bp = 1, function(e, t) {
    t.formatArgs = n, t.save = i, t.load = o, t.useColors = r, t.storage = a(), t.destroy = /* @__PURE__ */ (() => {
      let c = !1;
      return () => {
        c || (c = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function r() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let c;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (c = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(c[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(c) {
      if (c[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + c[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const u = "color: " + this.color;
      c.splice(1, 0, u, "color: inherit");
      let l = 0, f = 0;
      c[0].replace(/%[a-zA-Z%]/g, (h) => {
        h !== "%%" && (l++, h === "%c" && (f = l));
      }), c.splice(f, 0, u);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(c) {
      try {
        c ? t.storage.setItem("debug", c) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function o() {
      let c;
      try {
        c = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    function a() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = iv()(t);
    const { formatters: s } = e.exports;
    s.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (u) {
        return "[UnexpectedJSONParseError]: " + u.message;
      }
    };
  }(Va, Va.exports)), Va.exports;
}
var qa = { exports: {} }, tl, Hp;
function Mj() {
  return Hp || (Hp = 1, tl = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), tl;
}
var rl, zp;
function xj() {
  if (zp) return rl;
  zp = 1;
  const e = ks, t = ry, r = Mj(), { env: n } = process;
  let i;
  r("no-color") || r("no-colors") || r("color=false") || r("color=never") ? i = 0 : (r("color") || r("colors") || r("color=true") || r("color=always")) && (i = 1), "FORCE_COLOR" in n && (n.FORCE_COLOR === "true" ? i = 1 : n.FORCE_COLOR === "false" ? i = 0 : i = n.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(n.FORCE_COLOR, 10), 3));
  function o(c) {
    return c === 0 ? !1 : {
      level: c,
      hasBasic: !0,
      has256: c >= 2,
      has16m: c >= 3
    };
  }
  function a(c, u) {
    if (i === 0)
      return 0;
    if (r("color=16m") || r("color=full") || r("color=truecolor"))
      return 3;
    if (r("color=256"))
      return 2;
    if (c && !u && i === void 0)
      return 0;
    const l = i || 0;
    if (n.TERM === "dumb")
      return l;
    if (process.platform === "win32") {
      const f = e.release().split(".");
      return Number(f[0]) >= 10 && Number(f[2]) >= 10586 ? Number(f[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((f) => f in n) || n.CI_NAME === "codeship" ? 1 : l;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const f = parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return f >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : l;
  }
  function s(c) {
    const u = a(c, c && c.isTTY);
    return o(u);
  }
  return rl = {
    supportsColor: s,
    stdout: o(a(!0, t.isatty(1))),
    stderr: o(a(!0, t.isatty(2)))
  }, rl;
}
var Gp;
function Vj() {
  return Gp || (Gp = 1, function(e, t) {
    const r = ry, n = nu;
    t.init = l, t.log = s, t.formatArgs = o, t.save = c, t.load = u, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = xj();
      h && (h.stderr || h).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((h) => /^debug_/i.test(h)).reduce((h, p) => {
      const g = p.substring(6).toLowerCase().replace(/_([a-z])/g, (v, y) => y.toUpperCase());
      let $ = process.env[p];
      return /^(yes|on|true|enabled)$/i.test($) ? $ = !0 : /^(no|off|false|disabled)$/i.test($) ? $ = !1 : $ === "null" ? $ = null : $ = Number($), h[g] = $, h;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function o(h) {
      const { namespace: p, useColors: g } = this;
      if (g) {
        const $ = this.color, v = "\x1B[3" + ($ < 8 ? $ : "8;5;" + $), y = `  ${v};1m${p} \x1B[0m`;
        h[0] = y + h[0].split(`
`).join(`
` + y), h.push(v + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        h[0] = a() + p + " " + h[0];
    }
    function a() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function s(...h) {
      return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...h) + `
`);
    }
    function c(h) {
      h ? process.env.DEBUG = h : delete process.env.DEBUG;
    }
    function u() {
      return process.env.DEBUG;
    }
    function l(h) {
      h.inspectOpts = {};
      const p = Object.keys(t.inspectOpts);
      for (let g = 0; g < p.length; g++)
        h.inspectOpts[p[g]] = t.inspectOpts[p[g]];
    }
    e.exports = iv()(t);
    const { formatters: f } = e.exports;
    f.o = function(h) {
      return this.inspectOpts.colors = this.useColors, n.inspect(h, this.inspectOpts).split(`
`).map((p) => p.trim()).join(" ");
    }, f.O = function(h) {
      return this.inspectOpts.colors = this.useColors, n.inspect(h, this.inspectOpts);
    };
  }(qa, qa.exports)), qa.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Hl.exports = Uj() : Hl.exports = Vj();
var qj = Hl.exports, ea = {};
Object.defineProperty(ea, "__esModule", { value: !0 });
ea.ProgressCallbackTransform = void 0;
const Bj = zo;
class Hj extends Bj.Transform {
  constructor(t, r, n) {
    super(), this.total = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
ea.ProgressCallbackTransform = Hj;
Object.defineProperty(mt, "__esModule", { value: !0 });
mt.DigestTransform = mt.HttpExecutor = mt.HttpError = void 0;
mt.createHttpError = zl;
mt.parseJson = Qj;
mt.configureRequestOptionsFromUrl = av;
mt.configureRequestUrl = md;
mt.safeGetHeader = Ei;
mt.configureRequestOptions = Ss;
mt.safeStringifyJson = Ps;
const zj = xn, Gj = qj, Kj = pn, Wj = zo, ov = Di, Yj = un, Kp = Hi, Xj = ea, io = (0, Gj.default)("electron-builder");
function zl(e, t = null) {
  return new pd(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Ps(e.headers), t);
}
const Jj = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class pd extends Error {
  constructor(t, r = `HTTP error: ${Jj.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
mt.HttpError = pd;
function Qj(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class bs {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new Yj.CancellationToken(), n) {
    Ss(t);
    const i = n == null ? void 0 : JSON.stringify(n), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      io(i);
      const { headers: a, ...s } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": o.length,
          ...a
        },
        ...s
      };
    }
    return this.doApiRequest(t, r, (a) => a.end(o));
  }
  doApiRequest(t, r, n, i = 0) {
    return io.enabled && io(`Request: ${Ps(t)}`), r.createPromise((o, a, s) => {
      const c = this.createRequest(t, (u) => {
        try {
          this.handleResponse(u, t, r, o, a, i, n);
        } catch (l) {
          a(l);
        }
      });
      this.addErrorAndTimeoutHandlers(c, a, t.timeout), this.addRedirectHandlers(c, t, a, i, (u) => {
        this.doApiRequest(u, r, n, i).then(o).catch(a);
      }), n(c, a), s(() => c.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, r, n, i, o) {
  }
  addErrorAndTimeoutHandlers(t, r, n = 60 * 1e3) {
    this.addTimeOutHandler(t, r, n), t.on("error", r), t.on("aborted", () => {
      r(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, r, n, i, o, a, s) {
    var c;
    if (io.enabled && io(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Ps(r)}`), t.statusCode === 404) {
      o(zl(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const u = (c = t.statusCode) !== null && c !== void 0 ? c : 0, l = u >= 300 && u < 400, f = Ei(t, "location");
    if (l && f != null) {
      if (a > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(bs.prepareRedirectUrlOptions(f, r), n, s, a).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", o), t.on("data", (p) => h += p), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const p = Ei(t, "content-type"), g = p != null && (Array.isArray(p) ? p.find(($) => $.includes("json")) != null : p.includes("json"));
          o(zl(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${g ? JSON.stringify(JSON.parse(h)) : h}
          `));
        } else
          i(h.length === 0 ? null : h);
      } catch (p) {
        o(p);
      }
    });
  }
  async downloadToBuffer(t, r) {
    return await r.cancellationToken.createPromise((n, i, o) => {
      const a = [], s = {
        headers: r.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      md(t, s), Ss(s), this.doDownload(s, {
        destination: null,
        options: r,
        onCancel: o,
        callback: (c) => {
          c == null ? n(Buffer.concat(a)) : i(c);
        },
        responseHandler: (c, u) => {
          let l = 0;
          c.on("data", (f) => {
            if (l += f.length, l > 524288e3) {
              u(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            a.push(f);
          }), c.on("end", () => {
            u(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, r, n) {
    const i = this.createRequest(t, (o) => {
      if (o.statusCode >= 400) {
        r.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${o.statusCode}: ${o.statusMessage}`));
        return;
      }
      o.on("error", r.callback);
      const a = Ei(o, "location");
      if (a != null) {
        n < this.maxRedirects ? this.doDownload(bs.prepareRedirectUrlOptions(a, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? eF(r, o) : r.responseHandler(o, r.callback);
    });
    this.addErrorAndTimeoutHandlers(i, r.callback, t.timeout), this.addRedirectHandlers(i, t, r.callback, n, (o) => {
      this.doDownload(o, r, n++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, r, n) {
    t.on("socket", (i) => {
      i.setTimeout(n, () => {
        t.abort(), r(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, r) {
    const n = av(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const o = new ov.URL(t);
      (o.hostname.endsWith(".amazonaws.com") || o.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return n;
  }
  static retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return t();
      } catch (i) {
        if (n < r && (i instanceof pd && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
mt.HttpExecutor = bs;
function av(e, t) {
  const r = Ss(t);
  return md(new ov.URL(e), r), r;
}
function md(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Gl extends Wj.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, zj.createHash)(r);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, r, n) {
    this.digester.update(t), n(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (r) {
        t(r);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, Kp.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, Kp.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
mt.DigestTransform = Gl;
function Zj(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function Ei(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function eF(e, t) {
  if (!Zj(Ei(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const a = Ei(t, "content-length");
    a != null && r.push(new Xj.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new Gl(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new Gl(e.options.sha2, "sha256", "hex"));
  const i = (0, Kj.createWriteStream)(e.destination);
  r.push(i);
  let o = t;
  for (const a of r)
    a.on("error", (s) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(s);
    }), o = o.pipe(a);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function Ss(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function Ps(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var ic = {};
Object.defineProperty(ic, "__esModule", { value: !0 });
ic.MemoLazy = void 0;
class tF {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && sv(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
ic.MemoLazy = tF;
function sv(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((a) => sv(e[a], t[a]));
  }
  return e === t;
}
var oc = {};
Object.defineProperty(oc, "__esModule", { value: !0 });
oc.githubUrl = rF;
oc.getS3LikeProviderBaseUrl = nF;
function rF(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function nF(e) {
  const t = e.provider;
  if (t === "s3")
    return iF(e);
  if (t === "spaces")
    return oF(e);
  throw new Error(`Not supported provider: ${t}`);
}
function iF(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return cv(t, e.path);
}
function cv(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function oF(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return cv(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var yd = {};
Object.defineProperty(yd, "__esModule", { value: !0 });
yd.retry = lv;
const aF = un;
async function lv(e, t, r, n = 0, i = 0, o) {
  var a;
  const s = new aF.CancellationToken();
  try {
    return await e();
  } catch (c) {
    if ((!((a = o == null ? void 0 : o(c)) !== null && a !== void 0) || a) && t > 0 && !s.cancelled)
      return await new Promise((u) => setTimeout(u, r + n * i)), await lv(e, t - 1, r, n, i + 1, o);
    throw c;
  }
}
var gd = {};
Object.defineProperty(gd, "__esModule", { value: !0 });
gd.parseDn = sF;
function sF(e) {
  let t = !1, r = null, n = "", i = 0;
  e = e.trim();
  const o = /* @__PURE__ */ new Map();
  for (let a = 0; a <= e.length; a++) {
    if (a === e.length) {
      r !== null && o.set(r, n);
      break;
    }
    const s = e[a];
    if (t) {
      if (s === '"') {
        t = !1;
        continue;
      }
    } else {
      if (s === '"') {
        t = !0;
        continue;
      }
      if (s === "\\") {
        a++;
        const c = parseInt(e.slice(a, a + 2), 16);
        Number.isNaN(c) ? n += e[a] : (a++, n += String.fromCharCode(c));
        continue;
      }
      if (r === null && s === "=") {
        r = n, n = "";
        continue;
      }
      if (s === "," || s === ";" || s === "+") {
        r !== null && o.set(r, n), r = null, n = "";
        continue;
      }
    }
    if (s === " " && !t) {
      if (n.length === 0)
        continue;
      if (a > i) {
        let c = a;
        for (; e[c] === " "; )
          c++;
        i = c;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || r === null && e[i] === "=" || r !== null && e[i] === "+") {
        a = i - 1;
        continue;
      }
    }
    n += s;
  }
  return o;
}
var Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.nil = Ci.UUID = void 0;
const uv = xn, fv = Hi, cF = "options.name must be either a string or a Buffer", Wp = (0, uv.randomBytes)(16);
Wp[0] = Wp[0] | 1;
const ss = {}, ge = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  ss[t] = e, ge[e] = t;
}
class zn {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = zn.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return lF(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = uF(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (ss[t[14] + t[15]] & 240) >> 4,
        variant: Yp((ss[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < r + 16)
        return !1;
      let n = 0;
      for (; n < 16 && t[r + n] === 0; n++)
        ;
      return n === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[r + 6] & 240) >> 4,
        variant: Yp((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, fv.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = ss[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
Ci.UUID = zn;
zn.OID = zn.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Yp(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var To;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(To || (To = {}));
function lF(e, t, r, n, i = To.ASCII) {
  const o = (0, uv.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, fv.newError)(cF, "ERR_INVALID_UUID_NAME");
  o.update(n), o.update(e);
  const s = o.digest();
  let c;
  switch (i) {
    case To.BINARY:
      s[6] = s[6] & 15 | r, s[8] = s[8] & 63 | 128, c = s;
      break;
    case To.OBJECT:
      s[6] = s[6] & 15 | r, s[8] = s[8] & 63 | 128, c = new zn(s);
      break;
    default:
      c = ge[s[0]] + ge[s[1]] + ge[s[2]] + ge[s[3]] + "-" + ge[s[4]] + ge[s[5]] + "-" + ge[s[6] & 15 | r] + ge[s[7]] + "-" + ge[s[8] & 63 | 128] + ge[s[9]] + "-" + ge[s[10]] + ge[s[11]] + ge[s[12]] + ge[s[13]] + ge[s[14]] + ge[s[15]];
      break;
  }
  return c;
}
function uF(e) {
  return ge[e[0]] + ge[e[1]] + ge[e[2]] + ge[e[3]] + "-" + ge[e[4]] + ge[e[5]] + "-" + ge[e[6]] + ge[e[7]] + "-" + ge[e[8]] + ge[e[9]] + "-" + ge[e[10]] + ge[e[11]] + ge[e[12]] + ge[e[13]] + ge[e[14]] + ge[e[15]];
}
Ci.nil = new zn("00000000-0000-0000-0000-000000000000");
var ta = {}, dv = {};
(function(e) {
  (function(t) {
    t.parser = function(w, _) {
      return new n(w, _);
    }, t.SAXParser = n, t.SAXStream = l, t.createStream = u, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var r = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function n(w, _) {
      if (!(this instanceof n))
        return new n(w, _);
      var k = this;
      o(k), k.q = k.c = "", k.bufferCheckPosition = t.MAX_BUFFER_LENGTH, k.opt = _ || {}, k.opt.lowercase = k.opt.lowercase || k.opt.lowercasetags, k.looseCase = k.opt.lowercase ? "toLowerCase" : "toUpperCase", k.tags = [], k.closed = k.closedRoot = k.sawRoot = !1, k.tag = k.error = null, k.strict = !!w, k.noscript = !!(w || k.opt.noscript), k.state = N.BEGIN, k.strictEntities = k.opt.strictEntities, k.ENTITIES = k.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), k.attribList = [], k.opt.xmlns && (k.ns = Object.create($)), k.opt.unquotedAttributeValues === void 0 && (k.opt.unquotedAttributeValues = !w), k.trackPosition = k.opt.position !== !1, k.trackPosition && (k.position = k.line = k.column = 0), M(k, "onready");
    }
    Object.create || (Object.create = function(w) {
      function _() {
      }
      _.prototype = w;
      var k = new _();
      return k;
    }), Object.keys || (Object.keys = function(w) {
      var _ = [];
      for (var k in w) w.hasOwnProperty(k) && _.push(k);
      return _;
    });
    function i(w) {
      for (var _ = Math.max(t.MAX_BUFFER_LENGTH, 10), k = 0, I = 0, Y = r.length; I < Y; I++) {
        var ne = w[r[I]].length;
        if (ne > _)
          switch (r[I]) {
            case "textNode":
              J(w);
              break;
            case "cdata":
              x(w, "oncdata", w.cdata), w.cdata = "";
              break;
            case "script":
              x(w, "onscript", w.script), w.script = "";
              break;
            default:
              L(w, "Max buffer length exceeded: " + r[I]);
          }
        k = Math.max(k, ne);
      }
      var ye = t.MAX_BUFFER_LENGTH - k;
      w.bufferCheckPosition = ye + w.position;
    }
    function o(w) {
      for (var _ = 0, k = r.length; _ < k; _++)
        w[r[_]] = "";
    }
    function a(w) {
      J(w), w.cdata !== "" && (x(w, "oncdata", w.cdata), w.cdata = ""), w.script !== "" && (x(w, "onscript", w.script), w.script = "");
    }
    n.prototype = {
      end: function() {
        H(this);
      },
      write: P,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        a(this);
      }
    };
    var s;
    try {
      s = require("stream").Stream;
    } catch {
      s = function() {
      };
    }
    s || (s = function() {
    });
    var c = t.EVENTS.filter(function(w) {
      return w !== "error" && w !== "end";
    });
    function u(w, _) {
      return new l(w, _);
    }
    function l(w, _) {
      if (!(this instanceof l))
        return new l(w, _);
      s.apply(this), this._parser = new n(w, _), this.writable = !0, this.readable = !0;
      var k = this;
      this._parser.onend = function() {
        k.emit("end");
      }, this._parser.onerror = function(I) {
        k.emit("error", I), k._parser.error = null;
      }, this._decoder = null, c.forEach(function(I) {
        Object.defineProperty(k, "on" + I, {
          get: function() {
            return k._parser["on" + I];
          },
          set: function(Y) {
            if (!Y)
              return k.removeAllListeners(I), k._parser["on" + I] = Y, Y;
            k.on(I, Y);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    l.prototype = Object.create(s.prototype, {
      constructor: {
        value: l
      }
    }), l.prototype.write = function(w) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(w)) {
        if (!this._decoder) {
          var _ = w$.StringDecoder;
          this._decoder = new _("utf8");
        }
        w = this._decoder.write(w);
      }
      return this._parser.write(w.toString()), this.emit("data", w), !0;
    }, l.prototype.end = function(w) {
      return w && w.length && this.write(w), this._parser.end(), !0;
    }, l.prototype.on = function(w, _) {
      var k = this;
      return !k._parser["on" + w] && c.indexOf(w) !== -1 && (k._parser["on" + w] = function() {
        var I = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        I.splice(0, 0, w), k.emit.apply(k, I);
      }), s.prototype.on.call(k, w, _);
    };
    var f = "[CDATA[", h = "DOCTYPE", p = "http://www.w3.org/XML/1998/namespace", g = "http://www.w3.org/2000/xmlns/", $ = { xml: p, xmlns: g }, v = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, y = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, E = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, A = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function C(w) {
      return w === " " || w === `
` || w === "\r" || w === "	";
    }
    function D(w) {
      return w === '"' || w === "'";
    }
    function V(w) {
      return w === ">" || C(w);
    }
    function z(w, _) {
      return w.test(_);
    }
    function G(w, _) {
      return !z(w, _);
    }
    var N = 0;
    t.STATE = {
      BEGIN: N++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: N++,
      // leading whitespace
      TEXT: N++,
      // general stuff
      TEXT_ENTITY: N++,
      // &amp and such.
      OPEN_WAKA: N++,
      // <
      SGML_DECL: N++,
      // <!BLARG
      SGML_DECL_QUOTED: N++,
      // <!BLARG foo "bar
      DOCTYPE: N++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: N++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: N++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: N++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: N++,
      // <!-
      COMMENT: N++,
      // <!--
      COMMENT_ENDING: N++,
      // <!-- blah -
      COMMENT_ENDED: N++,
      // <!-- blah --
      CDATA: N++,
      // <![CDATA[ something
      CDATA_ENDING: N++,
      // ]
      CDATA_ENDING_2: N++,
      // ]]
      PROC_INST: N++,
      // <?hi
      PROC_INST_BODY: N++,
      // <?hi there
      PROC_INST_ENDING: N++,
      // <?hi "there" ?
      OPEN_TAG: N++,
      // <strong
      OPEN_TAG_SLASH: N++,
      // <strong /
      ATTRIB: N++,
      // <a
      ATTRIB_NAME: N++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: N++,
      // <a foo _
      ATTRIB_VALUE: N++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: N++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: N++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: N++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: N++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: N++,
      // <foo bar=&quot
      CLOSE_TAG: N++,
      // </a
      CLOSE_TAG_SAW_WHITE: N++,
      // </a   >
      SCRIPT: N++,
      // <script> ...
      SCRIPT_ENDING: N++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(w) {
      var _ = t.ENTITIES[w], k = typeof _ == "number" ? String.fromCharCode(_) : _;
      t.ENTITIES[w] = k;
    });
    for (var W in t.STATE)
      t.STATE[t.STATE[W]] = W;
    N = t.STATE;
    function M(w, _, k) {
      w[_] && w[_](k);
    }
    function x(w, _, k) {
      w.textNode && J(w), M(w, _, k);
    }
    function J(w) {
      w.textNode = F(w.opt, w.textNode), w.textNode && M(w, "ontext", w.textNode), w.textNode = "";
    }
    function F(w, _) {
      return w.trim && (_ = _.trim()), w.normalize && (_ = _.replace(/\s+/g, " ")), _;
    }
    function L(w, _) {
      return J(w), w.trackPosition && (_ += `
Line: ` + w.line + `
Column: ` + w.column + `
Char: ` + w.c), _ = new Error(_), w.error = _, M(w, "onerror", _), w;
    }
    function H(w) {
      return w.sawRoot && !w.closedRoot && U(w, "Unclosed root tag"), w.state !== N.BEGIN && w.state !== N.BEGIN_WHITESPACE && w.state !== N.TEXT && L(w, "Unexpected end"), J(w), w.c = "", w.closed = !0, M(w, "onend"), n.call(w, w.strict, w.opt), w;
    }
    function U(w, _) {
      if (typeof w != "object" || !(w instanceof n))
        throw new Error("bad call to strictFail");
      w.strict && L(w, _);
    }
    function K(w) {
      w.strict || (w.tagName = w.tagName[w.looseCase]());
      var _ = w.tags[w.tags.length - 1] || w, k = w.tag = { name: w.tagName, attributes: {} };
      w.opt.xmlns && (k.ns = _.ns), w.attribList.length = 0, x(w, "onopentagstart", k);
    }
    function B(w, _) {
      var k = w.indexOf(":"), I = k < 0 ? ["", w] : w.split(":"), Y = I[0], ne = I[1];
      return _ && w === "xmlns" && (Y = "xmlns", ne = ""), { prefix: Y, local: ne };
    }
    function R(w) {
      if (w.strict || (w.attribName = w.attribName[w.looseCase]()), w.attribList.indexOf(w.attribName) !== -1 || w.tag.attributes.hasOwnProperty(w.attribName)) {
        w.attribName = w.attribValue = "";
        return;
      }
      if (w.opt.xmlns) {
        var _ = B(w.attribName, !0), k = _.prefix, I = _.local;
        if (k === "xmlns")
          if (I === "xml" && w.attribValue !== p)
            U(
              w,
              "xml: prefix must be bound to " + p + `
Actual: ` + w.attribValue
            );
          else if (I === "xmlns" && w.attribValue !== g)
            U(
              w,
              "xmlns: prefix must be bound to " + g + `
Actual: ` + w.attribValue
            );
          else {
            var Y = w.tag, ne = w.tags[w.tags.length - 1] || w;
            Y.ns === ne.ns && (Y.ns = Object.create(ne.ns)), Y.ns[I] = w.attribValue;
          }
        w.attribList.push([w.attribName, w.attribValue]);
      } else
        w.tag.attributes[w.attribName] = w.attribValue, x(w, "onattribute", {
          name: w.attribName,
          value: w.attribValue
        });
      w.attribName = w.attribValue = "";
    }
    function b(w, _) {
      if (w.opt.xmlns) {
        var k = w.tag, I = B(w.tagName);
        k.prefix = I.prefix, k.local = I.local, k.uri = k.ns[I.prefix] || "", k.prefix && !k.uri && (U(
          w,
          "Unbound namespace prefix: " + JSON.stringify(w.tagName)
        ), k.uri = I.prefix);
        var Y = w.tags[w.tags.length - 1] || w;
        k.ns && Y.ns !== k.ns && Object.keys(k.ns).forEach(function(jt) {
          x(w, "onopennamespace", {
            prefix: jt,
            uri: k.ns[jt]
          });
        });
        for (var ne = 0, ye = w.attribList.length; ne < ye; ne++) {
          var _e = w.attribList[ne], $e = _e[0], Ce = _e[1], ve = B($e, !0), Fe = ve.prefix, Bt = ve.local, kt = Fe === "" ? "" : k.ns[Fe] || "", At = {
            name: $e,
            value: Ce,
            prefix: Fe,
            local: Bt,
            uri: kt
          };
          Fe && Fe !== "xmlns" && !kt && (U(
            w,
            "Unbound namespace prefix: " + JSON.stringify(Fe)
          ), At.uri = Fe), w.tag.attributes[$e] = At, x(w, "onattribute", At);
        }
        w.attribList.length = 0;
      }
      w.tag.isSelfClosing = !!_, w.sawRoot = !0, w.tags.push(w.tag), x(w, "onopentag", w.tag), _ || (!w.noscript && w.tagName.toLowerCase() === "script" ? w.state = N.SCRIPT : w.state = N.TEXT, w.tag = null, w.tagName = ""), w.attribName = w.attribValue = "", w.attribList.length = 0;
    }
    function O(w) {
      if (!w.tagName) {
        U(w, "Weird empty close tag."), w.textNode += "</>", w.state = N.TEXT;
        return;
      }
      if (w.script) {
        if (w.tagName !== "script") {
          w.script += "</" + w.tagName + ">", w.tagName = "", w.state = N.SCRIPT;
          return;
        }
        x(w, "onscript", w.script), w.script = "";
      }
      var _ = w.tags.length, k = w.tagName;
      w.strict || (k = k[w.looseCase]());
      for (var I = k; _--; ) {
        var Y = w.tags[_];
        if (Y.name !== I)
          U(w, "Unexpected close tag");
        else
          break;
      }
      if (_ < 0) {
        U(w, "Unmatched closing tag: " + w.tagName), w.textNode += "</" + w.tagName + ">", w.state = N.TEXT;
        return;
      }
      w.tagName = k;
      for (var ne = w.tags.length; ne-- > _; ) {
        var ye = w.tag = w.tags.pop();
        w.tagName = w.tag.name, x(w, "onclosetag", w.tagName);
        var _e = {};
        for (var $e in ye.ns)
          _e[$e] = ye.ns[$e];
        var Ce = w.tags[w.tags.length - 1] || w;
        w.opt.xmlns && ye.ns !== Ce.ns && Object.keys(ye.ns).forEach(function(ve) {
          var Fe = ye.ns[ve];
          x(w, "onclosenamespace", { prefix: ve, uri: Fe });
        });
      }
      _ === 0 && (w.closedRoot = !0), w.tagName = w.attribValue = w.attribName = "", w.attribList.length = 0, w.state = N.TEXT;
    }
    function S(w) {
      var _ = w.entity, k = _.toLowerCase(), I, Y = "";
      return w.ENTITIES[_] ? w.ENTITIES[_] : w.ENTITIES[k] ? w.ENTITIES[k] : (_ = k, _.charAt(0) === "#" && (_.charAt(1) === "x" ? (_ = _.slice(2), I = parseInt(_, 16), Y = I.toString(16)) : (_ = _.slice(1), I = parseInt(_, 10), Y = I.toString(10))), _ = _.replace(/^0+/, ""), isNaN(I) || Y.toLowerCase() !== _ || I < 0 || I > 1114111 ? (U(w, "Invalid character entity"), "&" + w.entity + ";") : String.fromCodePoint(I));
    }
    function d(w, _) {
      _ === "<" ? (w.state = N.OPEN_WAKA, w.startTagPosition = w.position) : C(_) || (U(w, "Non-whitespace before first tag."), w.textNode = _, w.state = N.TEXT);
    }
    function m(w, _) {
      var k = "";
      return _ < w.length && (k = w.charAt(_)), k;
    }
    function P(w) {
      var _ = this;
      if (this.error)
        throw this.error;
      if (_.closed)
        return L(
          _,
          "Cannot write after close. Assign an onready handler."
        );
      if (w === null)
        return H(_);
      typeof w == "object" && (w = w.toString());
      for (var k = 0, I = ""; I = m(w, k++), _.c = I, !!I; )
        switch (_.trackPosition && (_.position++, I === `
` ? (_.line++, _.column = 0) : _.column++), _.state) {
          case N.BEGIN:
            if (_.state = N.BEGIN_WHITESPACE, I === "\uFEFF")
              continue;
            d(_, I);
            continue;
          case N.BEGIN_WHITESPACE:
            d(_, I);
            continue;
          case N.TEXT:
            if (_.sawRoot && !_.closedRoot) {
              for (var ne = k - 1; I && I !== "<" && I !== "&"; )
                I = m(w, k++), I && _.trackPosition && (_.position++, I === `
` ? (_.line++, _.column = 0) : _.column++);
              _.textNode += w.substring(ne, k - 1);
            }
            I === "<" && !(_.sawRoot && _.closedRoot && !_.strict) ? (_.state = N.OPEN_WAKA, _.startTagPosition = _.position) : (!C(I) && (!_.sawRoot || _.closedRoot) && U(_, "Text data outside of root node."), I === "&" ? _.state = N.TEXT_ENTITY : _.textNode += I);
            continue;
          case N.SCRIPT:
            I === "<" ? _.state = N.SCRIPT_ENDING : _.script += I;
            continue;
          case N.SCRIPT_ENDING:
            I === "/" ? _.state = N.CLOSE_TAG : (_.script += "<" + I, _.state = N.SCRIPT);
            continue;
          case N.OPEN_WAKA:
            if (I === "!")
              _.state = N.SGML_DECL, _.sgmlDecl = "";
            else if (!C(I)) if (z(v, I))
              _.state = N.OPEN_TAG, _.tagName = I;
            else if (I === "/")
              _.state = N.CLOSE_TAG, _.tagName = "";
            else if (I === "?")
              _.state = N.PROC_INST, _.procInstName = _.procInstBody = "";
            else {
              if (U(_, "Unencoded <"), _.startTagPosition + 1 < _.position) {
                var Y = _.position - _.startTagPosition;
                I = new Array(Y).join(" ") + I;
              }
              _.textNode += "<" + I, _.state = N.TEXT;
            }
            continue;
          case N.SGML_DECL:
            if (_.sgmlDecl + I === "--") {
              _.state = N.COMMENT, _.comment = "", _.sgmlDecl = "";
              continue;
            }
            _.doctype && _.doctype !== !0 && _.sgmlDecl ? (_.state = N.DOCTYPE_DTD, _.doctype += "<!" + _.sgmlDecl + I, _.sgmlDecl = "") : (_.sgmlDecl + I).toUpperCase() === f ? (x(_, "onopencdata"), _.state = N.CDATA, _.sgmlDecl = "", _.cdata = "") : (_.sgmlDecl + I).toUpperCase() === h ? (_.state = N.DOCTYPE, (_.doctype || _.sawRoot) && U(
              _,
              "Inappropriately located doctype declaration"
            ), _.doctype = "", _.sgmlDecl = "") : I === ">" ? (x(_, "onsgmldeclaration", _.sgmlDecl), _.sgmlDecl = "", _.state = N.TEXT) : (D(I) && (_.state = N.SGML_DECL_QUOTED), _.sgmlDecl += I);
            continue;
          case N.SGML_DECL_QUOTED:
            I === _.q && (_.state = N.SGML_DECL, _.q = ""), _.sgmlDecl += I;
            continue;
          case N.DOCTYPE:
            I === ">" ? (_.state = N.TEXT, x(_, "ondoctype", _.doctype), _.doctype = !0) : (_.doctype += I, I === "[" ? _.state = N.DOCTYPE_DTD : D(I) && (_.state = N.DOCTYPE_QUOTED, _.q = I));
            continue;
          case N.DOCTYPE_QUOTED:
            _.doctype += I, I === _.q && (_.q = "", _.state = N.DOCTYPE);
            continue;
          case N.DOCTYPE_DTD:
            I === "]" ? (_.doctype += I, _.state = N.DOCTYPE) : I === "<" ? (_.state = N.OPEN_WAKA, _.startTagPosition = _.position) : D(I) ? (_.doctype += I, _.state = N.DOCTYPE_DTD_QUOTED, _.q = I) : _.doctype += I;
            continue;
          case N.DOCTYPE_DTD_QUOTED:
            _.doctype += I, I === _.q && (_.state = N.DOCTYPE_DTD, _.q = "");
            continue;
          case N.COMMENT:
            I === "-" ? _.state = N.COMMENT_ENDING : _.comment += I;
            continue;
          case N.COMMENT_ENDING:
            I === "-" ? (_.state = N.COMMENT_ENDED, _.comment = F(_.opt, _.comment), _.comment && x(_, "oncomment", _.comment), _.comment = "") : (_.comment += "-" + I, _.state = N.COMMENT);
            continue;
          case N.COMMENT_ENDED:
            I !== ">" ? (U(_, "Malformed comment"), _.comment += "--" + I, _.state = N.COMMENT) : _.doctype && _.doctype !== !0 ? _.state = N.DOCTYPE_DTD : _.state = N.TEXT;
            continue;
          case N.CDATA:
            for (var ne = k - 1; I && I !== "]"; )
              I = m(w, k++), I && _.trackPosition && (_.position++, I === `
` ? (_.line++, _.column = 0) : _.column++);
            _.cdata += w.substring(ne, k - 1), I === "]" && (_.state = N.CDATA_ENDING);
            continue;
          case N.CDATA_ENDING:
            I === "]" ? _.state = N.CDATA_ENDING_2 : (_.cdata += "]" + I, _.state = N.CDATA);
            continue;
          case N.CDATA_ENDING_2:
            I === ">" ? (_.cdata && x(_, "oncdata", _.cdata), x(_, "onclosecdata"), _.cdata = "", _.state = N.TEXT) : I === "]" ? _.cdata += "]" : (_.cdata += "]]" + I, _.state = N.CDATA);
            continue;
          case N.PROC_INST:
            I === "?" ? _.state = N.PROC_INST_ENDING : C(I) ? _.state = N.PROC_INST_BODY : _.procInstName += I;
            continue;
          case N.PROC_INST_BODY:
            if (!_.procInstBody && C(I))
              continue;
            I === "?" ? _.state = N.PROC_INST_ENDING : _.procInstBody += I;
            continue;
          case N.PROC_INST_ENDING:
            I === ">" ? (x(_, "onprocessinginstruction", {
              name: _.procInstName,
              body: _.procInstBody
            }), _.procInstName = _.procInstBody = "", _.state = N.TEXT) : (_.procInstBody += "?" + I, _.state = N.PROC_INST_BODY);
            continue;
          case N.OPEN_TAG:
            z(y, I) ? _.tagName += I : (K(_), I === ">" ? b(_) : I === "/" ? _.state = N.OPEN_TAG_SLASH : (C(I) || U(_, "Invalid character in tag name"), _.state = N.ATTRIB));
            continue;
          case N.OPEN_TAG_SLASH:
            I === ">" ? (b(_, !0), O(_)) : (U(
              _,
              "Forward-slash in opening tag not followed by >"
            ), _.state = N.ATTRIB);
            continue;
          case N.ATTRIB:
            if (C(I))
              continue;
            I === ">" ? b(_) : I === "/" ? _.state = N.OPEN_TAG_SLASH : z(v, I) ? (_.attribName = I, _.attribValue = "", _.state = N.ATTRIB_NAME) : U(_, "Invalid attribute name");
            continue;
          case N.ATTRIB_NAME:
            I === "=" ? _.state = N.ATTRIB_VALUE : I === ">" ? (U(_, "Attribute without value"), _.attribValue = _.attribName, R(_), b(_)) : C(I) ? _.state = N.ATTRIB_NAME_SAW_WHITE : z(y, I) ? _.attribName += I : U(_, "Invalid attribute name");
            continue;
          case N.ATTRIB_NAME_SAW_WHITE:
            if (I === "=")
              _.state = N.ATTRIB_VALUE;
            else {
              if (C(I))
                continue;
              U(_, "Attribute without value"), _.tag.attributes[_.attribName] = "", _.attribValue = "", x(_, "onattribute", {
                name: _.attribName,
                value: ""
              }), _.attribName = "", I === ">" ? b(_) : z(v, I) ? (_.attribName = I, _.state = N.ATTRIB_NAME) : (U(_, "Invalid attribute name"), _.state = N.ATTRIB);
            }
            continue;
          case N.ATTRIB_VALUE:
            if (C(I))
              continue;
            D(I) ? (_.q = I, _.state = N.ATTRIB_VALUE_QUOTED) : (_.opt.unquotedAttributeValues || L(_, "Unquoted attribute value"), _.state = N.ATTRIB_VALUE_UNQUOTED, _.attribValue = I);
            continue;
          case N.ATTRIB_VALUE_QUOTED:
            if (I !== _.q) {
              I === "&" ? _.state = N.ATTRIB_VALUE_ENTITY_Q : _.attribValue += I;
              continue;
            }
            R(_), _.q = "", _.state = N.ATTRIB_VALUE_CLOSED;
            continue;
          case N.ATTRIB_VALUE_CLOSED:
            C(I) ? _.state = N.ATTRIB : I === ">" ? b(_) : I === "/" ? _.state = N.OPEN_TAG_SLASH : z(v, I) ? (U(_, "No whitespace between attributes"), _.attribName = I, _.attribValue = "", _.state = N.ATTRIB_NAME) : U(_, "Invalid attribute name");
            continue;
          case N.ATTRIB_VALUE_UNQUOTED:
            if (!V(I)) {
              I === "&" ? _.state = N.ATTRIB_VALUE_ENTITY_U : _.attribValue += I;
              continue;
            }
            R(_), I === ">" ? b(_) : _.state = N.ATTRIB;
            continue;
          case N.CLOSE_TAG:
            if (_.tagName)
              I === ">" ? O(_) : z(y, I) ? _.tagName += I : _.script ? (_.script += "</" + _.tagName, _.tagName = "", _.state = N.SCRIPT) : (C(I) || U(_, "Invalid tagname in closing tag"), _.state = N.CLOSE_TAG_SAW_WHITE);
            else {
              if (C(I))
                continue;
              G(v, I) ? _.script ? (_.script += "</" + I, _.state = N.SCRIPT) : U(_, "Invalid tagname in closing tag.") : _.tagName = I;
            }
            continue;
          case N.CLOSE_TAG_SAW_WHITE:
            if (C(I))
              continue;
            I === ">" ? O(_) : U(_, "Invalid characters in closing tag");
            continue;
          case N.TEXT_ENTITY:
          case N.ATTRIB_VALUE_ENTITY_Q:
          case N.ATTRIB_VALUE_ENTITY_U:
            var ye, _e;
            switch (_.state) {
              case N.TEXT_ENTITY:
                ye = N.TEXT, _e = "textNode";
                break;
              case N.ATTRIB_VALUE_ENTITY_Q:
                ye = N.ATTRIB_VALUE_QUOTED, _e = "attribValue";
                break;
              case N.ATTRIB_VALUE_ENTITY_U:
                ye = N.ATTRIB_VALUE_UNQUOTED, _e = "attribValue";
                break;
            }
            if (I === ";") {
              var $e = S(_);
              _.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes($e) ? (_.entity = "", _.state = ye, _.write($e)) : (_[_e] += $e, _.entity = "", _.state = ye);
            } else z(_.entity.length ? A : E, I) ? _.entity += I : (U(_, "Invalid character in entity name"), _[_e] += "&" + _.entity + I, _.entity = "", _.state = ye);
            continue;
          default:
            throw new Error(_, "Unknown state: " + _.state);
        }
      return _.position >= _.bufferCheckPosition && i(_), _;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var w = String.fromCharCode, _ = Math.floor, k = function() {
        var I = 16384, Y = [], ne, ye, _e = -1, $e = arguments.length;
        if (!$e)
          return "";
        for (var Ce = ""; ++_e < $e; ) {
          var ve = Number(arguments[_e]);
          if (!isFinite(ve) || // `NaN`, `+Infinity`, or `-Infinity`
          ve < 0 || // not a valid Unicode code point
          ve > 1114111 || // not a valid Unicode code point
          _(ve) !== ve)
            throw RangeError("Invalid code point: " + ve);
          ve <= 65535 ? Y.push(ve) : (ve -= 65536, ne = (ve >> 10) + 55296, ye = ve % 1024 + 56320, Y.push(ne, ye)), (_e + 1 === $e || Y.length > I) && (Ce += w.apply(null, Y), Y.length = 0);
        }
        return Ce;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: k,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = k;
    }();
  })(e);
})(dv);
Object.defineProperty(ta, "__esModule", { value: !0 });
ta.XElement = void 0;
ta.parseXml = pF;
const fF = dv, Ba = Hi;
class hv {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Ba.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!hF(t))
      throw (0, Ba.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, Ba.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, Ba.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (Xp(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => Xp(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
ta.XElement = hv;
const dF = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function hF(e) {
  return dF.test(e);
}
function Xp(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function pF(e) {
  let t = null;
  const r = fF.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const o = new hv(i.name);
    if (o.attributes = i.attributes, t === null)
      t = o;
    else {
      const a = n[n.length - 1];
      a.elements == null && (a.elements = []), a.elements.push(o);
    }
    n.push(o);
  }, r.onclosetag = () => {
    n.pop();
  }, r.ontext = (i) => {
    n.length > 0 && (n[n.length - 1].value = i);
  }, r.oncdata = (i) => {
    const o = n[n.length - 1];
    o.value = i, o.isCData = !0;
  }, r.onerror = (i) => {
    throw i;
  }, r.write(e), t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = f;
  var t = un;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = Hi;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = mt;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return n.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return n.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return n.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return n.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return n.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return n.HttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return n.HttpExecutor;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return n.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return n.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return n.safeStringifyJson;
  } });
  var i = ic;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = ea;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var a = oc;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return a.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return a.githubUrl;
  } });
  var s = yd;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return s.retry;
  } });
  var c = gd;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return c.parseDn;
  } });
  var u = Ci;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return u.UUID;
  } });
  var l = ta;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return l.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return l.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(h) {
    return h == null ? [] : Array.isArray(h) ? h : [h];
  }
})(Ge);
var Ze = {}, vd = {}, or = {};
function pv(e) {
  return typeof e > "u" || e === null;
}
function mF(e) {
  return typeof e == "object" && e !== null;
}
function yF(e) {
  return Array.isArray(e) ? e : pv(e) ? [] : [e];
}
function gF(e, t) {
  var r, n, i, o;
  if (t)
    for (o = Object.keys(t), r = 0, n = o.length; r < n; r += 1)
      i = o[r], e[i] = t[i];
  return e;
}
function vF(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function _F(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
or.isNothing = pv;
or.isObject = mF;
or.toArray = yF;
or.repeat = vF;
or.isNegativeZero = _F;
or.extend = gF;
function mv(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function jo(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = mv(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
jo.prototype = Object.create(Error.prototype);
jo.prototype.constructor = jo;
jo.prototype.toString = function(t) {
  return this.name + ": " + mv(this, t);
};
var ra = jo, fo = or;
function nl(e, t, r, n, i) {
  var o = "", a = "", s = Math.floor(i / 2) - 1;
  return n - t > s && (o = " ... ", t = n - s + o.length), r - n > s && (a = " ...", r = n + s - a.length), {
    str: o + e.slice(t, r).replace(/\t/g, "→") + a,
    pos: n - t + o.length
    // relative position
  };
}
function il(e, t) {
  return fo.repeat(" ", t - e.length) + e;
}
function $F(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], o, a = -1; o = r.exec(e.buffer); )
    i.push(o.index), n.push(o.index + o[0].length), e.position <= o.index && a < 0 && (a = n.length - 2);
  a < 0 && (a = n.length - 1);
  var s = "", c, u, l = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + l + 3);
  for (c = 1; c <= t.linesBefore && !(a - c < 0); c++)
    u = nl(
      e.buffer,
      n[a - c],
      i[a - c],
      e.position - (n[a] - n[a - c]),
      f
    ), s = fo.repeat(" ", t.indent) + il((e.line - c + 1).toString(), l) + " | " + u.str + `
` + s;
  for (u = nl(e.buffer, n[a], i[a], e.position, f), s += fo.repeat(" ", t.indent) + il((e.line + 1).toString(), l) + " | " + u.str + `
`, s += fo.repeat("-", t.indent + l + 3 + u.pos) + `^
`, c = 1; c <= t.linesAfter && !(a + c >= i.length); c++)
    u = nl(
      e.buffer,
      n[a + c],
      i[a + c],
      e.position - (n[a] - n[a + c]),
      f
    ), s += fo.repeat(" ", t.indent) + il((e.line + c + 1).toString(), l) + " | " + u.str + `
`;
  return s.replace(/\n$/, "");
}
var wF = $F, Jp = ra, EF = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], bF = [
  "scalar",
  "sequence",
  "mapping"
];
function SF(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function PF(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (EF.indexOf(r) === -1)
      throw new Jp('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = SF(t.styleAliases || null), bF.indexOf(this.kind) === -1)
    throw new Jp('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var $t = PF, oo = ra, ol = $t;
function Qp(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(o, a) {
      o.tag === n.tag && o.kind === n.kind && o.multi === n.multi && (i = a);
    }), r[i] = n;
  }), r;
}
function TF() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, r;
  function n(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, r = arguments.length; t < r; t += 1)
    arguments[t].forEach(n);
  return e;
}
function Kl(e) {
  return this.extend(e);
}
Kl.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof ol)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new oo("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(o) {
    if (!(o instanceof ol))
      throw new oo("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new oo("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new oo("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(o) {
    if (!(o instanceof ol))
      throw new oo("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Kl.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = Qp(i, "implicit"), i.compiledExplicit = Qp(i, "explicit"), i.compiledTypeMap = TF(i.compiledImplicit, i.compiledExplicit), i;
};
var yv = Kl, OF = $t, gv = new OF("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), AF = $t, vv = new AF("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), NF = $t, _v = new NF("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), IF = yv, $v = new IF({
  explicit: [
    gv,
    vv,
    _v
  ]
}), CF = $t;
function RF(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function DF() {
  return null;
}
function kF(e) {
  return e === null;
}
var wv = new CF("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: RF,
  construct: DF,
  predicate: kF,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
}), jF = $t;
function FF(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function LF(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function UF(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Ev = new jF("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: FF,
  construct: LF,
  predicate: UF,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
}), MF = or, xF = $t;
function VF(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function qF(e) {
  return 48 <= e && e <= 55;
}
function BF(e) {
  return 48 <= e && e <= 57;
}
function HF(e) {
  if (e === null) return !1;
  var t = e.length, r = 0, n = !1, i;
  if (!t) return !1;
  if (i = e[r], (i === "-" || i === "+") && (i = e[++r]), i === "0") {
    if (r + 1 === t) return !0;
    if (i = e[++r], i === "b") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "x") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!VF(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!qF(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!BF(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function zF(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function GF(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !MF.isNegativeZero(e);
}
var bv = new xF("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: HF,
  construct: zF,
  predicate: GF,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), Sv = or, KF = $t, WF = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function YF(e) {
  return !(e === null || !WF.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function XF(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var JF = /^[-+]?[0-9]+e/;
function QF(e, t) {
  var r;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (Sv.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), JF.test(r) ? r.replace("e", ".e") : r;
}
function ZF(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Sv.isNegativeZero(e));
}
var Pv = new KF("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: YF,
  construct: XF,
  predicate: ZF,
  represent: QF,
  defaultStyle: "lowercase"
}), Tv = $v.extend({
  implicit: [
    wv,
    Ev,
    bv,
    Pv
  ]
}), Ov = Tv, eL = $t, Av = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), Nv = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function tL(e) {
  return e === null ? !1 : Av.exec(e) !== null || Nv.exec(e) !== null;
}
function rL(e) {
  var t, r, n, i, o, a, s, c = 0, u = null, l, f, h;
  if (t = Av.exec(e), t === null && (t = Nv.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (o = +t[4], a = +t[5], s = +t[6], t[7]) {
    for (c = t[7].slice(0, 3); c.length < 3; )
      c += "0";
    c = +c;
  }
  return t[9] && (l = +t[10], f = +(t[11] || 0), u = (l * 60 + f) * 6e4, t[9] === "-" && (u = -u)), h = new Date(Date.UTC(r, n, i, o, a, s, c)), u && h.setTime(h.getTime() - u), h;
}
function nL(e) {
  return e.toISOString();
}
var Iv = new eL("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: tL,
  construct: rL,
  instanceOf: Date,
  represent: nL
}), iL = $t;
function oL(e) {
  return e === "<<" || e === null;
}
var Cv = new iL("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: oL
}), aL = $t, _d = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function sL(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, o = _d;
  for (r = 0; r < i; r++)
    if (t = o.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function cL(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, o = _d, a = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)), a = a << 6 | o.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)) : r === 18 ? (s.push(a >> 10 & 255), s.push(a >> 2 & 255)) : r === 12 && s.push(a >> 4 & 255), new Uint8Array(s);
}
function lL(e) {
  var t = "", r = 0, n, i, o = e.length, a = _d;
  for (n = 0; n < o; n++)
    n % 3 === 0 && n && (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]), r = (r << 8) + e[n];
  return i = o % 3, i === 0 ? (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]) : i === 2 ? (t += a[r >> 10 & 63], t += a[r >> 4 & 63], t += a[r << 2 & 63], t += a[64]) : i === 1 && (t += a[r >> 2 & 63], t += a[r << 4 & 63], t += a[64], t += a[64]), t;
}
function uL(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Rv = new aL("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: sL,
  construct: cL,
  predicate: uL,
  represent: lL
}), fL = $t, dL = Object.prototype.hasOwnProperty, hL = Object.prototype.toString;
function pL(e) {
  if (e === null) return !0;
  var t = [], r, n, i, o, a, s = e;
  for (r = 0, n = s.length; r < n; r += 1) {
    if (i = s[r], a = !1, hL.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (dL.call(i, o))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function mL(e) {
  return e !== null ? e : [];
}
var Dv = new fL("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: pL,
  construct: mL
}), yL = $t, gL = Object.prototype.toString;
function vL(e) {
  if (e === null) return !0;
  var t, r, n, i, o, a = e;
  for (o = new Array(a.length), t = 0, r = a.length; t < r; t += 1) {
    if (n = a[t], gL.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    o[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function _L(e) {
  if (e === null) return [];
  var t, r, n, i, o, a = e;
  for (o = new Array(a.length), t = 0, r = a.length; t < r; t += 1)
    n = a[t], i = Object.keys(n), o[t] = [i[0], n[i[0]]];
  return o;
}
var kv = new yL("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: vL,
  construct: _L
}), $L = $t, wL = Object.prototype.hasOwnProperty;
function EL(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (wL.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function bL(e) {
  return e !== null ? e : {};
}
var jv = new $L("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: EL,
  construct: bL
}), $d = Ov.extend({
  implicit: [
    Iv,
    Cv
  ],
  explicit: [
    Rv,
    Dv,
    kv,
    jv
  ]
}), kn = or, Fv = ra, SL = wF, PL = $d, fn = Object.prototype.hasOwnProperty, Ts = 1, Lv = 2, Uv = 3, Os = 4, al = 1, TL = 2, Zp = 3, OL = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, AL = /[\x85\u2028\u2029]/, NL = /[,\[\]\{\}]/, Mv = /^(?:!|!!|![a-z\-]+!)$/i, xv = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function em(e) {
  return Object.prototype.toString.call(e);
}
function pr(e) {
  return e === 10 || e === 13;
}
function Mn(e) {
  return e === 9 || e === 32;
}
function Ot(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function di(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function IL(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function CL(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function RL(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function tm(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function DL(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function Vv(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
var qv = new Array(256), Bv = new Array(256);
for (var ri = 0; ri < 256; ri++)
  qv[ri] = tm(ri) ? 1 : 0, Bv[ri] = tm(ri);
function kL(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || PL, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Hv(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = SL(r), new Fv(t, r);
}
function re(e, t) {
  throw Hv(e, t);
}
function As(e, t) {
  e.onWarning && e.onWarning.call(null, Hv(e, t));
}
var rm = {
  YAML: function(t, r, n) {
    var i, o, a;
    t.version !== null && re(t, "duplication of %YAML directive"), n.length !== 1 && re(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && re(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), a = parseInt(i[2], 10), o !== 1 && re(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && As(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, o;
    n.length !== 2 && re(t, "TAG directive accepts exactly two arguments"), i = n[0], o = n[1], Mv.test(i) || re(t, "ill-formed tag handle (first argument) of the TAG directive"), fn.call(t.tagMap, i) && re(t, 'there is a previously declared suffix for "' + i + '" tag handle'), xv.test(o) || re(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      re(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function cn(e, t, r, n) {
  var i, o, a, s;
  if (t < r) {
    if (s = e.input.slice(t, r), n)
      for (i = 0, o = s.length; i < o; i += 1)
        a = s.charCodeAt(i), a === 9 || 32 <= a && a <= 1114111 || re(e, "expected valid JSON character");
    else OL.test(s) && re(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function nm(e, t, r, n) {
  var i, o, a, s;
  for (kn.isObject(r) || re(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), a = 0, s = i.length; a < s; a += 1)
    o = i[a], fn.call(t, o) || (Vv(t, o, r[o]), n[o] = !0);
}
function hi(e, t, r, n, i, o, a, s, c) {
  var u, l;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), u = 0, l = i.length; u < l; u += 1)
      Array.isArray(i[u]) && re(e, "nested arrays are not supported inside keys"), typeof i == "object" && em(i[u]) === "[object Object]" && (i[u] = "[object Object]");
  if (typeof i == "object" && em(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (u = 0, l = o.length; u < l; u += 1)
        nm(e, t, o[u], r);
    else
      nm(e, t, o, r);
  else
    !e.json && !fn.call(r, i) && fn.call(t, i) && (e.line = a || e.line, e.lineStart = s || e.lineStart, e.position = c || e.position, re(e, "duplicated mapping key")), Vv(t, i, o), delete r[i];
  return t;
}
function wd(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : re(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function Me(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Mn(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (pr(i))
      for (wd(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && As(e, "deficient indentation"), n;
}
function ac(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || Ot(r)));
}
function Ed(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += kn.repeat(`
`, t - 1));
}
function jL(e, t, r) {
  var n, i, o, a, s, c, u, l, f = e.kind, h = e.result, p;
  if (p = e.input.charCodeAt(e.position), Ot(p) || di(p) || p === 35 || p === 38 || p === 42 || p === 33 || p === 124 || p === 62 || p === 39 || p === 34 || p === 37 || p === 64 || p === 96 || (p === 63 || p === 45) && (i = e.input.charCodeAt(e.position + 1), Ot(i) || r && di(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = a = e.position, s = !1; p !== 0; ) {
    if (p === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Ot(i) || r && di(i))
        break;
    } else if (p === 35) {
      if (n = e.input.charCodeAt(e.position - 1), Ot(n))
        break;
    } else {
      if (e.position === e.lineStart && ac(e) || r && di(p))
        break;
      if (pr(p))
        if (c = e.line, u = e.lineStart, l = e.lineIndent, Me(e, !1, -1), e.lineIndent >= t) {
          s = !0, p = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = c, e.lineStart = u, e.lineIndent = l;
          break;
        }
    }
    s && (cn(e, o, a, !1), Ed(e, e.line - c), o = a = e.position, s = !1), Mn(p) || (a = e.position + 1), p = e.input.charCodeAt(++e.position);
  }
  return cn(e, o, a, !1), e.result ? !0 : (e.kind = f, e.result = h, !1);
}
function FL(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (cn(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else pr(r) ? (cn(e, n, i, !0), Ed(e, Me(e, !1, t)), n = i = e.position) : e.position === e.lineStart && ac(e) ? re(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  re(e, "unexpected end of the stream within a single quoted scalar");
}
function LL(e, t) {
  var r, n, i, o, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return cn(e, r, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (cn(e, r, e.position, !0), s = e.input.charCodeAt(++e.position), pr(s))
        Me(e, !1, t);
      else if (s < 256 && qv[s])
        e.result += Bv[s], e.position++;
      else if ((a = CL(s)) > 0) {
        for (i = a, o = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (a = IL(s)) >= 0 ? o = (o << 4) + a : re(e, "expected hexadecimal character");
        e.result += DL(o), e.position++;
      } else
        re(e, "unknown escape sequence");
      r = n = e.position;
    } else pr(s) ? (cn(e, r, n, !0), Ed(e, Me(e, !1, t)), r = n = e.position) : e.position === e.lineStart && ac(e) ? re(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  re(e, "unexpected end of the stream within a double quoted scalar");
}
function UL(e, t) {
  var r = !0, n, i, o, a = e.tag, s, c = e.anchor, u, l, f, h, p, g = /* @__PURE__ */ Object.create(null), $, v, y, E;
  if (E = e.input.charCodeAt(e.position), E === 91)
    l = 93, p = !1, s = [];
  else if (E === 123)
    l = 125, p = !0, s = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), E = e.input.charCodeAt(++e.position); E !== 0; ) {
    if (Me(e, !0, t), E = e.input.charCodeAt(e.position), E === l)
      return e.position++, e.tag = a, e.anchor = c, e.kind = p ? "mapping" : "sequence", e.result = s, !0;
    r ? E === 44 && re(e, "expected the node content, but found ','") : re(e, "missed comma between flow collection entries"), v = $ = y = null, f = h = !1, E === 63 && (u = e.input.charCodeAt(e.position + 1), Ot(u) && (f = h = !0, e.position++, Me(e, !0, t))), n = e.line, i = e.lineStart, o = e.position, Ri(e, t, Ts, !1, !0), v = e.tag, $ = e.result, Me(e, !0, t), E = e.input.charCodeAt(e.position), (h || e.line === n) && E === 58 && (f = !0, E = e.input.charCodeAt(++e.position), Me(e, !0, t), Ri(e, t, Ts, !1, !0), y = e.result), p ? hi(e, s, g, v, $, y, n, i, o) : f ? s.push(hi(e, null, g, v, $, y, n, i, o)) : s.push($), Me(e, !0, t), E = e.input.charCodeAt(e.position), E === 44 ? (r = !0, E = e.input.charCodeAt(++e.position)) : r = !1;
  }
  re(e, "unexpected end of the stream within a flow collection");
}
function ML(e, t) {
  var r, n, i = al, o = !1, a = !1, s = t, c = 0, u = !1, l, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    n = !1;
  else if (f === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      al === i ? i = f === 43 ? Zp : TL : re(e, "repeat of a chomping mode identifier");
    else if ((l = RL(f)) >= 0)
      l === 0 ? re(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : a ? re(e, "repeat of an indentation width identifier") : (s = t + l - 1, a = !0);
    else
      break;
  if (Mn(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (Mn(f));
    if (f === 35)
      do
        f = e.input.charCodeAt(++e.position);
      while (!pr(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (wd(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!a || e.lineIndent < s) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > s && (s = e.lineIndent), pr(f)) {
      c++;
      continue;
    }
    if (e.lineIndent < s) {
      i === Zp ? e.result += kn.repeat(`
`, o ? 1 + c : c) : i === al && o && (e.result += `
`);
      break;
    }
    for (n ? Mn(f) ? (u = !0, e.result += kn.repeat(`
`, o ? 1 + c : c)) : u ? (u = !1, e.result += kn.repeat(`
`, c + 1)) : c === 0 ? o && (e.result += " ") : e.result += kn.repeat(`
`, c) : e.result += kn.repeat(`
`, o ? 1 + c : c), o = !0, a = !0, c = 0, r = e.position; !pr(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    cn(e, r, e.position, !1);
  }
  return !0;
}
function im(e, t) {
  var r, n = e.tag, i = e.anchor, o = [], a, s = !1, c;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), c = e.input.charCodeAt(e.position); c !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, re(e, "tab characters must not be used in indentation")), !(c !== 45 || (a = e.input.charCodeAt(e.position + 1), !Ot(a)))); ) {
    if (s = !0, e.position++, Me(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), c = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, Ri(e, t, Uv, !1, !0), o.push(e.result), Me(e, !0, -1), c = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && c !== 0)
      re(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function xL(e, t, r) {
  var n, i, o, a, s, c, u = e.tag, l = e.anchor, f = {}, h = /* @__PURE__ */ Object.create(null), p = null, g = null, $ = null, v = !1, y = !1, E;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), E = e.input.charCodeAt(e.position); E !== 0; ) {
    if (!v && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, re(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), o = e.line, (E === 63 || E === 58) && Ot(n))
      E === 63 ? (v && (hi(e, f, h, p, g, null, a, s, c), p = g = $ = null), y = !0, v = !0, i = !0) : v ? (v = !1, i = !0) : re(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, E = n;
    else {
      if (a = e.line, s = e.lineStart, c = e.position, !Ri(e, r, Lv, !1, !0))
        break;
      if (e.line === o) {
        for (E = e.input.charCodeAt(e.position); Mn(E); )
          E = e.input.charCodeAt(++e.position);
        if (E === 58)
          E = e.input.charCodeAt(++e.position), Ot(E) || re(e, "a whitespace character is expected after the key-value separator within a block mapping"), v && (hi(e, f, h, p, g, null, a, s, c), p = g = $ = null), y = !0, v = !1, i = !1, p = e.tag, g = e.result;
        else if (y)
          re(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = u, e.anchor = l, !0;
      } else if (y)
        re(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = u, e.anchor = l, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (v && (a = e.line, s = e.lineStart, c = e.position), Ri(e, t, Os, !0, i) && (v ? g = e.result : $ = e.result), v || (hi(e, f, h, p, g, $, a, s, c), p = g = $ = null), Me(e, !0, -1), E = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && E !== 0)
      re(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return v && hi(e, f, h, p, g, null, a, s, c), y && (e.tag = u, e.anchor = l, e.kind = "mapping", e.result = f), y;
}
function VL(e) {
  var t, r = !1, n = !1, i, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && re(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (r = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (n = !0, i = "!!", a = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : re(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !Ot(a); )
      a === 33 && (n ? re(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), Mv.test(i) || re(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), NL.test(o) && re(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !xv.test(o) && re(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    re(e, "tag name is malformed: " + o);
  }
  return r ? e.tag = o : fn.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : re(e, 'undeclared tag handle "' + i + '"'), !0;
}
function qL(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && re(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Ot(r) && !di(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && re(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function BL(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Ot(n) && !di(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && re(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), fn.call(e.anchorMap, r) || re(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], Me(e, !0, -1), !0;
}
function Ri(e, t, r, n, i) {
  var o, a, s, c = 1, u = !1, l = !1, f, h, p, g, $, v;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = Os === r || Uv === r, n && Me(e, !0, -1) && (u = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1)
    for (; VL(e) || qL(e); )
      Me(e, !0, -1) ? (u = !0, s = o, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : s = !1;
  if (s && (s = u || i), (c === 1 || Os === r) && (Ts === r || Lv === r ? $ = t : $ = t + 1, v = e.position - e.lineStart, c === 1 ? s && (im(e, v) || xL(e, v, $)) || UL(e, $) ? l = !0 : (a && ML(e, $) || FL(e, $) || LL(e, $) ? l = !0 : BL(e) ? (l = !0, (e.tag !== null || e.anchor !== null) && re(e, "alias node should not have any properties")) : jL(e, $, Ts === r) && (l = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : c === 0 && (l = s && im(e, v))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && re(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, h = e.implicitTypes.length; f < h; f += 1)
      if (g = e.implicitTypes[f], g.resolve(e.result)) {
        e.result = g.construct(e.result), e.tag = g.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (fn.call(e.typeMap[e.kind || "fallback"], e.tag))
      g = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (g = null, p = e.typeMap.multi[e.kind || "fallback"], f = 0, h = p.length; f < h; f += 1)
        if (e.tag.slice(0, p[f].tag.length) === p[f].tag) {
          g = p[f];
          break;
        }
    g || re(e, "unknown tag !<" + e.tag + ">"), e.result !== null && g.kind !== e.kind && re(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + g.kind + '", not "' + e.kind + '"'), g.resolve(e.result, e.tag) ? (e.result = g.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : re(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || l;
}
function HL(e) {
  var t = e.position, r, n, i, o = !1, a;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (a = e.input.charCodeAt(e.position)) !== 0 && (Me(e, !0, -1), a = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || a !== 37)); ) {
    for (o = !0, a = e.input.charCodeAt(++e.position), r = e.position; a !== 0 && !Ot(a); )
      a = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && re(e, "directive name must not be less than one character in length"); a !== 0; ) {
      for (; Mn(a); )
        a = e.input.charCodeAt(++e.position);
      if (a === 35) {
        do
          a = e.input.charCodeAt(++e.position);
        while (a !== 0 && !pr(a));
        break;
      }
      if (pr(a)) break;
      for (r = e.position; a !== 0 && !Ot(a); )
        a = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    a !== 0 && wd(e), fn.call(rm, n) ? rm[n](e, n, i) : As(e, 'unknown document directive "' + n + '"');
  }
  if (Me(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, Me(e, !0, -1)) : o && re(e, "directives end mark is expected"), Ri(e, e.lineIndent - 1, Os, !1, !0), Me(e, !0, -1), e.checkLineBreaks && AL.test(e.input.slice(t, e.position)) && As(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && ac(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, Me(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    re(e, "end of the stream or a document separator is expected");
  else
    return;
}
function zv(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new kL(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, re(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    HL(r);
  return r.documents;
}
function zL(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = zv(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, o = n.length; i < o; i += 1)
    t(n[i]);
}
function GL(e, t) {
  var r = zv(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new Fv("expected a single document in the stream, but found more");
  }
}
vd.loadAll = zL;
vd.load = GL;
var Gv = {}, sc = or, na = ra, KL = $d, Kv = Object.prototype.toString, Wv = Object.prototype.hasOwnProperty, bd = 65279, WL = 9, Fo = 10, YL = 13, XL = 32, JL = 33, QL = 34, Wl = 35, ZL = 37, eU = 38, tU = 39, rU = 42, Yv = 44, nU = 45, Ns = 58, iU = 61, oU = 62, aU = 63, sU = 64, Xv = 91, Jv = 93, cU = 96, Qv = 123, lU = 124, Zv = 125, lt = {};
lt[0] = "\\0";
lt[7] = "\\a";
lt[8] = "\\b";
lt[9] = "\\t";
lt[10] = "\\n";
lt[11] = "\\v";
lt[12] = "\\f";
lt[13] = "\\r";
lt[27] = "\\e";
lt[34] = '\\"';
lt[92] = "\\\\";
lt[133] = "\\N";
lt[160] = "\\_";
lt[8232] = "\\L";
lt[8233] = "\\P";
var uU = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], fU = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function dU(e, t) {
  var r, n, i, o, a, s, c;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, o = n.length; i < o; i += 1)
    a = n[i], s = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), c = e.compiledTypeMap.fallback[a], c && Wv.call(c.styleAliases, s) && (s = c.styleAliases[s]), r[a] = s;
  return r;
}
function hU(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new na("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + sc.repeat("0", n - t.length) + t;
}
var pU = 1, Lo = 2;
function mU(e) {
  this.schema = e.schema || KL, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = sc.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = dU(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Lo : pU, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function om(e, t) {
  for (var r = sc.repeat(" ", t), n = 0, i = -1, o = "", a, s = e.length; n < s; )
    i = e.indexOf(`
`, n), i === -1 ? (a = e.slice(n), n = s) : (a = e.slice(n, i + 1), n = i + 1), a.length && a !== `
` && (o += r), o += a;
  return o;
}
function Yl(e, t) {
  return `
` + sc.repeat(" ", e.indent * t);
}
function yU(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function Is(e) {
  return e === XL || e === WL;
}
function Uo(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== bd || 65536 <= e && e <= 1114111;
}
function am(e) {
  return Uo(e) && e !== bd && e !== YL && e !== Fo;
}
function sm(e, t, r) {
  var n = am(e), i = n && !Is(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== Yv && e !== Xv && e !== Jv && e !== Qv && e !== Zv) && e !== Wl && !(t === Ns && !i) || am(t) && !Is(t) && e === Wl || t === Ns && i
  );
}
function gU(e) {
  return Uo(e) && e !== bd && !Is(e) && e !== nU && e !== aU && e !== Ns && e !== Yv && e !== Xv && e !== Jv && e !== Qv && e !== Zv && e !== Wl && e !== eU && e !== rU && e !== JL && e !== lU && e !== iU && e !== oU && e !== tU && e !== QL && e !== ZL && e !== sU && e !== cU;
}
function vU(e) {
  return !Is(e) && e !== Ns;
}
function ho(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function e_(e) {
  var t = /^\n* /;
  return t.test(e);
}
var t_ = 1, Xl = 2, r_ = 3, n_ = 4, li = 5;
function _U(e, t, r, n, i, o, a, s) {
  var c, u = 0, l = null, f = !1, h = !1, p = n !== -1, g = -1, $ = gU(ho(e, 0)) && vU(ho(e, e.length - 1));
  if (t || a)
    for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
      if (u = ho(e, c), !Uo(u))
        return li;
      $ = $ && sm(u, l, s), l = u;
    }
  else {
    for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
      if (u = ho(e, c), u === Fo)
        f = !0, p && (h = h || // Foldable line = too long, and not more-indented.
        c - g - 1 > n && e[g + 1] !== " ", g = c);
      else if (!Uo(u))
        return li;
      $ = $ && sm(u, l, s), l = u;
    }
    h = h || p && c - g - 1 > n && e[g + 1] !== " ";
  }
  return !f && !h ? $ && !a && !i(e) ? t_ : o === Lo ? li : Xl : r > 9 && e_(e) ? li : a ? o === Lo ? li : Xl : h ? n_ : r_;
}
function $U(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Lo ? '""' : "''";
    if (!e.noCompatMode && (uU.indexOf(t) !== -1 || fU.test(t)))
      return e.quotingType === Lo ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, r), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), s = n || e.flowLevel > -1 && r >= e.flowLevel;
    function c(u) {
      return yU(e, u);
    }
    switch (_U(
      t,
      s,
      e.indent,
      a,
      c,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case t_:
        return t;
      case Xl:
        return "'" + t.replace(/'/g, "''") + "'";
      case r_:
        return "|" + cm(t, e.indent) + lm(om(t, o));
      case n_:
        return ">" + cm(t, e.indent) + lm(om(wU(t, a), o));
      case li:
        return '"' + EU(t) + '"';
      default:
        throw new na("impossible error: invalid scalar style");
    }
  }();
}
function cm(e, t) {
  var r = e_(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : n ? "" : "-";
  return r + o + `
`;
}
function lm(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function wU(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var u = e.indexOf(`
`);
    return u = u !== -1 ? u : e.length, r.lastIndex = u, um(e.slice(0, u), t);
  }(), i = e[0] === `
` || e[0] === " ", o, a; a = r.exec(e); ) {
    var s = a[1], c = a[2];
    o = c[0] === " ", n += s + (!i && !o && c !== "" ? `
` : "") + um(c, t), i = o;
  }
  return n;
}
function um(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, o, a = 0, s = 0, c = ""; n = r.exec(e); )
    s = n.index, s - i > t && (o = a > i ? a : s, c += `
` + e.slice(i, o), i = o + 1), a = s;
  return c += `
`, e.length - i > t && a > i ? c += e.slice(i, a) + `
` + e.slice(a + 1) : c += e.slice(i), c.slice(1);
}
function EU(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = ho(e, i), n = lt[r], !n && Uo(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || hU(r);
  return t;
}
function bU(e, t, r) {
  var n = "", i = e.tag, o, a, s;
  for (o = 0, a = r.length; o < a; o += 1)
    s = r[o], e.replacer && (s = e.replacer.call(r, String(o), s)), (kr(e, t, s, !1, !1) || typeof s > "u" && kr(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function fm(e, t, r, n) {
  var i = "", o = e.tag, a, s, c;
  for (a = 0, s = r.length; a < s; a += 1)
    c = r[a], e.replacer && (c = e.replacer.call(r, String(a), c)), (kr(e, t + 1, c, !0, !0, !1, !0) || typeof c > "u" && kr(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Yl(e, t)), e.dump && Fo === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function SU(e, t, r) {
  var n = "", i = e.tag, o = Object.keys(r), a, s, c, u, l;
  for (a = 0, s = o.length; a < s; a += 1)
    l = "", n !== "" && (l += ", "), e.condenseFlow && (l += '"'), c = o[a], u = r[c], e.replacer && (u = e.replacer.call(r, c, u)), kr(e, t, c, !1, !1) && (e.dump.length > 1024 && (l += "? "), l += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), kr(e, t, u, !1, !1) && (l += e.dump, n += l));
  e.tag = i, e.dump = "{" + n + "}";
}
function PU(e, t, r, n) {
  var i = "", o = e.tag, a = Object.keys(r), s, c, u, l, f, h;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new na("sortKeys must be a boolean or a function");
  for (s = 0, c = a.length; s < c; s += 1)
    h = "", (!n || i !== "") && (h += Yl(e, t)), u = a[s], l = r[u], e.replacer && (l = e.replacer.call(r, u, l)), kr(e, t + 1, u, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && Fo === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, f && (h += Yl(e, t)), kr(e, t + 1, l, !0, f) && (e.dump && Fo === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = o, e.dump = i || "{}";
}
function dm(e, t, r) {
  var n, i, o, a, s, c;
  for (i = r ? e.explicitTypes : e.implicitTypes, o = 0, a = i.length; o < a; o += 1)
    if (s = i[o], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (r ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        if (c = e.styleMap[s.tag] || s.defaultStyle, Kv.call(s.represent) === "[object Function]")
          n = s.represent(t, c);
        else if (Wv.call(s.represent, c))
          n = s.represent[c](t, c);
        else
          throw new na("!<" + s.tag + '> tag resolver accepts not "' + c + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function kr(e, t, r, n, i, o, a) {
  e.tag = null, e.dump = r, dm(e, r, !1) || dm(e, r, !0);
  var s = Kv.call(e.dump), c = n, u;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var l = s === "[object Object]" || s === "[object Array]", f, h;
  if (l && (f = e.duplicates.indexOf(r), h = f !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (l && h && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), s === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (PU(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (SU(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? fm(e, t - 1, e.dump, i) : fm(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (bU(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && $U(e, e.dump, t, o, c);
    else {
      if (s === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new na("unacceptable kind of an object to dump " + s);
    }
    e.tag !== null && e.tag !== "?" && (u = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? u = "!" + u : u.slice(0, 18) === "tag:yaml.org,2002:" ? u = "!!" + u.slice(18) : u = "!<" + u + ">", e.dump = u + " " + e.dump);
  }
  return !0;
}
function TU(e, t) {
  var r = [], n = [], i, o;
  for (Jl(e, r, n), i = 0, o = n.length; i < o; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(o);
}
function Jl(e, t, r) {
  var n, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        Jl(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, o = n.length; i < o; i += 1)
        Jl(e[n[i]], t, r);
}
function OU(e, t) {
  t = t || {};
  var r = new mU(t);
  r.noRefs || TU(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), kr(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
Gv.dump = OU;
var i_ = vd, AU = Gv;
function Sd(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
Ze.Type = $t;
Ze.Schema = yv;
Ze.FAILSAFE_SCHEMA = $v;
Ze.JSON_SCHEMA = Tv;
Ze.CORE_SCHEMA = Ov;
Ze.DEFAULT_SCHEMA = $d;
Ze.load = i_.load;
Ze.loadAll = i_.loadAll;
Ze.dump = AU.dump;
Ze.YAMLException = ra;
Ze.types = {
  binary: Rv,
  float: Pv,
  map: _v,
  null: wv,
  pairs: kv,
  set: jv,
  timestamp: Iv,
  bool: Ev,
  int: bv,
  merge: Cv,
  omap: Dv,
  seq: vv,
  str: gv
};
Ze.safeLoad = Sd("safeLoad", "load");
Ze.safeLoadAll = Sd("safeLoadAll", "loadAll");
Ze.safeDump = Sd("safeDump", "dump");
var cc = {};
Object.defineProperty(cc, "__esModule", { value: !0 });
cc.Lazy = void 0;
class NU {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
cc.Lazy = NU;
var ia = {}, Cs = { exports: {} };
Cs.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, o = 2, a = 9007199254740991, s = "[object Arguments]", c = "[object Array]", u = "[object AsyncFunction]", l = "[object Boolean]", f = "[object Date]", h = "[object Error]", p = "[object Function]", g = "[object GeneratorFunction]", $ = "[object Map]", v = "[object Number]", y = "[object Null]", E = "[object Object]", A = "[object Promise]", C = "[object Proxy]", D = "[object RegExp]", V = "[object Set]", z = "[object String]", G = "[object Symbol]", N = "[object Undefined]", W = "[object WeakMap]", M = "[object ArrayBuffer]", x = "[object DataView]", J = "[object Float32Array]", F = "[object Float64Array]", L = "[object Int8Array]", H = "[object Int16Array]", U = "[object Int32Array]", K = "[object Uint8Array]", B = "[object Uint8ClampedArray]", R = "[object Uint16Array]", b = "[object Uint32Array]", O = /[\\^$.*+?()[\]{}|]/g, S = /^\[object .+?Constructor\]$/, d = /^(?:0|[1-9]\d*)$/, m = {};
  m[J] = m[F] = m[L] = m[H] = m[U] = m[K] = m[B] = m[R] = m[b] = !0, m[s] = m[c] = m[M] = m[l] = m[x] = m[f] = m[h] = m[p] = m[$] = m[v] = m[E] = m[D] = m[V] = m[z] = m[W] = !1;
  var P = typeof ct == "object" && ct && ct.Object === Object && ct, w = typeof self == "object" && self && self.Object === Object && self, _ = P || w || Function("return this")(), k = t && !t.nodeType && t, I = k && !0 && e && !e.nodeType && e, Y = I && I.exports === k, ne = Y && P.process, ye = function() {
    try {
      return ne && ne.binding && ne.binding("util");
    } catch {
    }
  }(), _e = ye && ye.isTypedArray;
  function $e(T, j) {
    for (var q = -1, Z = T == null ? 0 : T.length, Te = 0, ue = []; ++q < Z; ) {
      var je = T[q];
      j(je, q, T) && (ue[Te++] = je);
    }
    return ue;
  }
  function Ce(T, j) {
    for (var q = -1, Z = j.length, Te = T.length; ++q < Z; )
      T[Te + q] = j[q];
    return T;
  }
  function ve(T, j) {
    for (var q = -1, Z = T == null ? 0 : T.length; ++q < Z; )
      if (j(T[q], q, T))
        return !0;
    return !1;
  }
  function Fe(T, j) {
    for (var q = -1, Z = Array(T); ++q < T; )
      Z[q] = j(q);
    return Z;
  }
  function Bt(T) {
    return function(j) {
      return T(j);
    };
  }
  function kt(T, j) {
    return T.has(j);
  }
  function At(T, j) {
    return T == null ? void 0 : T[j];
  }
  function jt(T) {
    var j = -1, q = Array(T.size);
    return T.forEach(function(Z, Te) {
      q[++j] = [Te, Z];
    }), q;
  }
  function gr(T, j) {
    return function(q) {
      return T(j(q));
    };
  }
  function vr(T) {
    var j = -1, q = Array(T.size);
    return T.forEach(function(Z) {
      q[++j] = Z;
    }), q;
  }
  var _r = Array.prototype, Nt = Function.prototype, Ft = Object.prototype, $r = _["__core-js_shared__"], Fr = Nt.toString, wt = Ft.hasOwnProperty, Nd = function() {
    var T = /[^.]+$/.exec($r && $r.keys && $r.keys.IE_PROTO || "");
    return T ? "Symbol(src)_1." + T : "";
  }(), Id = Ft.toString, $_ = RegExp(
    "^" + Fr.call(wt).replace(O, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Cd = Y ? _.Buffer : void 0, ca = _.Symbol, Rd = _.Uint8Array, Dd = Ft.propertyIsEnumerable, w_ = _r.splice, gn = ca ? ca.toStringTag : void 0, kd = Object.getOwnPropertySymbols, E_ = Cd ? Cd.isBuffer : void 0, b_ = gr(Object.keys, Object), gc = Yn(_, "DataView"), Gi = Yn(_, "Map"), vc = Yn(_, "Promise"), _c = Yn(_, "Set"), $c = Yn(_, "WeakMap"), Ki = Yn(Object, "create"), S_ = $n(gc), P_ = $n(Gi), T_ = $n(vc), O_ = $n(_c), A_ = $n($c), jd = ca ? ca.prototype : void 0, wc = jd ? jd.valueOf : void 0;
  function vn(T) {
    var j = -1, q = T == null ? 0 : T.length;
    for (this.clear(); ++j < q; ) {
      var Z = T[j];
      this.set(Z[0], Z[1]);
    }
  }
  function N_() {
    this.__data__ = Ki ? Ki(null) : {}, this.size = 0;
  }
  function I_(T) {
    var j = this.has(T) && delete this.__data__[T];
    return this.size -= j ? 1 : 0, j;
  }
  function C_(T) {
    var j = this.__data__;
    if (Ki) {
      var q = j[T];
      return q === n ? void 0 : q;
    }
    return wt.call(j, T) ? j[T] : void 0;
  }
  function R_(T) {
    var j = this.__data__;
    return Ki ? j[T] !== void 0 : wt.call(j, T);
  }
  function D_(T, j) {
    var q = this.__data__;
    return this.size += this.has(T) ? 0 : 1, q[T] = Ki && j === void 0 ? n : j, this;
  }
  vn.prototype.clear = N_, vn.prototype.delete = I_, vn.prototype.get = C_, vn.prototype.has = R_, vn.prototype.set = D_;
  function wr(T) {
    var j = -1, q = T == null ? 0 : T.length;
    for (this.clear(); ++j < q; ) {
      var Z = T[j];
      this.set(Z[0], Z[1]);
    }
  }
  function k_() {
    this.__data__ = [], this.size = 0;
  }
  function j_(T) {
    var j = this.__data__, q = ua(j, T);
    if (q < 0)
      return !1;
    var Z = j.length - 1;
    return q == Z ? j.pop() : w_.call(j, q, 1), --this.size, !0;
  }
  function F_(T) {
    var j = this.__data__, q = ua(j, T);
    return q < 0 ? void 0 : j[q][1];
  }
  function L_(T) {
    return ua(this.__data__, T) > -1;
  }
  function U_(T, j) {
    var q = this.__data__, Z = ua(q, T);
    return Z < 0 ? (++this.size, q.push([T, j])) : q[Z][1] = j, this;
  }
  wr.prototype.clear = k_, wr.prototype.delete = j_, wr.prototype.get = F_, wr.prototype.has = L_, wr.prototype.set = U_;
  function _n(T) {
    var j = -1, q = T == null ? 0 : T.length;
    for (this.clear(); ++j < q; ) {
      var Z = T[j];
      this.set(Z[0], Z[1]);
    }
  }
  function M_() {
    this.size = 0, this.__data__ = {
      hash: new vn(),
      map: new (Gi || wr)(),
      string: new vn()
    };
  }
  function x_(T) {
    var j = fa(this, T).delete(T);
    return this.size -= j ? 1 : 0, j;
  }
  function V_(T) {
    return fa(this, T).get(T);
  }
  function q_(T) {
    return fa(this, T).has(T);
  }
  function B_(T, j) {
    var q = fa(this, T), Z = q.size;
    return q.set(T, j), this.size += q.size == Z ? 0 : 1, this;
  }
  _n.prototype.clear = M_, _n.prototype.delete = x_, _n.prototype.get = V_, _n.prototype.has = q_, _n.prototype.set = B_;
  function la(T) {
    var j = -1, q = T == null ? 0 : T.length;
    for (this.__data__ = new _n(); ++j < q; )
      this.add(T[j]);
  }
  function H_(T) {
    return this.__data__.set(T, n), this;
  }
  function z_(T) {
    return this.__data__.has(T);
  }
  la.prototype.add = la.prototype.push = H_, la.prototype.has = z_;
  function Lr(T) {
    var j = this.__data__ = new wr(T);
    this.size = j.size;
  }
  function G_() {
    this.__data__ = new wr(), this.size = 0;
  }
  function K_(T) {
    var j = this.__data__, q = j.delete(T);
    return this.size = j.size, q;
  }
  function W_(T) {
    return this.__data__.get(T);
  }
  function Y_(T) {
    return this.__data__.has(T);
  }
  function X_(T, j) {
    var q = this.__data__;
    if (q instanceof wr) {
      var Z = q.__data__;
      if (!Gi || Z.length < r - 1)
        return Z.push([T, j]), this.size = ++q.size, this;
      q = this.__data__ = new _n(Z);
    }
    return q.set(T, j), this.size = q.size, this;
  }
  Lr.prototype.clear = G_, Lr.prototype.delete = K_, Lr.prototype.get = W_, Lr.prototype.has = Y_, Lr.prototype.set = X_;
  function J_(T, j) {
    var q = da(T), Z = !q && d$(T), Te = !q && !Z && Ec(T), ue = !q && !Z && !Te && Hd(T), je = q || Z || Te || ue, Be = je ? Fe(T.length, String) : [], Ke = Be.length;
    for (var Re in T)
      wt.call(T, Re) && !(je && // Safari 9 has enumerable `arguments.length` in strict mode.
      (Re == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      Te && (Re == "offset" || Re == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      ue && (Re == "buffer" || Re == "byteLength" || Re == "byteOffset") || // Skip index properties.
      s$(Re, Ke))) && Be.push(Re);
    return Be;
  }
  function ua(T, j) {
    for (var q = T.length; q--; )
      if (xd(T[q][0], j))
        return q;
    return -1;
  }
  function Q_(T, j, q) {
    var Z = j(T);
    return da(T) ? Z : Ce(Z, q(T));
  }
  function Wi(T) {
    return T == null ? T === void 0 ? N : y : gn && gn in Object(T) ? o$(T) : f$(T);
  }
  function Fd(T) {
    return Yi(T) && Wi(T) == s;
  }
  function Ld(T, j, q, Z, Te) {
    return T === j ? !0 : T == null || j == null || !Yi(T) && !Yi(j) ? T !== T && j !== j : Z_(T, j, q, Z, Ld, Te);
  }
  function Z_(T, j, q, Z, Te, ue) {
    var je = da(T), Be = da(j), Ke = je ? c : Ur(T), Re = Be ? c : Ur(j);
    Ke = Ke == s ? E : Ke, Re = Re == s ? E : Re;
    var It = Ke == E, Ht = Re == E, et = Ke == Re;
    if (et && Ec(T)) {
      if (!Ec(j))
        return !1;
      je = !0, It = !1;
    }
    if (et && !It)
      return ue || (ue = new Lr()), je || Hd(T) ? Ud(T, j, q, Z, Te, ue) : n$(T, j, Ke, q, Z, Te, ue);
    if (!(q & i)) {
      var Lt = It && wt.call(T, "__wrapped__"), Ut = Ht && wt.call(j, "__wrapped__");
      if (Lt || Ut) {
        var Mr = Lt ? T.value() : T, Er = Ut ? j.value() : j;
        return ue || (ue = new Lr()), Te(Mr, Er, q, Z, ue);
      }
    }
    return et ? (ue || (ue = new Lr()), i$(T, j, q, Z, Te, ue)) : !1;
  }
  function e$(T) {
    if (!Bd(T) || l$(T))
      return !1;
    var j = Vd(T) ? $_ : S;
    return j.test($n(T));
  }
  function t$(T) {
    return Yi(T) && qd(T.length) && !!m[Wi(T)];
  }
  function r$(T) {
    if (!u$(T))
      return b_(T);
    var j = [];
    for (var q in Object(T))
      wt.call(T, q) && q != "constructor" && j.push(q);
    return j;
  }
  function Ud(T, j, q, Z, Te, ue) {
    var je = q & i, Be = T.length, Ke = j.length;
    if (Be != Ke && !(je && Ke > Be))
      return !1;
    var Re = ue.get(T);
    if (Re && ue.get(j))
      return Re == j;
    var It = -1, Ht = !0, et = q & o ? new la() : void 0;
    for (ue.set(T, j), ue.set(j, T); ++It < Be; ) {
      var Lt = T[It], Ut = j[It];
      if (Z)
        var Mr = je ? Z(Ut, Lt, It, j, T, ue) : Z(Lt, Ut, It, T, j, ue);
      if (Mr !== void 0) {
        if (Mr)
          continue;
        Ht = !1;
        break;
      }
      if (et) {
        if (!ve(j, function(Er, wn) {
          if (!kt(et, wn) && (Lt === Er || Te(Lt, Er, q, Z, ue)))
            return et.push(wn);
        })) {
          Ht = !1;
          break;
        }
      } else if (!(Lt === Ut || Te(Lt, Ut, q, Z, ue))) {
        Ht = !1;
        break;
      }
    }
    return ue.delete(T), ue.delete(j), Ht;
  }
  function n$(T, j, q, Z, Te, ue, je) {
    switch (q) {
      case x:
        if (T.byteLength != j.byteLength || T.byteOffset != j.byteOffset)
          return !1;
        T = T.buffer, j = j.buffer;
      case M:
        return !(T.byteLength != j.byteLength || !ue(new Rd(T), new Rd(j)));
      case l:
      case f:
      case v:
        return xd(+T, +j);
      case h:
        return T.name == j.name && T.message == j.message;
      case D:
      case z:
        return T == j + "";
      case $:
        var Be = jt;
      case V:
        var Ke = Z & i;
        if (Be || (Be = vr), T.size != j.size && !Ke)
          return !1;
        var Re = je.get(T);
        if (Re)
          return Re == j;
        Z |= o, je.set(T, j);
        var It = Ud(Be(T), Be(j), Z, Te, ue, je);
        return je.delete(T), It;
      case G:
        if (wc)
          return wc.call(T) == wc.call(j);
    }
    return !1;
  }
  function i$(T, j, q, Z, Te, ue) {
    var je = q & i, Be = Md(T), Ke = Be.length, Re = Md(j), It = Re.length;
    if (Ke != It && !je)
      return !1;
    for (var Ht = Ke; Ht--; ) {
      var et = Be[Ht];
      if (!(je ? et in j : wt.call(j, et)))
        return !1;
    }
    var Lt = ue.get(T);
    if (Lt && ue.get(j))
      return Lt == j;
    var Ut = !0;
    ue.set(T, j), ue.set(j, T);
    for (var Mr = je; ++Ht < Ke; ) {
      et = Be[Ht];
      var Er = T[et], wn = j[et];
      if (Z)
        var zd = je ? Z(wn, Er, et, j, T, ue) : Z(Er, wn, et, T, j, ue);
      if (!(zd === void 0 ? Er === wn || Te(Er, wn, q, Z, ue) : zd)) {
        Ut = !1;
        break;
      }
      Mr || (Mr = et == "constructor");
    }
    if (Ut && !Mr) {
      var ha = T.constructor, pa = j.constructor;
      ha != pa && "constructor" in T && "constructor" in j && !(typeof ha == "function" && ha instanceof ha && typeof pa == "function" && pa instanceof pa) && (Ut = !1);
    }
    return ue.delete(T), ue.delete(j), Ut;
  }
  function Md(T) {
    return Q_(T, m$, a$);
  }
  function fa(T, j) {
    var q = T.__data__;
    return c$(j) ? q[typeof j == "string" ? "string" : "hash"] : q.map;
  }
  function Yn(T, j) {
    var q = At(T, j);
    return e$(q) ? q : void 0;
  }
  function o$(T) {
    var j = wt.call(T, gn), q = T[gn];
    try {
      T[gn] = void 0;
      var Z = !0;
    } catch {
    }
    var Te = Id.call(T);
    return Z && (j ? T[gn] = q : delete T[gn]), Te;
  }
  var a$ = kd ? function(T) {
    return T == null ? [] : (T = Object(T), $e(kd(T), function(j) {
      return Dd.call(T, j);
    }));
  } : y$, Ur = Wi;
  (gc && Ur(new gc(new ArrayBuffer(1))) != x || Gi && Ur(new Gi()) != $ || vc && Ur(vc.resolve()) != A || _c && Ur(new _c()) != V || $c && Ur(new $c()) != W) && (Ur = function(T) {
    var j = Wi(T), q = j == E ? T.constructor : void 0, Z = q ? $n(q) : "";
    if (Z)
      switch (Z) {
        case S_:
          return x;
        case P_:
          return $;
        case T_:
          return A;
        case O_:
          return V;
        case A_:
          return W;
      }
    return j;
  });
  function s$(T, j) {
    return j = j ?? a, !!j && (typeof T == "number" || d.test(T)) && T > -1 && T % 1 == 0 && T < j;
  }
  function c$(T) {
    var j = typeof T;
    return j == "string" || j == "number" || j == "symbol" || j == "boolean" ? T !== "__proto__" : T === null;
  }
  function l$(T) {
    return !!Nd && Nd in T;
  }
  function u$(T) {
    var j = T && T.constructor, q = typeof j == "function" && j.prototype || Ft;
    return T === q;
  }
  function f$(T) {
    return Id.call(T);
  }
  function $n(T) {
    if (T != null) {
      try {
        return Fr.call(T);
      } catch {
      }
      try {
        return T + "";
      } catch {
      }
    }
    return "";
  }
  function xd(T, j) {
    return T === j || T !== T && j !== j;
  }
  var d$ = Fd(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Fd : function(T) {
    return Yi(T) && wt.call(T, "callee") && !Dd.call(T, "callee");
  }, da = Array.isArray;
  function h$(T) {
    return T != null && qd(T.length) && !Vd(T);
  }
  var Ec = E_ || g$;
  function p$(T, j) {
    return Ld(T, j);
  }
  function Vd(T) {
    if (!Bd(T))
      return !1;
    var j = Wi(T);
    return j == p || j == g || j == u || j == C;
  }
  function qd(T) {
    return typeof T == "number" && T > -1 && T % 1 == 0 && T <= a;
  }
  function Bd(T) {
    var j = typeof T;
    return T != null && (j == "object" || j == "function");
  }
  function Yi(T) {
    return T != null && typeof T == "object";
  }
  var Hd = _e ? Bt(_e) : t$;
  function m$(T) {
    return h$(T) ? J_(T) : r$(T);
  }
  function y$() {
    return [];
  }
  function g$() {
    return !1;
  }
  e.exports = p$;
})(Cs, Cs.exports);
var IU = Cs.exports;
Object.defineProperty(ia, "__esModule", { value: !0 });
ia.DownloadedUpdateHelper = void 0;
ia.createTempUpdateFile = jU;
const CU = xn, RU = pn, hm = IU, Pn = mn, Oo = ke;
class DU {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return Oo.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return hm(this.versionInfo, r) && hm(this.fileInfo.info, n.info) && await (0, Pn.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(n, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, r, n, i, o, a) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, a && await (0, Pn.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Pn.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, r) {
    const n = this.getUpdateInfoFile();
    if (!await (0, Pn.pathExists)(n))
      return null;
    let o;
    try {
      o = await (0, Pn.readJson)(n);
    } catch (u) {
      let l = "No cached update info available";
      return u.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), l += ` (error on read: ${u.message})`), r.info(l), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const s = Oo.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, Pn.pathExists)(s))
      return r.info("Cached update file doesn't exist"), null;
    const c = await kU(s);
    return t.info.sha512 !== c ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, s);
  }
  getUpdateInfoFile() {
    return Oo.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
ia.DownloadedUpdateHelper = DU;
function kU(e, t = "sha512", r = "base64", n) {
  return new Promise((i, o) => {
    const a = (0, CU.createHash)(t);
    a.on("error", o).setEncoding(r), (0, RU.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function jU(e, t, r) {
  let n = 0, i = Oo.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, Pn.unlink)(i), i;
    } catch (a) {
      if (a.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${a}`), i = Oo.join(t, `${n++}-${e}`);
    }
  return i;
}
var lc = {}, Pd = {};
Object.defineProperty(Pd, "__esModule", { value: !0 });
Pd.getAppCacheDir = LU;
const sl = ke, FU = ks;
function LU() {
  const e = (0, FU.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || sl.join(e, "AppData", "Local") : process.platform === "darwin" ? t = sl.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || sl.join(e, ".cache"), t;
}
Object.defineProperty(lc, "__esModule", { value: !0 });
lc.ElectronAppAdapter = void 0;
const pm = ke, UU = Pd;
class MU {
  constructor(t = Cr.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? pm.join(process.resourcesPath, "app-update.yml") : pm.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, UU.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (r, n) => t(n));
  }
}
lc.ElectronAppAdapter = MU;
var o_ = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = Ge;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return Cr.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class n extends t.HttpExecutor {
    constructor(o) {
      super(), this.proxyLoginCallback = o, this.cachedSession = null;
    }
    async download(o, a, s) {
      return await s.cancellationToken.createPromise((c, u, l) => {
        const f = {
          headers: s.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, f), (0, t.configureRequestOptions)(f), this.doDownload(f, {
          destination: a,
          options: s,
          onCancel: l,
          callback: (h) => {
            h == null ? c(a) : u(h);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(o, a) {
      o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = r());
      const s = Cr.net.request({
        ...o,
        session: this.cachedSession
      });
      return s.on("response", a), this.proxyLoginCallback != null && s.on("login", this.proxyLoginCallback), s;
    }
    addRedirectHandlers(o, a, s, c, u) {
      o.on("redirect", (l, f, h) => {
        o.abort(), c > this.maxRedirects ? s(this.createMaxRedirectError()) : u(t.HttpExecutor.prepareRedirectUrlOptions(h, a));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(o_);
var oa = {}, qt = {}, xU = "[object Symbol]", a_ = /[\\^$.*+?()[\]{}|]/g, VU = RegExp(a_.source), qU = typeof ct == "object" && ct && ct.Object === Object && ct, BU = typeof self == "object" && self && self.Object === Object && self, HU = qU || BU || Function("return this")(), zU = Object.prototype, GU = zU.toString, mm = HU.Symbol, ym = mm ? mm.prototype : void 0, gm = ym ? ym.toString : void 0;
function KU(e) {
  if (typeof e == "string")
    return e;
  if (YU(e))
    return gm ? gm.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function WU(e) {
  return !!e && typeof e == "object";
}
function YU(e) {
  return typeof e == "symbol" || WU(e) && GU.call(e) == xU;
}
function XU(e) {
  return e == null ? "" : KU(e);
}
function JU(e) {
  return e = XU(e), e && VU.test(e) ? e.replace(a_, "\\$&") : e;
}
var QU = JU;
Object.defineProperty(qt, "__esModule", { value: !0 });
qt.newBaseUrl = eM;
qt.newUrlFromBase = Ql;
qt.getChannelFilename = tM;
qt.blockmapFiles = rM;
const s_ = Di, ZU = QU;
function eM(e) {
  const t = new s_.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function Ql(e, t, r = !1) {
  const n = new s_.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function tM(e) {
  return `${e}.yml`;
}
function rM(e, t, r) {
  const n = Ql(`${e.pathname}.blockmap`, e);
  return [Ql(`${e.pathname.replace(new RegExp(ZU(r), "g"), t)}.blockmap`, e), n];
}
var qe = {};
Object.defineProperty(qe, "__esModule", { value: !0 });
qe.Provider = void 0;
qe.findFile = oM;
qe.parseUpdateInfo = aM;
qe.getFileList = c_;
qe.resolveFiles = sM;
const dn = Ge, nM = Ze, vm = qt;
class iM {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, r, n) {
    return this.executor.request(this.createRequestOptions(t, r), n);
  }
  createRequestOptions(t, r) {
    const n = {};
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, dn.configureRequestUrl)(t, n), n;
  }
}
qe.Provider = iM;
function oM(e, t, r) {
  if (e.length === 0)
    throw (0, dn.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const n = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return n ?? (r == null ? e[0] : e.find((i) => !r.some((o) => i.url.pathname.toLowerCase().endsWith(`.${o}`))));
}
function aM(e, t, r) {
  if (e == null)
    throw (0, dn.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, nM.load)(e);
  } catch (i) {
    throw (0, dn.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function c_(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, dn.newError)(`No files provided: ${(0, dn.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function sM(e, t, r = (n) => n) {
  const i = c_(e).map((s) => {
    if (s.sha2 == null && s.sha512 == null)
      throw (0, dn.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, dn.safeStringifyJson)(s)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, vm.newUrlFromBase)(r(s.url), t),
      info: s
    };
  }), o = e.packages, a = o == null ? null : o[process.arch] || o.ia32;
  return a != null && (i[0].packageInfo = {
    ...a,
    path: (0, vm.newUrlFromBase)(r(a.path), t).href
  }), i;
}
Object.defineProperty(oa, "__esModule", { value: !0 });
oa.GenericProvider = void 0;
const _m = Ge, cl = qt, ll = qe;
class cM extends ll.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, cl.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, cl.getChannelFilename)(this.channel), r = (0, cl.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, ll.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof _m.HttpError && i.statusCode === 404)
          throw (0, _m.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && n < 3) {
          await new Promise((o, a) => {
            try {
              setTimeout(o, 1e3 * n);
            } catch (s) {
              a(s);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, ll.resolveFiles)(t, this.baseUrl);
  }
}
oa.GenericProvider = cM;
var uc = {}, fc = {};
Object.defineProperty(fc, "__esModule", { value: !0 });
fc.BitbucketProvider = void 0;
const $m = Ge, ul = qt, fl = qe;
class lM extends fl.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, ul.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new $m.CancellationToken(), r = (0, ul.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, ul.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, fl.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, $m.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, fl.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
fc.BitbucketProvider = lM;
var hn = {};
Object.defineProperty(hn, "__esModule", { value: !0 });
hn.GitHubProvider = hn.BaseGitHubProvider = void 0;
hn.computeReleaseNotes = u_;
const Tr = Ge, pi = id, uM = Di, mi = qt, Zl = qe, dl = /\/tag\/([^/]+)$/;
class l_ extends Zl.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, mi.newBaseUrl)((0, Tr.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, mi.newBaseUrl)((0, Tr.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
hn.BaseGitHubProvider = l_;
class fM extends l_ {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, o;
    const a = new Tr.CancellationToken(), s = await this.httpRequest((0, mi.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, a), c = (0, Tr.parseXml)(s);
    let u = c.element("entry", !1, "No published versions on GitHub"), l = null;
    try {
      if (this.updater.allowPrerelease) {
        const v = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = pi.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (v === null)
          l = dl.exec(u.element("link").attribute("href"))[1];
        else
          for (const y of c.getElements("entry")) {
            const E = dl.exec(y.element("link").attribute("href"));
            if (E === null)
              continue;
            const A = E[1], C = ((n = pi.prerelease(A)) === null || n === void 0 ? void 0 : n[0]) || null, D = !v || ["alpha", "beta"].includes(v), V = C !== null && !["alpha", "beta"].includes(String(C));
            if (D && !V && !(v === "beta" && C === "alpha")) {
              l = A;
              break;
            }
            if (C && C === v) {
              l = A;
              break;
            }
          }
      } else {
        l = await this.getLatestTagName(a);
        for (const v of c.getElements("entry"))
          if (dl.exec(v.element("link").attribute("href"))[1] === l) {
            u = v;
            break;
          }
      }
    } catch (v) {
      throw (0, Tr.newError)(`Cannot parse releases feed: ${v.stack || v.message},
XML:
${s}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (l == null)
      throw (0, Tr.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, h = "", p = "";
    const g = async (v) => {
      h = (0, mi.getChannelFilename)(v), p = (0, mi.newUrlFromBase)(this.getBaseDownloadPath(String(l), h), this.baseUrl);
      const y = this.createRequestOptions(p);
      try {
        return await this.executor.request(y, a);
      } catch (E) {
        throw E instanceof Tr.HttpError && E.statusCode === 404 ? (0, Tr.newError)(`Cannot find ${h} in the latest release artifacts (${p}): ${E.stack || E.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : E;
      }
    };
    try {
      let v = this.channel;
      this.updater.allowPrerelease && (!((i = pi.prerelease(l)) === null || i === void 0) && i[0]) && (v = this.getCustomChannelName(String((o = pi.prerelease(l)) === null || o === void 0 ? void 0 : o[0]))), f = await g(v);
    } catch (v) {
      if (this.updater.allowPrerelease)
        f = await g(this.getDefaultChannelName());
      else
        throw v;
    }
    const $ = (0, Zl.parseUpdateInfo)(f, h, p);
    return $.releaseName == null && ($.releaseName = u.elementValueOrEmpty("title")), $.releaseNotes == null && ($.releaseNotes = u_(this.updater.currentVersion, this.updater.fullChangelog, c, u)), {
      tag: l,
      ...$
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, mi.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new uM.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, Tr.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, Zl.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
hn.GitHubProvider = fM;
function wm(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function u_(e, t, r, n) {
  if (!t)
    return wm(n);
  const i = [];
  for (const o of r.getElements("entry")) {
    const a = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    pi.lt(e, a) && i.push({
      version: a,
      note: wm(o)
    });
  }
  return i.sort((o, a) => pi.rcompare(o.version, a.version));
}
var dc = {};
Object.defineProperty(dc, "__esModule", { value: !0 });
dc.KeygenProvider = void 0;
const Em = Ge, hl = qt, pl = qe;
class dM extends pl.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, hl.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Em.CancellationToken(), r = (0, hl.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, hl.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, pl.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Em.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, pl.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
dc.KeygenProvider = dM;
var hc = {};
Object.defineProperty(hc, "__esModule", { value: !0 });
hc.PrivateGitHubProvider = void 0;
const ni = Ge, hM = Ze, pM = ke, bm = Di, Sm = qt, mM = hn, yM = qe;
class gM extends mM.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new ni.CancellationToken(), r = (0, Sm.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((s) => s.name === r);
    if (i == null)
      throw (0, ni.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new bm.URL(i.url);
    let a;
    try {
      a = (0, hM.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (s) {
      throw s instanceof ni.HttpError && s.statusCode === 404 ? (0, ni.newError)(`Cannot find ${r} in the latest release artifacts (${o}): ${s.stack || s.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : s;
    }
    return a.assets = n.assets, a;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const r = this.updater.allowPrerelease;
    let n = this.basePath;
    r || (n = `${n}/latest`);
    const i = (0, Sm.newUrlFromBase)(n, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return r ? o.find((a) => a.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, ni.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, yM.getFileList)(t).map((r) => {
      const n = pM.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === n);
      if (i == null)
        throw (0, ni.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new bm.URL(i.url),
        info: r
      };
    });
  }
}
hc.PrivateGitHubProvider = gM;
Object.defineProperty(uc, "__esModule", { value: !0 });
uc.isUrlProbablySupportMultiRangeRequests = f_;
uc.createClient = EM;
const Ha = Ge, vM = fc, Pm = oa, _M = hn, $M = dc, wM = hc;
function f_(e) {
  return !e.includes("s3.amazonaws.com");
}
function EM(e, t, r) {
  if (typeof e == "string")
    throw (0, Ha.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new _M.GitHubProvider(i, t, r) : new wM.PrivateGitHubProvider(i, t, o, r);
    }
    case "bitbucket":
      return new vM.BitbucketProvider(e, t, r);
    case "keygen":
      return new $M.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new Pm.GenericProvider({
        provider: "generic",
        url: (0, Ha.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new Pm.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && f_(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, Ha.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, r);
    }
    default:
      throw (0, Ha.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var pc = {}, aa = {}, zi = {}, Wn = {};
Object.defineProperty(Wn, "__esModule", { value: !0 });
Wn.OperationKind = void 0;
Wn.computeOperations = bM;
var jn;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(jn || (Wn.OperationKind = jn = {}));
function bM(e, t, r) {
  const n = Om(e.files), i = Om(t.files);
  let o = null;
  const a = t.files[0], s = [], c = a.name, u = n.get(c);
  if (u == null)
    throw new Error(`no file ${c} in old blockmap`);
  const l = i.get(c);
  let f = 0;
  const { checksumToOffset: h, checksumToOldSize: p } = PM(n.get(c), u.offset, r);
  let g = a.offset;
  for (let $ = 0; $ < l.checksums.length; g += l.sizes[$], $++) {
    const v = l.sizes[$], y = l.checksums[$];
    let E = h.get(y);
    E != null && p.get(y) !== v && (r.warn(`Checksum ("${y}") matches, but size differs (old: ${p.get(y)}, new: ${v})`), E = void 0), E === void 0 ? (f++, o != null && o.kind === jn.DOWNLOAD && o.end === g ? o.end += v : (o = {
      kind: jn.DOWNLOAD,
      start: g,
      end: g + v
      // oldBlocks: null,
    }, Tm(o, s, y, $))) : o != null && o.kind === jn.COPY && o.end === E ? o.end += v : (o = {
      kind: jn.COPY,
      start: E,
      end: E + v
      // oldBlocks: [checksum]
    }, Tm(o, s, y, $));
  }
  return f > 0 && r.info(`File${a.name === "file" ? "" : " " + a.name} has ${f} changed blocks`), s;
}
const SM = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Tm(e, t, r, n) {
  if (SM && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((a, s) => a < s ? a : s);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${jn[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function PM(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let a = 0; a < e.checksums.length; a++) {
    const s = e.checksums[a], c = e.sizes[a], u = i.get(s);
    if (u === void 0)
      n.set(s, o), i.set(s, c);
    else if (r.debug != null) {
      const l = u === c ? "(same size)" : `(size: ${u}, this size: ${c})`;
      r.debug(`${s} duplicated in blockmap ${l}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += c;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function Om(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.DataSplitter = void 0;
zi.copyData = d_;
const za = Ge, TM = pn, OM = zo, AM = Wn, Am = Buffer.from(`\r
\r
`);
var Jr;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(Jr || (Jr = {}));
function d_(e, t, r, n, i) {
  const o = (0, TM.createReadStream)("", {
    fd: r,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  o.on("error", n), o.once("end", i), o.pipe(t, {
    end: !1
  });
}
class NM extends OM.Writable {
  constructor(t, r, n, i, o, a) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = o, this.finishHandler = a, this.partIndex = -1, this.headerListBuffer = null, this.readState = Jr.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, r, n) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(n).catch(n);
  }
  async handleData(t) {
    let r = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, za.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const n = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= n, r = n;
    } else if (this.remainingPartDataCount > 0) {
      const n = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= n, await this.processPartData(t, 0, n), r = n;
    }
    if (r !== t.length) {
      if (this.readState === Jr.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = Jr.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === Jr.BODY)
          this.readState = Jr.INIT;
        else {
          this.partIndex++;
          let a = this.partIndexToTaskIndex.get(this.partIndex);
          if (a == null)
            if (this.isFinished)
              a = this.options.end;
            else
              throw (0, za.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const s = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (s < a)
            await this.copyExistingData(s, a);
          else if (s > a)
            throw (0, za.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = Jr.HEADER;
            return;
          }
        }
        const n = this.partIndexToLength[this.partIndex], i = r + n, o = Math.min(i, t.length);
        if (await this.processPartStarted(t, r, o), this.remainingPartDataCount = n - (o - r), this.remainingPartDataCount > 0)
          return;
        if (r = i + this.boundaryLength, r >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, r) {
    return new Promise((n, i) => {
      const o = () => {
        if (t === r) {
          n();
          return;
        }
        const a = this.options.tasks[t];
        if (a.kind !== AM.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        d_(a, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(Am, r);
    if (n !== -1)
      return n + Am.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, za.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, r, n) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, r, n);
  }
  processPartData(t, r, n) {
    this.actualPartLength += n - r;
    const i = this.out;
    return i.write(r === 0 && t.length === n ? t : t.slice(r, n)) ? Promise.resolve() : new Promise((o, a) => {
      i.on("error", a), i.once("drain", () => {
        i.removeListener("error", a), o();
      });
    });
  }
}
zi.DataSplitter = NM;
var mc = {};
Object.defineProperty(mc, "__esModule", { value: !0 });
mc.executeTasksUsingMultipleRangeRequests = IM;
mc.checkIsRangesSupported = tu;
const eu = Ge, Nm = zi, Im = Wn;
function IM(e, t, r, n, i) {
  const o = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const s = a + 1e3;
    CM(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, s),
      oldFileFd: n
    }, r, () => o(s), i);
  };
  return o;
}
function CM(e, t, r, n, i) {
  let o = "bytes=", a = 0;
  const s = /* @__PURE__ */ new Map(), c = [];
  for (let f = t.start; f < t.end; f++) {
    const h = t.tasks[f];
    h.kind === Im.OperationKind.DOWNLOAD && (o += `${h.start}-${h.end - 1}, `, s.set(a, f), a++, c.push(h.end - h.start));
  }
  if (a <= 1) {
    const f = (h) => {
      if (h >= t.end) {
        n();
        return;
      }
      const p = t.tasks[h++];
      if (p.kind === Im.OperationKind.COPY)
        (0, Nm.copyData)(p, r, t.oldFileFd, i, () => f(h));
      else {
        const g = e.createRequestOptions();
        g.headers.Range = `bytes=${p.start}-${p.end - 1}`;
        const $ = e.httpExecutor.createRequest(g, (v) => {
          tu(v, i) && (v.pipe(r, {
            end: !1
          }), v.once("end", () => f(h)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers($, i), $.end();
      }
    };
    f(t.start);
    return;
  }
  const u = e.createRequestOptions();
  u.headers.Range = o.substring(0, o.length - 2);
  const l = e.httpExecutor.createRequest(u, (f) => {
    if (!tu(f, i))
      return;
    const h = (0, eu.safeGetHeader)(f, "content-type"), p = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(h);
    if (p == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${h}"`));
      return;
    }
    const g = new Nm.DataSplitter(r, t, s, p[1] || p[2], c, n);
    g.on("error", i), f.pipe(g), f.on("end", () => {
      setTimeout(() => {
        l.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(l, i), l.end();
}
function tu(e, t) {
  if (e.statusCode >= 400)
    return t((0, eu.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, eu.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var yc = {};
Object.defineProperty(yc, "__esModule", { value: !0 });
yc.ProgressDifferentialDownloadCallbackTransform = void 0;
const RM = zo;
var yi;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(yi || (yi = {}));
class DM extends RM.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = yi.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == yi.COPY) {
      n(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  beginFileCopy() {
    this.operationType = yi.COPY;
  }
  beginRangeDownload() {
    this.operationType = yi.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
yc.ProgressDifferentialDownloadCallbackTransform = DM;
Object.defineProperty(aa, "__esModule", { value: !0 });
aa.DifferentialDownloader = void 0;
const ao = Ge, ml = mn, kM = pn, jM = zi, FM = Di, Ga = Wn, Cm = mc, LM = yc;
class UM {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, r, n) {
    this.blockAwareFileInfo = t, this.httpExecutor = r, this.options = n, this.fileMetadataBuffer = null, this.logger = n.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, ao.configureRequestUrl)(this.options.newUrl, t), (0, ao.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, Ga.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let o = 0, a = 0;
    for (const c of i) {
      const u = c.end - c.start;
      c.kind === Ga.OperationKind.DOWNLOAD ? o += u : a += u;
    }
    const s = this.blockAwareFileInfo.size;
    if (o + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${a}, newSize: ${s}`);
    return n.info(`Full: ${Rm(s)}, To download: ${Rm(o)} (${Math.round(o / (s / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, ml.close)(i.descriptor).catch((o) => {
      this.logger.error(`cannot close file "${i.path}": ${o}`);
    })));
    return this.doDownloadFile(t, r).then(n).catch((i) => n().catch((o) => {
      try {
        this.logger.error(`cannot close files: ${o}`);
      } catch (a) {
        try {
          console.error(a);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, r) {
    const n = await (0, ml.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, ml.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const o = (0, kM.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((a, s) => {
      const c = [];
      let u;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const y = [];
        let E = 0;
        for (const C of t)
          C.kind === Ga.OperationKind.DOWNLOAD && (y.push(C.end - C.start), E += C.end - C.start);
        const A = {
          expectedByteCounts: y,
          grandTotal: E
        };
        u = new LM.ProgressDifferentialDownloadCallbackTransform(A, this.options.cancellationToken, this.options.onProgress), c.push(u);
      }
      const l = new ao.DigestTransform(this.blockAwareFileInfo.sha512);
      l.isValidateOnEnd = !1, c.push(l), o.on("finish", () => {
        o.close(() => {
          r.splice(1, 1);
          try {
            l.validate();
          } catch (y) {
            s(y);
            return;
          }
          a(void 0);
        });
      }), c.push(o);
      let f = null;
      for (const y of c)
        y.on("error", s), f == null ? f = y : f = f.pipe(y);
      const h = c[0];
      let p;
      if (this.options.isUseMultipleRangeRequest) {
        p = (0, Cm.executeTasksUsingMultipleRangeRequests)(this, t, h, n, s), p(0);
        return;
      }
      let g = 0, $ = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const v = this.createRequestOptions();
      v.redirect = "manual", p = (y) => {
        var E, A;
        if (y >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const C = t[y++];
        if (C.kind === Ga.OperationKind.COPY) {
          u && u.beginFileCopy(), (0, jM.copyData)(C, h, n, s, () => p(y));
          return;
        }
        const D = `bytes=${C.start}-${C.end - 1}`;
        v.headers.range = D, (A = (E = this.logger) === null || E === void 0 ? void 0 : E.debug) === null || A === void 0 || A.call(E, `download range: ${D}`), u && u.beginRangeDownload();
        const V = this.httpExecutor.createRequest(v, (z) => {
          z.on("error", s), z.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), z.statusCode >= 400 && s((0, ao.createHttpError)(z)), z.pipe(h, {
            end: !1
          }), z.once("end", () => {
            u && u.endRangeDownload(), ++g === 100 ? (g = 0, setTimeout(() => p(y), 1e3)) : p(y);
          });
        });
        V.on("redirect", (z, G, N) => {
          this.logger.info(`Redirect to ${MM(N)}`), $ = N, (0, ao.configureRequestUrl)(new FM.URL($), v), V.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(V, s), V.end();
      }, p(0);
    });
  }
  async readRemoteBytes(t, r) {
    const n = Buffer.allocUnsafe(r + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${r}`;
    let o = 0;
    if (await this.request(i, (a) => {
      a.copy(n, o), o += a.length;
    }), o !== n.length)
      throw new Error(`Received data length ${o} is not equal to expected ${n.length}`);
    return n;
  }
  request(t, r) {
    return new Promise((n, i) => {
      const o = this.httpExecutor.createRequest(t, (a) => {
        (0, Cm.checkIsRangesSupported)(a, i) && (a.on("error", i), a.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), a.on("data", r), a.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
aa.DifferentialDownloader = UM;
function Rm(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function MM(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(pc, "__esModule", { value: !0 });
pc.GenericDifferentialDownloader = void 0;
const xM = aa;
class VM extends xM.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
pc.GenericDifferentialDownloader = VM;
var yn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = Ge;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class r {
    constructor(o) {
      this.emitter = o;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(o) {
      n(this.emitter, "login", o);
    }
    progress(o) {
      n(this.emitter, e.DOWNLOAD_PROGRESS, o);
    }
    updateDownloaded(o) {
      n(this.emitter, e.UPDATE_DOWNLOADED, o);
    }
    updateCancelled(o) {
      n(this.emitter, "update-cancelled", o);
    }
  }
  e.UpdaterSignal = r;
  function n(i, o, a) {
    i.on(o, a);
  }
})(yn);
Object.defineProperty(ln, "__esModule", { value: !0 });
ln.NoOpLogger = ln.AppUpdater = void 0;
const ut = Ge, qM = xn, BM = ks, HM = ty, ii = mn, zM = Ze, yl = cc, Sn = ke, Tn = id, Dm = ia, GM = lc, km = o_, KM = oa, gl = uc, WM = ny, YM = qt, XM = pc, oi = yn;
class Td extends HM.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, ut.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, ut.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, km.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new h_();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new yl.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  constructor(t, r) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new oi.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this.clientPromise = null, this.stagingUserIdPromise = new yl.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new yl.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), r == null ? (this.app = new GM.ElectronAppAdapter(), this.httpExecutor = new km.ElectronHttpExecutor((o, a) => this.emit("login", o, a))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, Tn.parse)(n);
    if (i == null)
      throw (0, ut.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = JM(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const r = this.createProviderRuntimeOptions();
    let n;
    typeof t == "string" ? n = new KM.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, gl.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, gl.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const r = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((n) => (r(), n)).catch((n) => {
      throw r(), this.emit("error", n, `Cannot check for updates: ${(n.stack || n).toString()}`), n;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((r) => r != null && r.downloadPromise ? (r.downloadPromise.then(() => {
      const n = Td.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new Cr.Notification(n).show();
    }), r) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), r));
  }
  static formatDownloadNotification(t, r, n) {
    return n == null && (n = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), n = {
      title: n.title.replace("{appName}", r).replace("{version}", t),
      body: n.body.replace("{appName}", r).replace("{version}", t)
    }, n;
  }
  async isStagingMatch(t) {
    const r = t.stagingPercentage;
    let n = r;
    if (n == null)
      return !0;
    if (n = parseInt(n, 10), isNaN(n))
      return this._logger.warn(`Staging percentage is NaN: ${r}`), !0;
    n = n / 100;
    const i = await this.stagingUserIdPromise.value, a = ut.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${a}, user id: ${i}`), a < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, Tn.parse)(t.version);
    if (r == null)
      throw (0, ut.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, Tn.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await this.isStagingMatch(t))
      return !1;
    const o = (0, Tn.gt)(r, n), a = (0, Tn.lt)(r, n);
    return o ? !0 : this.allowDowngrade && a;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, BM.release)();
    if (r)
      try {
        if ((0, Tn.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, gl.createClient)(n, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, r = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": r })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), r = t.info;
    if (!await this.isUpdateAvailable(r))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${r.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", r), {
        isUpdateAvailable: !1,
        versionInfo: r,
        updateInfo: r
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(r);
    const n = new ut.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, ut.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new ut.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, ut.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof ut.CancellationError))
        try {
          this.dispatchError(i);
        } catch (o) {
          this._logger.warn(`Cannot dispatch error event: ${o.stack || o}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: r,
      requestHeaders: this.computeRequestHeaders(r.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw n(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(oi.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, zM.load)(await (0, ii.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const r = t.fileExtraDownloadHeaders;
    if (r != null) {
      const n = this.requestHeaders;
      return n == null ? r : {
        ...r,
        ...n
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = Sn.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, ii.readFile)(t, "utf-8");
      if (ut.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = ut.UUID.v5((0, qM.randomBytes)(4096), ut.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, ii.outputFile)(t, r);
    } catch (n) {
      this._logger.warn(`Couldn't write out staging user ID: ${n}`);
    }
    return r;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const r of Object.keys(t)) {
      const n = r.toLowerCase();
      if (n === "authorization" || n === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const r = (await this.configOnDisk.value).updaterCacheDirName, n = this._logger;
      r == null && n.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = Sn.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new Dm.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const r = t.fileInfo, n = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: r.info.sha2,
      sha512: r.info.sha512
    };
    this.listenerCount(oi.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (E) => this.emit(oi.DOWNLOAD_PROGRESS, E));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, a = r.packageInfo;
    function s() {
      const E = decodeURIComponent(t.fileInfo.url.pathname);
      return E.endsWith(`.${t.fileExtension}`) ? Sn.basename(E) : t.fileInfo.info.url;
    }
    const c = await this.getOrCreateDownloadHelper(), u = c.cacheDirForPendingUpdate;
    await (0, ii.mkdir)(u, { recursive: !0 });
    const l = s();
    let f = Sn.join(u, l);
    const h = a == null ? null : Sn.join(u, `package-${o}${Sn.extname(a.path) || ".7z"}`), p = async (E) => (await c.setDownloadedFile(f, h, i, r, l, E), await t.done({
      ...i,
      downloadedFile: f
    }), h == null ? [f] : [f, h]), g = this._logger, $ = await c.validateDownloadedPath(f, i, r, g);
    if ($ != null)
      return f = $, await p(!1);
    const v = async () => (await c.clear().catch(() => {
    }), await (0, ii.unlink)(f).catch(() => {
    })), y = await (0, Dm.createTempUpdateFile)(`temp-${l}`, u, g);
    try {
      await t.task(y, n, h, v), await (0, ut.retry)(() => (0, ii.rename)(y, f), 60, 500, 0, 0, (E) => E instanceof Error && /^EBUSY:/.test(E.message));
    } catch (E) {
      throw await v(), E instanceof ut.CancellationError && (g.info("cancelled"), this.emit("update-cancelled", i)), E;
    }
    return g.info(`New version ${o} has been downloaded to ${f}`), await p(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const a = (0, YM.blockmapFiles)(t.url, this.app.version, r.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${a[0]}", new: ${a[1]})`);
      const s = async (l) => {
        const f = await this.httpExecutor.downloadToBuffer(l, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (f == null || f.length === 0)
          throw new Error(`Blockmap "${l.href}" is empty`);
        try {
          return JSON.parse((0, WM.gunzipSync)(f).toString());
        } catch (h) {
          throw new Error(`Cannot parse blockmap "${l.href}", error: ${h}`);
        }
      }, c = {
        newUrl: t.url,
        oldFile: Sn.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(oi.DOWNLOAD_PROGRESS) > 0 && (c.onProgress = (l) => this.emit(oi.DOWNLOAD_PROGRESS, l));
      const u = await Promise.all(a.map((l) => s(l)));
      return await new XM.GenericDifferentialDownloader(t.info, this.httpExecutor, c).download(u[0], u[1]), !1;
    } catch (a) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), this._testOnlyOptions != null)
        throw a;
      return !0;
    }
  }
}
ln.AppUpdater = Td;
function JM(e) {
  const t = (0, Tn.prerelease)(e);
  return t != null && t.length > 0;
}
class h_ {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
ln.NoOpLogger = h_;
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.BaseUpdater = void 0;
const jm = Si, QM = ln;
class ZM extends QM.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Cr.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (r) => (this.dispatchUpdateDownloaded(r), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, r = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const n = this.downloadedUpdateHelper, i = this.installerPath, o = n == null ? null : n.downloadedFileInfo;
    if (i == null || o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${r}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: r,
        isAdminRightsRequired: o.isAdminRightsRequired
      });
    } catch (a) {
      return this.dispatchError(a), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  wrapSudo() {
    const { name: t } = this.app, r = `"${t} would like to update"`, n = this.spawnSyncLog("which gksudo || which kdesudo || which pkexec || which beesu"), i = [n];
    return /kdesudo/i.test(n) ? (i.push("--comment", r), i.push("-c")) : /gksudo/i.test(n) ? i.push("--message", r) : /pkexec/i.test(n) && i.push("--disable-internal-agent"), i.join(" ");
  }
  spawnSyncLog(t, r = [], n = {}) {
    this._logger.info(`Executing: ${t} with args: ${r}`);
    const i = (0, jm.spawnSync)(t, r, {
      env: { ...process.env, ...n },
      encoding: "utf-8",
      shell: !0
    }), { error: o, status: a, stdout: s, stderr: c } = i;
    if (o != null)
      throw this._logger.error(c), o;
    if (a != null && a !== 0)
      throw this._logger.error(c), new Error(`Command ${t} exited with code ${a}`);
    return s.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, r = [], n = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${r}`), new Promise((o, a) => {
      try {
        const s = { stdio: i, env: n, detached: !0 }, c = (0, jm.spawn)(t, r, s);
        c.on("error", (u) => {
          a(u);
        }), c.unref(), c.pid !== void 0 && o(!0);
      } catch (s) {
        a(s);
      }
    });
  }
}
jr.BaseUpdater = ZM;
var Mo = {}, sa = {};
Object.defineProperty(sa, "__esModule", { value: !0 });
sa.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const ai = mn, ex = aa, tx = ny;
class rx extends ex.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = p_(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await nx(this.options.oldFile), i);
  }
}
sa.FileWithEmbeddedBlockMapDifferentialDownloader = rx;
function p_(e) {
  return JSON.parse((0, tx.inflateRawSync)(e).toString());
}
async function nx(e) {
  const t = await (0, ai.open)(e, "r");
  try {
    const r = (await (0, ai.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, ai.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, ai.read)(t, i, 0, i.length, r - n.length - i.length), await (0, ai.close)(t), p_(i);
  } catch (r) {
    throw await (0, ai.close)(t), r;
  }
}
Object.defineProperty(Mo, "__esModule", { value: !0 });
Mo.AppImageUpdater = void 0;
const Fm = Ge, Lm = Si, ix = mn, ox = pn, so = ke, ax = jr, sx = sa, cx = qe, Um = yn;
class lx extends ax.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, cx.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const a = process.env.APPIMAGE;
        if (a == null)
          throw (0, Fm.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, a, i, r, t)) && await this.httpExecutor.download(n.url, i, o), await (0, ix.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, r, n, i, o) {
    try {
      const a = {
        newUrl: t.url,
        oldFile: r,
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: o.requestHeaders,
        cancellationToken: o.cancellationToken
      };
      return this.listenerCount(Um.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(Um.DOWNLOAD_PROGRESS, s)), await new sx.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, a).download(), !1;
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, Fm.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, ox.unlinkSync)(r);
    let n;
    const i = so.basename(r), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    so.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = so.join(so.dirname(r), so.basename(o)), (0, Lm.execFileSync)("mv", ["-f", o, n]), n !== r && this.emit("appimage-filename-updated", n);
    const a = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], a) : (a.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Lm.execFileSync)(n, [], { env: a })), !0;
  }
}
Mo.AppImageUpdater = lx;
var xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
xo.DebUpdater = void 0;
const ux = jr, fx = qe, Mm = yn;
class dx extends ux.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, fx.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Mm.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Mm.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const o = ["dpkg", "-i", i, "||", "apt-get", "install", "-f", "-y"];
    return this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${o.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
xo.DebUpdater = dx;
var Vo = {};
Object.defineProperty(Vo, "__esModule", { value: !0 });
Vo.PacmanUpdater = void 0;
const hx = jr, xm = yn, px = qe;
class mx extends hx.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, px.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(xm.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(xm.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const o = ["pacman", "-U", "--noconfirm", i];
    return this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${o.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
Vo.PacmanUpdater = mx;
var qo = {};
Object.defineProperty(qo, "__esModule", { value: !0 });
qo.RpmUpdater = void 0;
const yx = jr, Vm = yn, gx = qe;
class vx extends yx.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, gx.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Vm.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Vm.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.spawnSyncLog("which zypper"), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    let a;
    return i ? a = [i, "--no-refresh", "install", "--allow-unsigned-rpm", "-y", "-f", o] : a = [this.spawnSyncLog("which dnf || which yum"), "-y", "install", o], this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${a.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
qo.RpmUpdater = vx;
var Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
Bo.MacUpdater = void 0;
const qm = Ge, vl = mn, _x = pn, Bm = ke, $x = E$, wx = ln, Ex = qe, Hm = Si, zm = xn;
class bx extends wx.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = Cr.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
      this._logger.warn(n), this.emit("error", n);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let r = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const n = this._logger, i = "sysctl.proc_translated";
    let o = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), o = (0, Hm.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let a = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, Hm.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${h}`), a = a || h;
    } catch (f) {
      n.warn(`uname shell command to check for arm64 failed: ${f}`);
    }
    a = a || process.arch === "arm64" || o;
    const s = (f) => {
      var h;
      return f.url.pathname.includes("arm64") || ((h = f.info.url) === null || h === void 0 ? void 0 : h.includes("arm64"));
    };
    a && r.some(s) ? r = r.filter((f) => a === s(f)) : r = r.filter((f) => !s(f));
    const c = (0, Ex.findFile)(r, "zip", ["pkg", "dmg"]);
    if (c == null)
      throw (0, qm.newError)(`ZIP file not provided: ${(0, qm.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const u = t.updateInfoAndProvider.provider, l = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: c,
      downloadUpdateOptions: t,
      task: async (f, h) => {
        const p = Bm.join(this.downloadedUpdateHelper.cacheDir, l), g = () => (0, vl.pathExistsSync)(p) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let $ = !0;
        g() && ($ = await this.differentialDownloadInstaller(c, t, f, u, l)), $ && await this.httpExecutor.download(c.url, f, h);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = Bm.join(this.downloadedUpdateHelper.cacheDir, l);
            await (0, vl.copyFile)(f.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(c, f);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, o = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, vl.stat)(i)).size, a = this._logger, s = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${s})`), this.server = (0, $x.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${s})`), this.server.on("close", () => {
      a.info(`Proxy server for native Squirrel.Mac is closed (${s})`);
    });
    const c = (u) => {
      const l = u.address();
      return typeof l == "string" ? l : `http://127.0.0.1:${l == null ? void 0 : l.port}`;
    };
    return await new Promise((u, l) => {
      const f = (0, zm.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${f}`, "ascii"), p = `/${(0, zm.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (g, $) => {
        const v = g.url;
        if (a.info(`${v} requested`), v === "/") {
          if (!g.headers.authorization || g.headers.authorization.indexOf("Basic ") === -1) {
            $.statusCode = 401, $.statusMessage = "Invalid Authentication Credentials", $.end(), a.warn("No authenthication info");
            return;
          }
          const A = g.headers.authorization.split(" ")[1], C = Buffer.from(A, "base64").toString("ascii"), [D, V] = C.split(":");
          if (D !== "autoupdater" || V !== f) {
            $.statusCode = 401, $.statusMessage = "Invalid Authentication Credentials", $.end(), a.warn("Invalid authenthication credentials");
            return;
          }
          const z = Buffer.from(`{ "url": "${c(this.server)}${p}" }`);
          $.writeHead(200, { "Content-Type": "application/json", "Content-Length": z.length }), $.end(z);
          return;
        }
        if (!v.startsWith(p)) {
          a.warn(`${v} requested, but not supported`), $.writeHead(404), $.end();
          return;
        }
        a.info(`${p} requested by Squirrel.Mac, pipe ${i}`);
        let y = !1;
        $.on("finish", () => {
          y || (this.nativeUpdater.removeListener("error", l), u([]));
        });
        const E = (0, _x.createReadStream)(i);
        E.on("error", (A) => {
          try {
            $.end();
          } catch (C) {
            a.warn(`cannot end response: ${C}`);
          }
          y = !0, this.nativeUpdater.removeListener("error", l), l(new Error(`Cannot pipe "${i}": ${A}`));
        }), $.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), E.pipe($);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${s})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${c(this.server)}, ${s})`), this.nativeUpdater.setFeedURL({
          url: c(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${h.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", l), this.nativeUpdater.checkForUpdates()) : u([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
Bo.MacUpdater = bx;
var Ho = {}, Od = {};
Object.defineProperty(Od, "__esModule", { value: !0 });
Od.verifySignature = Px;
const Gm = Ge, m_ = Si, Sx = ks, Km = ke;
function Px(e, t, r) {
  return new Promise((n, i) => {
    const o = t.replace(/'/g, "''");
    r.info(`Verifying signature ${o}`), (0, m_.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (a, s, c) => {
      var u;
      try {
        if (a != null || c) {
          _l(r, a, c, i), n(null);
          return;
        }
        const l = Tx(s);
        if (l.Status === 0) {
          try {
            const g = Km.normalize(l.Path), $ = Km.normalize(t);
            if (r.info(`LiteralPath: ${g}. Update Path: ${$}`), g !== $) {
              _l(r, new Error(`LiteralPath of ${g} is different than ${$}`), c, i), n(null);
              return;
            }
          } catch (g) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(u = g.message) !== null && u !== void 0 ? u : g.stack}`);
          }
          const h = (0, Gm.parseDn)(l.SignerCertificate.Subject);
          let p = !1;
          for (const g of e) {
            const $ = (0, Gm.parseDn)(g);
            if ($.size ? p = Array.from($.keys()).every((y) => $.get(y) === h.get(y)) : g === h.get("CN") && (r.warn(`Signature validated using only CN ${g}. Please add your full Distinguished Name (DN) to publisherNames configuration`), p = !0), p) {
              n(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(l, (h, p) => h === "RawData" ? void 0 : p, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), n(f);
      } catch (l) {
        _l(r, l, null, i), n(null);
        return;
      }
    });
  });
}
function Tx(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function _l(e, t, r, n) {
  if (Ox()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, m_.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function Ox() {
  const e = Sx.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Ho, "__esModule", { value: !0 });
Ho.NsisUpdater = void 0;
const Ka = Ge, Wm = ke, Ax = jr, Nx = sa, Ym = yn, Ix = qe, Cx = mn, Rx = Od, Xm = Di;
class Dx extends Ax.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, Rx.verifySignature)(n, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, Ix.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, o, a, s) => {
        const c = n.packageInfo, u = c != null && a != null;
        if (u && t.disableWebInstaller)
          throw (0, Ka.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !u && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (u || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Ka.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, o);
        const l = await this.verifySignature(i);
        if (l != null)
          throw await s(), (0, Ka.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${l}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (u && await this.differentialDownloadWebPackage(t, c, a, r))
          try {
            await this.httpExecutor.download(new Xm.URL(c.path), a, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: c.sha512
            });
          } catch (f) {
            try {
              await (0, Cx.unlink)(a);
            } catch {
            }
            throw f;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let r;
    try {
      if (r = (await this.configOnDisk.value).publisherName, r == null)
        return null;
    } catch (n) {
      if (n.code === "ENOENT")
        return null;
      throw n;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(r) ? r : [r], t);
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const n = ["--updated"];
    t.isSilent && n.push("/S"), t.isForceRunAfter && n.push("--force-run"), this.installDirectory && n.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && n.push(`--package-file=${i}`);
    const o = () => {
      this.spawnLog(Wm.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((a) => this.dispatchError(a));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(r, n).catch((a) => {
      const s = a.code;
      this._logger.info(`Cannot run installer: error code: ${s}, error message: "${a.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), s === "UNKNOWN" || s === "EACCES" ? o() : s === "ENOENT" ? Cr.shell.openPath(r).catch((c) => this.dispatchError(c)) : this.dispatchError(a);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new Xm.URL(r.path),
        oldFile: Wm.join(this.downloadedUpdateHelper.cacheDir, Ka.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(Ym.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Ym.DOWNLOAD_PROGRESS, a)), await new Nx.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
Ho.NsisUpdater = Dx;
(function(e) {
  var t = ct && ct.__createBinding || (Object.create ? function(v, y, E, A) {
    A === void 0 && (A = E);
    var C = Object.getOwnPropertyDescriptor(y, E);
    (!C || ("get" in C ? !y.__esModule : C.writable || C.configurable)) && (C = { enumerable: !0, get: function() {
      return y[E];
    } }), Object.defineProperty(v, A, C);
  } : function(v, y, E, A) {
    A === void 0 && (A = E), v[A] = y[E];
  }), r = ct && ct.__exportStar || function(v, y) {
    for (var E in v) E !== "default" && !Object.prototype.hasOwnProperty.call(y, E) && t(y, v, E);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = mn, i = ke;
  var o = jr;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var a = ln;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return a.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return a.NoOpLogger;
  } });
  var s = qe;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return s.Provider;
  } });
  var c = Mo;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return c.AppImageUpdater;
  } });
  var u = xo;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return u.DebUpdater;
  } });
  var l = Vo;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return l.PacmanUpdater;
  } });
  var f = qo;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var h = Bo;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var p = Ho;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return p.NsisUpdater;
  } }), r(yn, e);
  let g;
  function $() {
    if (process.platform === "win32")
      g = new Ho.NsisUpdater();
    else if (process.platform === "darwin")
      g = new Bo.MacUpdater();
    else {
      g = new Mo.AppImageUpdater();
      try {
        const v = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(v))
          return g;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const y = (0, n.readFileSync)(v).toString().trim();
        switch (console.info("Found package-type:", y), y) {
          case "deb":
            g = new xo.DebUpdater();
            break;
          case "rpm":
            g = new qo.RpmUpdater();
            break;
          case "pacman":
            g = new Vo.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (v) {
        console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", v.message);
      }
    }
    return g;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => g || $()
  });
})(Yt);
let Jm = !1, $l = null;
function kx(e) {
  if (!Pe.isPackaged) {
    wl(e, { state: "boot", version: Pe.getVersion() });
    return;
  }
  if ($l = e, Jm) {
    wl($l, { state: "boot", version: Pe.getVersion() });
    return;
  }
  Jm = !0, Yt.autoUpdater.autoDownload = !0, Yt.autoUpdater.autoInstallOnAppQuit = !0;
  function t(r) {
    wl($l, r);
  }
  t({ state: "boot", version: Pe.getVersion() }), Yt.autoUpdater.on("checking-for-update", () => t({ state: "checking" })), Yt.autoUpdater.on(
    "update-available",
    (r) => t({
      state: "available",
      version: r == null ? void 0 : r.version,
      releaseNotes: Qm(r == null ? void 0 : r.releaseNotes),
      info: r
    })
  ), Yt.autoUpdater.on("update-not-available", () => t({ state: "none" })), Yt.autoUpdater.on(
    "download-progress",
    (r) => t({ state: "downloading", percent: Number((r == null ? void 0 : r.percent) ?? 0) })
  ), Yt.autoUpdater.on(
    "update-downloaded",
    (r) => t({
      state: "downloaded",
      version: r == null ? void 0 : r.version,
      releaseNotes: Qm(r == null ? void 0 : r.releaseNotes),
      info: r
    })
  ), Yt.autoUpdater.on(
    "error",
    (r) => t({ state: "error", message: String((r == null ? void 0 : r.message) ?? r) })
  ), ht.handle("update:check", async () => {
    try {
      return await Yt.autoUpdater.checkForUpdates(), !0;
    } catch (r) {
      return t({ state: "error", message: String((r == null ? void 0 : r.message) ?? r) }), !1;
    }
  }), ht.handle("update:install", async () => (Yt.autoUpdater.quitAndInstall(), !0));
}
function wl(e, t) {
  try {
    if (!e || e.isDestroyed()) return;
    e.webContents.send("update:status", t);
  } catch {
  }
}
function Qm(e) {
  if (!e) return null;
  if (typeof e == "string") return e;
  if (Array.isArray(e))
    return e.map((t) => {
      if (!t) return "";
      if (typeof t == "string") return t;
      const r = t.version ? `v${t.version}
` : "", n = t.note ?? t.notes ?? "";
      return `${r}${String(n)}`;
    }).filter(Boolean).join(`

---

`);
  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return String(e);
  }
}
const Rs = ie.join(ru.tmpdir(), "twitch-sorteos-cache");
try {
  se.mkdirSync(Rs, { recursive: !0 }), se.mkdirSync(ie.join(Rs, "gpu"), { recursive: !0 });
} catch {
}
Pe.commandLine.appendSwitch("disk-cache-dir", Rs);
Pe.commandLine.appendSwitch("gpu-cache-dir", ie.join(Rs, "gpu"));
Pe.commandLine.appendSwitch("disable-gpu-shader-disk-cache");
Pe.setPath("userData", ie.join(Pe.getPath("appData"), "twitch-sorteos"));
Pe.setPath("cache", ie.join(Pe.getPath("userData"), "Cache"));
const Ad = ie.dirname(Zm(import.meta.url)), m9 = process.env.VITE_DEV_SERVER_URL;
function jx() {
  const e = Pe.isPackaged ? Pe.getAppPath() : ie.join(Ad, "..");
  return {
    RENDERER_DIST: ie.join(e, "dist"),
    MAIN_DIST: ie.join(e, "dist-electron")
  };
}
let we = null;
const cs = "twitch-sorteos";
let y_ = null;
function g_(e) {
  y_ = e, Jt && !Jt.isDestroyed() && (Jt.close(), Jt = null), we && !we.isDestroyed() && (we.webContents.send("oauth:callback", e), we.isMinimized() && we.restore(), we.focus());
}
function v_(e) {
  const t = e.find((r) => r.startsWith(`${cs}://`));
  t && g_(t);
}
const Fx = Pe.requestSingleInstanceLock();
Fx ? Pe.on("second-instance", (e, t) => {
  we && (we.isMinimized() && we.restore(), we.focus()), v_(t);
}) : Pe.quit();
Pe.on("open-url", (e, t) => {
  e.preventDefault(), g_(t);
});
function Lx() {
  try {
    if (process.defaultApp) {
      const e = process.argv[1];
      e ? Pe.setAsDefaultProtocolClient(cs, process.execPath, [
        e
      ]) : Pe.setAsDefaultProtocolClient(cs);
    } else
      Pe.setAsDefaultProtocolClient(cs);
  } catch {
  }
}
function __() {
  if (jx(), we = new Ds({
    width: 1100,
    height: 720,
    webPreferences: {
      // ⚠️ IMPORTANTE: electron-vite suele generar preload.mjs
      preload: ie.join(Ad, "preload.mjs"),
      contextIsolation: !0,
      nodeIntegration: !1,
      partition: "persist:twitch-oauth"
    }
  }), we.webContents.on("did-fail-load", (e, t, r) => {
    console.error("did-fail-load", t, r);
  }), we.webContents.on("did-finish-load", () => {
    we == null || we.webContents.openDevTools({ mode: "detach" }), we == null || we.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), !Pe.isPackaged && process.env.VITE_DEV_SERVER_URL)
    we.loadURL(process.env.VITE_DEV_SERVER_URL);
  else {
    const e = ie.join(Pe.getAppPath(), "dist", "index.html");
    we.loadFile(e);
  }
  v_(process.argv);
}
Pe.on("window-all-closed", () => {
  process.platform !== "darwin" && Pe.quit(), we = null;
});
Pe.on("activate", () => {
  Ds.getAllWindows().length === 0 && __();
});
let Jt = null;
ht.handle("app:getVersion", () => Pe.getVersion());
ht.handle("oauth:twitchStart", async (e, t) => {
  if (Jt && !Jt.isDestroyed())
    return Jt.focus(), !0;
  Jt = new Ds({
    width: 520,
    height: 720,
    resizable: !1,
    minimizable: !0,
    maximizable: !1,
    title: "Conectar Twitch",
    parent: we ?? void 0,
    // usa tu window principal si existe
    modal: !1,
    show: !0,
    webPreferences: {
      preload: ie.join(Ad, "preload.mjs"),
      contextIsolation: !0,
      nodeIntegration: !1,
      partition: "persist:twitch-oauth"
    }
  }), Jt.on("closed", () => {
    Jt = null;
  });
  try {
    return await Jt.loadURL(t), !0;
  } catch (r) {
    throw console.error("oauth:twitchStart loadURL failed:", r), we == null || we.webContents.send("oauth:error", {
      message: String((r == null ? void 0 : r.message) ?? r),
      url: t
    }), r;
  }
});
ht.handle("oauth:getLast", async () => y_);
Pe.whenReady().then(() => {
  Lx(), rk(), nk(), __(), we && kx(we);
});
export {
  m9 as VITE_DEV_SERVER_URL
};
