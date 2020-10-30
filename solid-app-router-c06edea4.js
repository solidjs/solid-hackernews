import { t as template, f as delegateEvents, u as useContext, s as spread, d as createMemo, a as createComponent, D as Dynamic, g as assignProps, h as dynamicProperty, b as createSignal, l as lazy, c as createContext } from './index-deff7418.js';

// Normalizes percent-encoded values in `path` to upper-case and decodes percent-encoded
// values that are not reserved (i.e., unicode characters, emoji, etc). The reserved
// chars are "/" and "%".
// Safe to call multiple times on the same path.
function normalizePath(path) {
  return path.split("/").map(normalizeSegment).join("/");
} // We want to ensure the characters "%" and "/" remain in percent-encoded
// form when normalizing paths, so replace them with their encoded form after
// decoding the rest of the path

const SEGMENT_RESERVED_CHARS = /%|\//g;
function normalizeSegment(segment) {
  if (segment.length < 3 || segment.indexOf("%") === -1) return segment;
  return decodeURIComponent(segment).replace(SEGMENT_RESERVED_CHARS, encodeURIComponent);
} // We do not want to encode these characters when generating dynamic path segments
// See https://tools.ietf.org/html/rfc3986#section-3.3
// sub-delims: "!", "$", "&", "'", "(", ")", "*", "+", ",", ";", "="
// others allowed by RFC 3986: ":", "@"
//
// First encode the entire path segment, then decode any of the encoded special chars.
//
// The chars "!", "'", "(", ")", "*" do not get changed by `encodeURIComponent`,
// so the possible encoded chars are:
// ['%24', '%26', '%2B', '%2C', '%3B', '%3D', '%3A', '%40'].

const PATH_SEGMENT_ENCODINGS = /%(?:2(?:4|6|B|C)|3(?:B|D|A)|40)/g;
function encodePathSegment(str) {
  return encodeURIComponent(str).replace(PATH_SEGMENT_ENCODINGS, decodeURIComponent);
}

var CHARS;

(function (CHARS) {
  CHARS[CHARS["ANY"] = -1] = "ANY";
  CHARS[CHARS["STAR"] = 42] = "STAR";
  CHARS[CHARS["SLASH"] = 47] = "SLASH";
  CHARS[CHARS["COLON"] = 58] = "COLON";
})(CHARS || (CHARS = {}));

const escapeRegex = /(\/|\.|\*|\+|\?|\||\(|\)|\[|\]|\{|\}|\\)/g;
const isArray = Array.isArray; // eslint-disable-next-line @typescript-eslint/unbound-method

const hasOwnProperty = Object.prototype.hasOwnProperty;

function getParam(params, key) {
  if (typeof params !== "object" || params === null) {
    throw new Error("You must pass an object as the second argument to `generate`.");
  }

  if (!hasOwnProperty.call(params, key)) {
    throw new Error("You must provide param `" + key + "` to `generate`.");
  }

  const value = params[key];
  const str = typeof value === "string" ? value : "" + value;

  if (str.length === 0) {
    throw new Error("You must provide a param `" + key + "`.");
  }

  return str;
}

var SegmentType;

(function (SegmentType) {
  SegmentType[SegmentType["Static"] = 0] = "Static";
  SegmentType[SegmentType["Dynamic"] = 1] = "Dynamic";
  SegmentType[SegmentType["Star"] = 2] = "Star";
  SegmentType[SegmentType["Epsilon"] = 4] = "Epsilon";
})(SegmentType || (SegmentType = {}));

var SegmentFlags;

(function (SegmentFlags) {
  SegmentFlags[SegmentFlags["Static"] = SegmentType.Static] = "Static";
  SegmentFlags[SegmentFlags["Dynamic"] = SegmentType.Dynamic] = "Dynamic";
  SegmentFlags[SegmentFlags["Star"] = SegmentType.Star] = "Star";
  SegmentFlags[SegmentFlags["Epsilon"] = SegmentType.Epsilon] = "Epsilon";
  SegmentFlags[SegmentFlags["Named"] = SegmentType.Dynamic | SegmentType.Star] = "Named";
  SegmentFlags[SegmentFlags["Decoded"] = SegmentType.Dynamic] = "Decoded";
  SegmentFlags[SegmentFlags["Counted"] = SegmentType.Static | SegmentType.Dynamic | SegmentType.Star] = "Counted";
})(SegmentFlags || (SegmentFlags = {}));

