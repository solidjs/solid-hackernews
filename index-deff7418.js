const equalFn = (a, b) => a === b;
let runEffects = runQueue;
const NOTPENDING = {};
const STALE = 1;
const PENDING = 2;
const UNOWNED = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
const [transPending, setTransPending] = createSignal(false, true);
let Owner = null;
let Listener = null;
let Pending = null;
let Updates = null;
let Effects = null;
let Transition = null;
let ExecCount = 0;
function createRoot(fn, detachedOwner) {
  detachedOwner && (Owner = detachedOwner);
  const listener = Listener,
        owner = Owner,
        root = fn.length === 0 ? UNOWNED : {
    owned: null,
    cleanups: null,
    context: null,
    owner
  };
  Owner = root;
  Listener = null;
  let result;
  try {
    runUpdates(() => result = fn(() => cleanNode(root)), true);
  } finally {
    Listener = listener;
    Owner = owner;
  }
  return result;
}
function createSignal(value, areEqual) {
  const s = {
    value,
    observers: null,
    observerSlots: null,
    pending: NOTPENDING,
    comparator: areEqual ? typeof areEqual === "function" ? areEqual : equalFn : undefined
  };
  return [readSignal.bind(s), writeSignal.bind(s)];
}
function createComputed(fn, value) {
  updateComputation(createComputation(fn, value, true));
}
function createRenderEffect(fn, value) {
  updateComputation(createComputation(fn, value, false));
}
function createMemo(fn, value, areEqual) {
  const c = createComputation(fn, value, true);
  c.pending = NOTPENDING;
  c.observers = null;
  c.observerSlots = null;
  c.state = 0;
  c.comparator = areEqual ? typeof areEqual === "function" ? areEqual : equalFn : undefined;
  updateComputation(c);
  return readSignal.bind(c);
}
function batch(fn) {
  if (Pending) return fn();
  const q = Pending = [],
        result = fn();
  Pending = null;
  runUpdates(() => {
    for (let i = 0; i < q.length; i += 1) {
      const data = q[i];
      if (data.pending !== NOTPENDING) {
        const pending = data.pending;
        data.pending = NOTPENDING;
        writeSignal.call(data, pending);
      }
    }
  }, false);
  return result;
}
function untrack(fn) {
  let result,
      listener = Listener;
  Listener = null;
  result = fn();
  Listener = listener;
  return result;
}
function onCleanup(fn) {
  if (Owner === null) console.warn("cleanups created outside a `createRoot` or `render` will never be run");else if (Owner.cleanups === null) Owner.cleanups = [fn];else Owner.cleanups.push(fn);
  return fn;
}
function createContext(defaultValue) {
  const id = Symbol("context");
  return {
    id,
    Provider: createProvider(id),
    defaultValue
  };
}
function useContext(context) {
  return lookup(Owner, context.id) || context.defaultValue;
}
let SuspenseContext;
function createResource(init, options = {}) {
  const [s, set] = createSignal(init),
        [loading, setLoading] = createSignal(false, true),
        contexts = new Set(),
        h = globalThis._$HYDRATION || {};
  let err = null,
      pr = null;
  function loadEnd(p, v, e) {
    if (pr === p) {
      err = e;
      pr = null;
      completeLoad(v);
    }
    return v;
  }
  function completeLoad(v) {
    batch(() => {
      set(v);
      if (h.asyncSSR && options.name) h.resources[options.name] = v;
      setLoading(false);
      for (let c of contexts.keys()) c.decrement();
      contexts.clear();
    });
  }
  function read() {
    const c = SuspenseContext ,
          v = s();
    if (err) throw err;
    if (Listener && !Listener.user && c) {
      if (!Listener.pure) createComputed(() => {
        s();
        if (pr && c.resolved && Transition) Transition.promises.add(pr);
      });
      if (pr) {
        if (Listener.pure && c.resolved && Transition) Transition.promises.add(pr);else if (!contexts.has(c)) {
          c.increment();
          contexts.add(c);
        }
      }
    }
    return v;
  }
  function load(fn) {
    err = null;
    let p;
    const hydrating = h.context && !!h.context.registry;
    if (hydrating) {
      if (h.loadResource && !options.notStreamed) {
        fn = h.loadResource;
      } else if (options.name && h.resources && options.name in h.resources) {
        fn = () => {
          const data = h.resources[options.name];
          delete h.resources[options.name];
          return data;
        };
      }
    }
    p = fn();
    if (typeof p !== "object" || !("then" in p)) {
      pr = null;
      completeLoad(p);
      return p;
    }
    pr = p;
    batch(() => {
      setLoading(true);
      set(untrack(s));
    });
    return p.then(v => loadEnd(p, v), e => loadEnd(p, s(), e));
  }
  Object.defineProperty(read, "loading", {
    get() {
      return loading();
    }
  });
  return [read, load];
}
function readSignal() {
  if (this.state && this.sources) {
    const updates = Updates;
    Updates = null;
    this.state === STALE ? updateComputation(this) : lookDownstream(this);
    Updates = updates;
  }
  if (Listener) {
    const sSlot = this.observers ? this.observers.length : 0;
    if (!Listener.sources) {
      Listener.sources = [this];
      Listener.sourceSlots = [sSlot];
    } else {
      Listener.sources.push(this);
      Listener.sourceSlots.push(sSlot);
    }
    if (!this.observers) {
      this.observers = [Listener];
      this.observerSlots = [Listener.sources.length - 1];
    } else {
      this.observers.push(Listener);
      this.observerSlots.push(Listener.sources.length - 1);
    }
  }
  return this.value;
}
function writeSignal(value, isComp) {
  if (this.comparator) {
    if (this.comparator(this.value, value)) return value;
  }
  if (Pending) {
    if (this.pending === NOTPENDING) Pending.push(this);
    this.pending = value;
    return value;
  }
  this.value = value;
  if (this.observers && (!Updates || this.observers.length)) {
    runUpdates(() => {
      for (let i = 0; i < this.observers.length; i += 1) {
        const o = this.observers[i];
        if (o.observers && o.state !== PENDING) markUpstream(o);
        o.state = STALE;
        if (o.pure) Updates.push(o);else Effects.push(o);
      }
      if (Updates.length > 10e5) {
        Updates = [];
        throw new Error("Potential Infinite Loop Detected.");
      }
    }, false);
  }
  return value;
}
function updateComputation(node) {
  if (!node.fn) return;
  cleanNode(node);
  const owner = Owner,
        listener = Listener,
        time = ExecCount;
  Listener = Owner = node;
  runComputation(node, node.value, time);
  Listener = listener;
  Owner = owner;
}
function runComputation(node, value, time) {
  let nextValue;
  try {
    nextValue = node.fn(value);
  } catch (err) {
    handleError(err);
  }
  if (!node.updatedAt || node.updatedAt <= time) {
    if (node.observers && node.observers.length) {
      writeSignal.call(node, nextValue, true);
    } else node.value = nextValue;
    node.updatedAt = time;
  }
}
function createComputation(fn, init, pure) {
  const c = {
    fn,
    state: STALE,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: init,
    owner: Owner,
    context: null,
    pure
  };
  if (Owner === null) console.warn("computations created outside a `createRoot` or `render` will never be disposed");else if (Owner !== UNOWNED) {
    {
      if (!Owner.owned) Owner.owned = [c];else Owner.owned.push(c);
    }
  }
  return c;
}
function runTop(node) {
  let top = node.state === STALE && node,
      pending;
  if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
  while (node.fn && (node = node.owner)) {
    if (node.state === PENDING) pending = node;else if (node.state === STALE) {
      top = node;
      pending = undefined;
    }
  }
  if (pending) {
    const updates = Updates;
    Updates = null;
    lookDownstream(pending);
    Updates = updates;
    if (!top || top.state !== STALE) return;
  }
  top && updateComputation(top);
}
function runUpdates(fn, init) {
  if (Updates) return fn();
  let wait = false;
  if (!init) Updates = [];
  if (Effects) wait = true;else Effects = [];
  ExecCount++;
  try {
    fn();
  } catch (err) {
    handleError(err);
  } finally {
    if (Updates) {
      runQueue(Updates);
      Updates = null;
    }
    if (wait) return;
    if (Effects.length) batch(() => {
      runEffects(Effects);
      Effects = null;
    });else Effects = null;
  }
}
function runQueue(queue) {
  for (let i = 0; i < queue.length; i++) runTop(queue[i]);
}
function lookDownstream(node) {
  node.state = 0;
  for (let i = 0; i < node.sources.length; i += 1) {
    const source = node.sources[i];
    if (source.sources) {
      if (source.state === STALE) runTop(source);else if (source.state === PENDING) lookDownstream(source);
    }
  }
}
function markUpstream(node) {
  for (let i = 0; i < node.observers.length; i += 1) {
    const o = node.observers[i];
    if (!o.state) {
      o.state = PENDING;
      o.observers && markUpstream(o);
    }
  }
}
function cleanNode(node) {
  let i;
  if (node.sources) {
    while (node.sources.length) {
      const source = node.sources.pop(),
            index = node.sourceSlots.pop(),
            obs = source.observers;
      if (obs && obs.length) {
        const n = obs.pop(),
              s = source.observerSlots.pop();
        if (index < obs.length) {
          n.sourceSlots[s] = index;
          obs[index] = n;
          source.observerSlots[index] = s;
        }
      }
    }
  }
  if (node.owned) {
    for (i = 0; i < node.owned.length; i++) cleanNode(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (i = 0; i < node.cleanups.length; i++) node.cleanups[i]();
    node.cleanups = null;
  }
  node.state = 0;
  node.context = null;
}
function handleError(err) {
  throw err;
}
function lookup(owner, key) {
  return owner && (owner.context && owner.context[key] || owner.owner && lookup(owner.owner, key));
}
function resolveChildren(children) {
  if (typeof children === "function") return createMemo(() => resolveChildren(children()));
  if (Array.isArray(children)) {
    const results = [];
    for (let i = 0; i < children.length; i++) {
      let result = resolveChildren(children[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children;
}
function createProvider(id) {
  return function provider(props) {
    return createMemo(() => {
      Owner.context = {
        [id]: props.value
      };
      return resolveChildren(props.children);
    });
  };
}

const FALLBACK = Symbol("fallback");
function mapArray(list, mapFn, options = {}) {
  let items = [],
      mapped = [],
      disposers = [],
      len = 0,
      indexes = mapFn.length > 1 ? [] : null;
  onCleanup(() => {
    for (let i = 0, length = disposers.length; i < length; i++) disposers[i]();
  });
  return () => {
    let newItems = list() || [],
        i,
        j;
    return untrack(() => {
      let newLen = newItems.length,
          newIndices,
          newIndicesNext,
          temp,
          tempdisposers,
          tempIndexes,
          start,
          end,
          newEnd,
          item;
      if (newLen === 0) {
        if (len !== 0) {
          for (i = 0; i < len; i++) disposers[i]();
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
          indexes && (indexes = []);
        }
        if (options.fallback) {
          items = [FALLBACK];
          mapped[0] = createRoot(disposer => {
            disposers[0] = disposer;
            return options.fallback();
          });
          len = 1;
        }
      }
      else if (len === 0) {
          for (j = 0; j < newLen; j++) {
            items[j] = newItems[j];
            mapped[j] = createRoot(mapper);
          }
          len = newLen;
        } else {
          temp = new Array(newLen);
          tempdisposers = new Array(newLen);
          indexes && (tempIndexes = new Array(newLen));
          for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++);
          for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
            temp[newEnd] = mapped[end];
            tempdisposers[newEnd] = disposers[end];
            indexes && (tempIndexes[newEnd] = indexes[end]);
          }
          newIndices = new Map();
          newIndicesNext = new Array(newEnd + 1);
          for (j = newEnd; j >= start; j--) {
            item = newItems[j];
            i = newIndices.get(item);
            newIndicesNext[j] = i === undefined ? -1 : i;
            newIndices.set(item, j);
          }
          for (i = start; i <= end; i++) {
            item = items[i];
            j = newIndices.get(item);
            if (j !== undefined && j !== -1) {
              temp[j] = mapped[i];
              tempdisposers[j] = disposers[i];
              indexes && (tempIndexes[j] = indexes[i]);
              j = newIndicesNext[j];
              newIndices.set(item, j);
            } else disposers[i]();
          }
          for (j = start; j < newLen; j++) {
            if (j in temp) {
              mapped[j] = temp[j];
              disposers[j] = tempdisposers[j];
              if (indexes) {
                indexes[j] = tempIndexes[j];
                indexes[j](j);
              }
            } else mapped[j] = createRoot(mapper);
          }
          len = mapped.length = newLen;
          items = newItems.slice(0);
        }
      return mapped;
    });
    function mapper(disposer) {
      disposers[j] = disposer;
      if (indexes) {
        const [s, set] = createSignal(j, true);
        indexes[j] = set;
        return mapFn(newItems[j], s);
      }
      return mapFn(newItems[j]);
    }
  };
}

function createComponent(Comp, props) {
  return untrack(() => Comp(props));
}
function assignProps(target, ...sources) {
  for (let i = 0; i < sources.length; i++) {
    const descriptors = Object.getOwnPropertyDescriptors(sources[i]);
    Object.defineProperties(target, descriptors);
  }
  return target;
}
function splitProps(props, ...keys) {
  const descriptors = Object.getOwnPropertyDescriptors(props),
        split = k => {
    const clone = {};
    for (let i = 0; i < k.length; i++) {
      const key = k[i];
      if (descriptors[key]) {
        Object.defineProperty(clone, key, descriptors[key]);
        delete descriptors[key];
      }
    }
    return clone;
  };
  return keys.map(split).concat(split(Object.keys(descriptors)));
}
function lazy(fn) {
  return props => {
    const h = globalThis._$HYDRATION || {},
          hydrating = h.context && h.context.registry,
          ctx = nextHydrateContext(),
          [s, l] = createResource(undefined, {
      notStreamed: true
    });
    if (hydrating && h.resources) {
      fn().then(mod => l(() => mod.default));
    } else l(() => fn().then(mod => mod.default));
    let Comp;
    return createMemo(() => (Comp = s()) && untrack(() => {
      if (!ctx) return Comp(props);
      const c = h.context;
      setHydrateContext(ctx);
      const r = Comp(props);
      !c && setHydrateContext();
      return r;
    }));
  };
}
function setHydrateContext(context) {
  globalThis._$HYDRATION.context = context;
}
function nextHydrateContext() {
  const hydration = globalThis._$HYDRATION;
  return hydration && hydration.context ? {
    id: `${hydration.context.id}.${hydration.context.count++}`,
    count: 0,
    registry: hydration.context.registry
  } : undefined;
}

function For(props) {
  const fallback = "fallback" in props && {
    fallback: () => props.fallback
  };
  return createMemo(mapArray(() => props.each, props.children, fallback ? fallback : undefined));
}
function Show(props) {
  const childDesc = Object.getOwnPropertyDescriptor(props, "children").value,
        callFn = typeof childDesc === "function" && childDesc.length,
        condition = createMemo(callFn ? () => props.when : () => !!props.when, undefined, true);
  return createMemo(() => {
    const c = condition();
    return c ? callFn ? untrack(() => props.children(c)) : props.children : props.fallback;
  });
}

if (!globalThis.Solid$$) globalThis.Solid$$ = true;else console.warn("You appear to have multiple instances of Solid. This can lead to unexpected behavior.");

const Properties = new Set(["className", "autocapitalize", "autofocus", "allowfullscreen", "autoplay", "capture", "checked", "controls", "default", "disabled", "hidden", "indeterminate", "loop", "muted", "novalidate", "open", "readOnly", "required", "reversed", "scoped", "seamless", "selected", "value"]);
const ChildProperties = new Set(["innerHTML", "textContent", "innerText", "children"]);
const Aliases = {
  className: "class",
  htmlFor: "for"
};
const NonComposedEvents = new Set(["abort", "animationstart", "animationend", "animationiteration", "blur", "change", "copy", "cut", "error", "focus", "gotpointercapture", "load", "loadend", "loadstart", "lostpointercapture", "mouseenter", "mouseleave", "paste", "pointerenter", "pointerleave", "progress", "reset", "scroll", "select", "submit", "toggle", "transitionstart", "transitioncancel", "transitionend", "transitionrun"]);
const SVGNamespace = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
};

function memo(fn, equal) {
  return createMemo(fn, undefined, equal);
}

function reconcileArrays(parentNode, a, b) {
  let bLength = b.length,
      aEnd = a.length,
      bEnd = bLength,
      aStart = 0,
      bStart = 0,
      after = a[aEnd - 1].nextSibling,
      map = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (aEnd === aStart) {
      const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
      while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(a[aStart])) parentNode.removeChild(a[aStart]);
        aStart++;
      }
    } else if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
    } else if (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
      const node = a[--aEnd].nextSibling;
      parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
      parentNode.insertBefore(b[--bEnd], node);
      a[aEnd] = b[bEnd];
    } else {
      if (!map) {
        map = new Map();
        let i = bStart;
        while (i < bEnd) map.set(b[i], i++);
      }
      const index = map.get(a[aStart]);
      if (index != null) {
        if (bStart < index && index < bEnd) {
          let i = aStart,
              sequence = 1,
              t;
          while (++i < aEnd && i < bEnd) {
            if ((t = map.get(a[i])) == null || t !== index + sequence) break;
            sequence++;
          }
          if (sequence > index - bStart) {
            const node = a[aStart];
            while (bStart < index) parentNode.insertBefore(b[bStart++], node);
          } else parentNode.replaceChild(b[bStart++], a[aStart++]);
        } else aStart++;
      } else parentNode.removeChild(a[aStart++]);
    }
  }
}