const eachChar = [];

eachChar[SegmentType.Static] = function (segment, currentState) {
  let state = currentState;
  const value = segment.value;

  for (let i = 0; i < value.length; i++) {
    const ch = value.charCodeAt(i);
    state = state.put(ch, false, false);
  }

  return state;
};

eachChar[SegmentType.Dynamic] = function (_, currentState) {
  return currentState.put(CHARS.SLASH, true, true);
};

eachChar[SegmentType.Star] = function (_, currentState) {
  return currentState.put(CHARS.ANY, false, true);
};

eachChar[SegmentType.Epsilon] = function (_, currentState) {
  return currentState;
};

const regex = [];

regex[SegmentType.Static] = function (segment) {
  return segment.value.replace(escapeRegex, "\\$1");
};

regex[SegmentType.Dynamic] = function () {
  return "([^/]+)";
};

regex[SegmentType.Star] = function () {
  return "(.+)";
};

regex[SegmentType.Epsilon] = function () {
  return "";
};

const generate = [];

generate[SegmentType.Static] = function (segment) {
  return segment.value;
};

generate[SegmentType.Dynamic] = function (segment, params, shouldEncode) {
  const value = getParam(params, segment.value);

  if (shouldEncode) {
    return encodePathSegment(value);
  } else {
    return value;
  }
};

generate[SegmentType.Star] = function (segment, params) {
  return getParam(params, segment.value);
};

generate[SegmentType.Epsilon] = function () {
  return "";
}; // A Segment represents a segment in the original route description.
// Each Segment type provides an `eachChar` and `regex` method.
//
// The `eachChar` method invokes the callback with one or more character
// specifications. A character specification consumes one or more input
// characters.
//
// The `regex` method returns a regex fragment for the segment. If the
// segment is a dynamic of star segment, the regex fragment also includes
// a capture.
//
// A character specification contains:
//
// * `validChars`: a String with a list of all valid characters, or
// * `invalidChars`: a String with a list of all invalid characters
// * `repeat`: true if the character specification can repeat


const EmptyObject = Object.freeze({});
const EmptyArray = Object.freeze([]);

// The `names` will be populated with the paramter name for each dynamic/star
// segment. `shouldDecodes` will be populated with a boolean for each dyanamic/star
// segment, indicating whether it should be decoded during recognition.
function parse(segments, route, types) {
  // normalize route as not starting with a "/". Recognition will
  // also normalize.
  if (route.length > 0 && route.charCodeAt(0) === CHARS.SLASH) {
    route = route.substr(1);
  }

  const parts = route.split("/");
  let names = undefined;
  let shouldDecodes = undefined;

  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
    let type = 0;

    if (part === "") {
      type = SegmentType.Epsilon;
    } else if (part.charCodeAt(0) === CHARS.COLON) {
      type = SegmentType.Dynamic;
    } else if (part.charCodeAt(0) === CHARS.STAR) {
      type = SegmentType.Star;
    } else {
      type = SegmentType.Static;
    }

    if (type & SegmentFlags.Named) {
      part = part.slice(1);
      names = names || [];
      names.push(part);
      shouldDecodes = shouldDecodes || [];
      shouldDecodes.push((type & SegmentFlags.Decoded) !== 0);
    }

    if (type & SegmentFlags.Counted) {
      types[type]++;
    }

    segments.push({
      type,
      value: normalizeSegment(part)
    });
  }

  return {
    names: names || EmptyArray,
    shouldDecodes: shouldDecodes || EmptyArray
  };
}

function isEqualCharSpec(spec, char, negate) {
  return spec.char === char && spec.negate === negate;
}

// A State has a character specification and (`charSpec`) and a list of possible
// subsequent states (`nextStates`).
//
// If a State is an accepting state, it will also have several additional
// properties:
//
// * `regex`: A regular expression that is used to extract parameters from paths
//   that reached this accepting state.
// * `handlers`: Information on how to convert the list of captures into calls
//   to registered handlers with the specified parameters
// * `types`: How many static, dynamic or star segments in this route. Used to
//   decide which route to use if multiple registered routes match a path.
//
// Currently, State is implemented naively by looping over `nextStates` and
// comparing a character specification against a character. A more efficient
// implementation would use a hash of keys pointing at one or more next states.
class State {
  constructor(states, id, char, negate, repeat) {
    this.states = states;
    this.id = id;
    this.char = char;
    this.negate = negate;
    this.nextStates = repeat ? id : null;
    this.pattern = "";
    this._regex = undefined;
    this.handlers = undefined;
    this.types = undefined;
  }

  regex() {
    if (!this._regex) {
      this._regex = new RegExp(this.pattern);
    }

    return this._regex;
  }

  get(char, negate) {
    const nextStates = this.nextStates;
    if (nextStates === null) return;

    if (isArray(nextStates)) {
      for (let i = 0; i < nextStates.length; i++) {
        const child = this.states[nextStates[i]];

        if (isEqualCharSpec(child, char, negate)) {
          return child;
        }
      }
    } else {
      const child = this.states[nextStates];

      if (isEqualCharSpec(child, char, negate)) {
        return child;
      }
    }
  }

  put(char, negate, repeat) {
    let state; // If the character specification already exists in a child of the current
    // state, just return that state.

    if (state = this.get(char, negate)) {
      return state;
    } // Make a new state for the character spec


    const states = this.states;
    state = new State(states, states.length, char, negate, repeat);
    states[states.length] = state; // Insert the new state as a child of the current state

    if (this.nextStates == null) {
      this.nextStates = state.id;
    } else if (isArray(this.nextStates)) {
      this.nextStates.push(state.id);
    } else {
      this.nextStates = [this.nextStates, state.id];
    } // Return the new state


    return state;
  } // Find a list of child states matching the next character


  match(ch) {
    const nextStates = this.nextStates;
    if (!nextStates) return [];
    const returned = [];

    if (isArray(nextStates)) {
      for (let i = 0; i < nextStates.length; i++) {
        const child = this.states[nextStates[i]];

        if (isMatch(child, ch)) {
          returned.push(child);
        }
      }
    } else {
      const child = this.states[nextStates];

      if (isMatch(child, ch)) {
        returned.push(child);
      }
    }

    return returned;
  }

}

function isMatch(spec, char) {
  return spec.negate ? spec.char !== char && spec.char !== CHARS.ANY : spec.char === char || spec.char === CHARS.ANY;
} // This is a somewhat naive strategy, but should work in a lot of cases
// A better strategy would properly resolve /posts/:id/new and /posts/edit/:id.
//
// This strategy generally prefers more static and less dynamic matching.
// Specifically, it
//
//  * prefers fewer stars to more, then
//  * prefers using stars for less of the match to more, then
//  * prefers fewer dynamic segments to more, then
//  * prefers more static segments to more


function sortSolutions(states) {
  return states.sort(function (a, b) {
    const [astatics, adynamics, astars] = a.types || [0, 0, 0];
    const [bstatics, bdynamics, bstars] = b.types || [0, 0, 0];

    if (astars !== bstars) {
      return astars - bstars;
    }

    if (astars) {
      if (astatics !== bstatics) {
        return bstatics - astatics;
      }

      if (adynamics !== bdynamics) {
        return bdynamics - adynamics;
      }
    }

    if (adynamics !== bdynamics) {
      return adynamics - bdynamics;
    }

    if (astatics !== bstatics) {
      return bstatics - astatics;
    }

    return 0;
  });
}

function recognizeChar(states, ch) {
  let nextStates = [];

  for (let i = 0, l = states.length; i < l; i++) {
    const state = states[i];
    nextStates = nextStates.concat(state.match(ch));
  }

  return nextStates;
}

function createResults(queryParams) {
  const results = [];
  results.queryParams = queryParams || {};
  return results;
}