const eventRegistry = new Set();
function render(code, element, init) {
  let disposer;
  createRoot(dispose => {
    disposer = dispose;
    insert(element, code(), element.firstChild ? null : undefined, init);
  });
  return () => {
    disposer();
    element.textContent = "";
  };
}
function template(html, check, isSVG) {
  const t = document.createElement("template");
  t.innerHTML = html;
  if (check && t.innerHTML.split("<").length - 1 !== check) throw `Template html does not match input:\n${t.innerHTML}\n\n${html}`;
  let node = t.content.firstChild;
  if (isSVG) node = node.firstChild;
  return node;
}
function delegateEvents(eventNames) {
  for (let i = 0, l = eventNames.length; i < l; i++) {
    const name = eventNames[i];
    if (!eventRegistry.has(name)) {
      eventRegistry.add(name);
      document.addEventListener(name, eventHandler);
    }
  }
}
function setAttribute(node, name, value) {
  if (value === false || value == null) node.removeAttribute(name);else node.setAttribute(name, value);
}
function setAttributeNS(node, namespace, name, value) {
  if (value === false || value == null) node.removeAttributeNS(namespace, name);else node.setAttributeNS(namespace, name, value);
}
function classList(node, value, prev) {
  const classKeys = Object.keys(value);
  for (let i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i],
          classValue = !!value[key],
          classNames = key.split(/\s+/);
    if (!key || prev && prev[key] === classValue) continue;
    for (let j = 0, nameLen = classNames.length; j < nameLen; j++) node.classList.toggle(classNames[j], classValue);
  }
  return value;
}
function style(node, value, prev) {
  const nodeStyle = node.style;
  if (typeof value === "string") return nodeStyle.cssText = value;
  let v, s;
  if (prev != null && typeof prev !== "string") {
    for (s in value) {
      v = value[s];
      v !== prev[s] && nodeStyle.setProperty(s, v);
    }
    for (s in prev) {
      value[s] == null && nodeStyle.removeProperty(s);
    }
  } else {
    for (s in value) nodeStyle.setProperty(s, value[s]);
  }
  return value;
}
function spread(node, accessor, isSVG, skipChildren) {
  if (typeof accessor === "function") {
    createRenderEffect(current => spreadExpression(node, accessor(), current, isSVG, skipChildren));
  } else spreadExpression(node, accessor, undefined, isSVG, skipChildren);
}
function insert(parent, accessor, marker, initial) {
  if (marker !== undefined && !initial) initial = [];
  if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
  createRenderEffect(current => insertExpression(parent, accessor(), current, marker), initial);
}
function assign(node, props, isSVG, skipChildren, prevProps = {}) {
  let isCE, isProp, isChildProp;
  for (const prop in props) {
    if (prop === "children") {
      if (!skipChildren) insertExpression(node, props.children);
      continue;
    }
    const value = props[prop];
    if (value === prevProps[prop]) continue;
    if (prop === "style") {
      style(node, value, prevProps[prop]);
    } else if (prop === "class" && !isSVG) {
      node.className = value;
    } else if (prop === "classList") {
      classList(node, value, prevProps[prop]);
    } else if (prop === "ref") {
      value(node);
    } else if (prop === "on") {
      for (const eventName in value) node.addEventListener(eventName, value[eventName]);
    } else if (prop === "onCapture") {
      for (const eventName in value) node.addEventListener(eventName, value[eventName], true);
    } else if (prop.slice(0, 2) === "on") {
      const lc = prop.toLowerCase();
      if (!NonComposedEvents.has(lc.slice(2))) {
        const name = lc.slice(2);
        if (Array.isArray(value)) {
          node[`__${name}`] = value[0];
          node[`__${name}Data`] = value[1];
        } else node[`__${name}`] = value;
        delegateEvents([name]);
      } else node[lc] = value;
    } else if ((isChildProp = ChildProperties.has(prop)) || !isSVG && (isProp = Properties.has(prop)) || (isCE = node.nodeName.includes("-"))) {
      if (isCE && !isProp && !isChildProp) node[toPropertyName(prop)] = value;else node[prop] = value;
    } else {
      const ns = isSVG && prop.indexOf(":") > -1 && SVGNamespace[prop.split(":")[0]];
      if (ns) setAttributeNS(node, ns, prop, value);else setAttribute(node, Aliases[prop] || prop, value);
    }
    prevProps[prop] = value;
  }
}
function dynamicProperty(props, key) {
  const src = props[key];
  Object.defineProperty(props, key, {
    get() {
      return src();
    },
    enumerable: true
  });
  return props;
}
function ssrClassList(value) {
  let classKeys = Object.keys(value),
      result = "";
  for (let i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i],
          classValue = !!value[key];
    if (!key || !classValue) continue;
    i && (result += " ");
    result += key;
  }
  return result;
}
function ssrStyle(value) {
  if (typeof value === "string") return value;
  let result = "";
  const k = Object.keys(value);
  for (let i = 0; i < k.length; i++) {
    const s = k[i];
    if (i) result += ";";
    result += `${s}:${escape(value[s], true)}`;
  }
  return result;
}
function ssrSpread(props) {
  return () => {
    if (typeof props === "function") props = props();
    const keys = Object.keys(props);
    let result = "";
    for (let i = 0; i < keys.length; i++) {
      const prop = keys[i];
      if (prop === "children") {
        console.warn(`SSR currently does not support spread children.`);
        continue;
      }
      const value = props[prop];
      if (prop === "style") {
        result += `style="${ssrStyle(value)}"`;
      } else if (prop === "classList") {
        result += `class="${ssrClassList(value)}"`;
      } else {
        result += `${Aliases[prop] || prop}="${escape(value, true)}"`;
      }
      if (i !== keys.length - 1) result += " ";
    }
    return result;
  };
}
function escape(s, attr) {
  if (typeof s !== "string") return s;
  const delim = attr ? '"' : "<";
  const escDelim = attr ? "&quot;" : "&lt;";
  let iDelim = s.indexOf(delim);
  let iAmp = s.indexOf("&");
  if (iDelim < 0 && iAmp < 0) return s;
  let left = 0,
      out = "";
  while (iDelim >= 0 && iAmp >= 0) {
    if (iDelim < iAmp) {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } else {
      if (left < iAmp) out += s.substring(left, iAmp);
      out += "&amp;";
      left = iAmp + 1;
      iAmp = s.indexOf("&", left);
    }
  }
  if (iDelim >= 0) {
    do {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } while (iDelim >= 0);
  } else while (iAmp >= 0) {
    if (left < iAmp) out += s.substring(left, iAmp);
    out += "&amp;";
    left = iAmp + 1;
    iAmp = s.indexOf("&", left);
  }
  return left < s.length ? out + s.substring(left) : out;
}
function toPropertyName(name) {
  return name.toLowerCase().replace(/-([a-z])/g, (_, w) => w.toUpperCase());
}
function eventHandler(e) {
  const key = `__${e.type}`;
  let node = e.composedPath && e.composedPath()[0] || e.target;
  if (e.target !== node) {
    Object.defineProperty(e, "target", {
      configurable: true,
      value: node
    });
  }
  Object.defineProperty(e, "currentTarget", {
    configurable: true,
    get() {
      return node;
    }
  });
  while (node !== null) {
    const handler = node[key];
    if (handler) {
      const data = node[`${key}Data`];
      data !== undefined ? handler(data, e) : handler(e);
      if (e.cancelBubble) return;
    }
    node = node.host && node.host !== node && node.host instanceof Node ? node.host : node.parentNode;
  }
}
function spreadExpression(node, props, prevProps = {}, isSVG, skipChildren) {
  if (!skipChildren && "children" in props) {
    createRenderEffect(() => prevProps.children = insertExpression(node, props.children, prevProps.children));
  }
  createRenderEffect(() => assign(node, props, isSVG, true, prevProps));
  return prevProps;
}
function insertExpression(parent, value, current, marker, unwrapArray) {
  while (typeof current === "function") current = current();
  if (value === current) return current;
  const t = typeof value,
        multi = marker !== undefined;
  parent = multi && current[0] && current[0].parentNode || parent;
  if (t === "string" || t === "number") {
    if (t === "number") value = value.toString();
    if (multi) {
      let node = current[0];
      if (node && node.nodeType === 3) {
        node.data = value;
      } else node = document.createTextNode(value);
      current = cleanChildren(parent, current, marker, node);
    } else {
      if (current !== "" && typeof current === "string") {
        current = parent.firstChild.data = value;
      } else current = parent.textContent = value;
    }
  } else if (value == null || t === "boolean") {
    current = cleanChildren(parent, current, marker);
  } else if (t === "function") {
    createRenderEffect(() => current = insertExpression(parent, value(), current, marker));
    return () => current;
  } else if (Array.isArray(value)) {
    const array = [];
    if (normalizeIncomingArray(array, value, unwrapArray)) {
      createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
      return () => current;
    }
    if (array.length === 0) {
      current = cleanChildren(parent, current, marker);
      if (multi) return current;
    } else {
      if (Array.isArray(current)) {
        if (current.length === 0) {
          appendNodes(parent, array, marker);
        } else reconcileArrays(parent, current, array);
      } else if (current == null || current === "") {
        appendNodes(parent, array);
      } else {
        reconcileArrays(parent, multi && current || [parent.firstChild], array);
      }
    }
    current = array;
  } else if (value instanceof Node) {
    if (Array.isArray(current)) {
      if (multi) return current = cleanChildren(parent, current, marker, value);
      cleanChildren(parent, current, null, value);
    } else if (current == null || current === "" || !parent.firstChild) {
      parent.appendChild(value);
    } else parent.replaceChild(value, parent.firstChild);
    current = value;
  } else console.warn(`Skipped inserting`, value);
  return current;
}
function normalizeIncomingArray(normalized, array, unwrap) {
  let dynamic = false;
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i],
        t;
    if (item instanceof Node) {
      normalized.push(item);
    } else if (item == null || item === true || item === false) ; else if (Array.isArray(item)) {
      dynamic = normalizeIncomingArray(normalized, item) || dynamic;
    } else if ((t = typeof item) === "string") {
      normalized.push(document.createTextNode(item));
    } else if (t === "function") {
      if (unwrap) {
        const idx = item();
        dynamic = normalizeIncomingArray(normalized, Array.isArray(idx) ? idx : [idx]) || dynamic;
      } else {
        normalized.push(item);
        dynamic = true;
      }
    } else normalized.push(document.createTextNode(item.toString()));
  }
  return dynamic;
}
function appendNodes(parent, array, marker) {
  for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
}
function cleanChildren(parent, current, marker, replacement) {
  if (marker === undefined) return parent.textContent = "";
  const node = replacement || document.createTextNode("");
  if (current.length) {
    let inserted = false;
    for (let i = current.length - 1; i >= 0; i--) {
      const el = current[i];
      if (node !== el) {
        const isParent = el.parentNode === parent;
        if (!inserted && !i) isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);else isParent && parent.removeChild(el);
      } else inserted = true;
    }
  } else parent.insertBefore(node, marker);
  return [node];
}
function ssr(t, ...nodes) {
  if (!nodes.length) return {
    t
  };
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (typeof n === "function") nodes[i] = memo(() => resolveSSRNode(n()));
  }
  return {
    t: () => {
      let result = "";
      for (let i = 0; i < t.length; i++) {
        result += t[i];
        const node = nodes[i];
        if (node !== undefined) result += resolveSSRNode(node);
      }
      return result;
    }
  };
}
function resolveSSRNode(node) {
  if (Array.isArray(node)) return node.map(resolveSSRNode).join("");
  const t = typeof node;
  if (node && t === "object") return resolveSSRNode(node.t);
  if (t === "function") return resolveSSRNode(node());
  return t === "string" ? node : JSON.stringify(node);
}
function Dynamic(props) {
  const [p, others] = splitProps(props, ["component"]);
  return createMemo(() => {
    const comp = p.component,
          t = typeof comp;
    if (comp) {
      if (t === "function") return untrack(() => comp(others));else if (t === "string") {
        let el;
        if (globalThis._$HYDRATION && globalThis._$HYDRATION.asyncSSR) {
          const [local, sOthers] = splitProps(others, ["children"]);
          el = ssr([`<${comp} `, ">", `</${comp}>`], ssrSpread(sOthers), local.children || "");
        } else {
          el = document.createElement(comp);
          spread(el, others);
        }
        return el;
      }
    }
  });
}

export { Dynamic as D, For as F, Show as S, createComponent as a, createSignal as b, createContext as c, createMemo as d, createComputed as e, delegateEvents as f, assignProps as g, dynamicProperty as h, insert as i, createRenderEffect as j, setAttribute as k, lazy as l, memo as m, classList as n, render as r, spread as s, template as t, useContext as u };