function findHandler(state, originalPath, queryParams, shouldDecode) {
  const handlers = state.handlers;
  const regex = state.regex();
  if (!regex || !handlers) throw new Error("state not initialized");
  const captures = regex.exec(originalPath);
  let currentCapture = 1;
  const result = createResults(queryParams);
  result.length = handlers.length;

  for (let i = 0; i < handlers.length; i++) {
    const handler = handlers[i];
    const names = handler.names;
    const shouldDecodes = handler.shouldDecodes;
    let params = EmptyObject;
    let isDynamic = false;

    if (names !== EmptyArray && shouldDecodes !== EmptyArray) {
      for (let j = 0; j < names.length; j++) {
        isDynamic = true;
        const name = names[j];
        const capture = captures && captures[currentCapture++];

        if (params === EmptyObject) {
          params = {};
        }

        if (shouldDecode && shouldDecodes[j]) {
          params[name] = capture && decodeURIComponent(capture);
        } else {
          params[name] = capture;
        }
      }
    }

    result[i] = {
      handler: handler.handler,
      params,
      isDynamic
    };
  }

  return result;
}

function decodeQueryParamPart(part) {
  // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
  part = part.replace(/\+/gm, "%20");
  let result;

  try {
    result = decodeURIComponent(part);
  } catch (error) {
    result = "";
  }

  return result;
}

class RouteRecognizer {
  constructor() {
    const states = [];
    const state = new State(states, 0, CHARS.ANY, true, false);
    states[0] = state;
    this.rootState = state;
  }

  static ENCODE_AND_DECODE_PATH_SEGMENTS = true;
  static Normalizer = {
    normalizeSegment,
    normalizePath,
    encodePathSegment
  };

  add(routes, options) {
    let currentState = this.rootState;
    let pattern = "^";
    const types = [0, 0, 0];
    const handlers = new Array(routes.length);
    const allSegments = [];
    let isEmpty = true;
    let j = 0;

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const {
        names,
        shouldDecodes
      } = parse(allSegments, route.path, types); // preserve j so it points to the start of newly added segments

      for (; j < allSegments.length; j++) {
        const segment = allSegments[j];

        if (segment.type === SegmentType.Epsilon) {
          continue;
        }

        isEmpty = false; // Add a "/" for the new segment

        currentState = currentState.put(CHARS.SLASH, false, false);
        pattern += "/"; // Add a representation of the segment to the NFA and regex

        currentState = eachChar[segment.type](segment, currentState);
        pattern += regex[segment.type](segment);
      }

      handlers[i] = {
        handler: route.handler,
        names,
        shouldDecodes
      };
    }

    if (isEmpty) {
      currentState = currentState.put(CHARS.SLASH, false, false);
      pattern += "/";
    }

    currentState.handlers = handlers;
    currentState.pattern = pattern + "$";
    currentState.types = types;
  }

  recognize(path) {
    const shouldNormalize = RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS;
    let results;
    let states = [this.rootState];
    let queryParams = {};
    let isSlashDropped = false;
    const hashStart = path.indexOf("#");

    if (hashStart !== -1) {
      path = path.substr(0, hashStart);
    }

    const queryStart = path.indexOf("?");

    if (queryStart !== -1) {
      const queryString = path.substr(queryStart + 1, path.length);
      path = path.substr(0, queryStart);
      queryParams = parseQueryString(queryString);
    }

    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    let originalPath = path;

    if (shouldNormalize) {
      path = normalizePath(path);
    } else {
      path = decodeURI(path);
      originalPath = decodeURI(originalPath);
    }

    const pathLen = path.length;

    if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
      path = path.substr(0, pathLen - 1);
      originalPath = originalPath.substr(0, originalPath.length - 1);
      isSlashDropped = true;
    }

    for (let i = 0; i < path.length; i++) {
      states = recognizeChar(states, path.charCodeAt(i));

      if (!states.length) {
        break;
      }
    }

    const solutions = [];

    for (let i = 0; i < states.length; i++) {
      if (states[i].handlers) {
        solutions.push(states[i]);
      }
    }

    states = sortSolutions(solutions);
    const state = solutions[0];

    if (state && state.handlers) {
      // if a trailing slash was dropped and a star segment is the last segment
      // specified, put the trailing slash back
      if (isSlashDropped && state.char === CHARS.ANY) {
        originalPath = originalPath + "/";
      }

      results = findHandler(state, originalPath, queryParams, shouldNormalize);
    }

    return results;
  }

}
function parseQueryString(queryString) {
  const pairs = queryString.split("&");
  const queryParams = {};

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split("=");
    let key = decodeQueryParamPart(pair[0]);
    const keyLength = key.length;
    let isArray = false;
    let value;

    if (pair.length === 1) {
      value = "true";
    } else {
      // Handle arrays
      if (keyLength > 2 && key.endsWith("[]")) {
        isArray = true;
        key = key.slice(0, keyLength - 2);

        if (!queryParams[key]) {
          queryParams[key] = [];
        }
      }

      value = pair[1] ? decodeQueryParamPart(pair[1]) : "";
    }

    if (isArray) {
      queryParams[key].push(value);
    } else {
      queryParams[key] = value;
    }
  }

  return queryParams;
}

const _tmpl$ = template(`<a></a>`, 2);
const RouterContext = createContext();
function useRouter() {
  return useContext(RouterContext);
}
function Route(props) {
  const {
    router,
    level
  } = useRouter(),
        resolved = createMemo(prev => {
    const resolved = router.current;
    let result = {
      component: undefined,
      data: undefined,
      params: undefined,
      query: undefined,
      handler: resolved
    };

    if (resolved && resolved[level]) {
      result.component = resolved[level].handler.component;
      result.params = resolved[level].params;
      result.query = resolved.queryParams;
      if ((!prev || prev.handler !== resolved) && resolved[level].handler.data) result.data = resolved[level].handler.data({
        params: result.params,
        query: result.query
      });
    }

    return result;
  }, undefined, true);
  return createComponent(RouterContext.Provider, {
    value: {
      level: level + 1,
      router
    },

    get children() {
      return createComponent(Dynamic, assignProps({
        get component() {
          return resolved().component;
        },

        get params() {
          return resolved().params;
        },

        get query() {
          return resolved().query;
        }

      }, Object.keys(resolved().data || {}).reduce((m$, k$) => (m$[k$] = () => (resolved().data || {})[k$], dynamicProperty(m$, k$)), {}), Object.keys(props).reduce((m$, k$) => (m$[k$] = () => props[k$], dynamicProperty(m$, k$)), {}), {}));
    }

  });
}
const Link = props => {
  const {
    router
  } = useRouter();
  return (() => {
    const _el$ = _tmpl$.cloneNode(true);

    _el$.__click = e => {
      e.preventDefault();
      router.push(props.href || "");
    };

    spread(_el$, props, false, false);

    return _el$;
  })();
};
const Router = props => {
  const router = createRouter(props.routes, props.initialURL, props.root);
  return createComponent(RouterContext.Provider, {
    value: {
      level: 0,
      router
    },

    get children() {
      return props.children;
    }

  });
};

function createRouter(routes, initialURL, root = "") {
  const recognizer = new RouteRecognizer();
  processRoutes(recognizer, routes, root);
  const [location, setLocation] = createSignal(initialURL ? initialURL : window.location.pathname.replace(root, "") + window.location.search);
  const current = createMemo(() => recognizer.recognize(root + location()));
  globalThis.window && (window.onpopstate = () => setLocation(window.location.pathname.replace(root, "")));
  return {
    root,

    get location() {
      return location();
    },

    get current() {
      return current();
    },

    push(path) {
      window.history.pushState("", "", root + path);
      setLocation(path);
    },

    addRoutes(routes) {
      processRoutes(recognizer, routes, root);
    }

  };
}

function processRoutes(router, routes, root, parentRoutes = []) {
  routes.forEach(r => {
    const mapped = {
      path: root + r.path,
      handler: {
        component: typeof r.component === "string" ? lazy(() => import(root + r.component)) : r.component,
        data: r.data
      }
    };
    if (!r.children) return router.add([...parentRoutes, mapped]);
    processRoutes(router, r.children, root, [...parentRoutes, mapped]);
  });
}

delegateEvents(["click"]);

export { Link as L, Route as R, Router as a, useRouter as u };
