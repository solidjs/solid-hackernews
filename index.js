import { u as useContext, c as createContext, a as createComponent, t as template, i as insert, b as createSignal, d as createMemo, e as createComputed, r as render } from './index-deff7418.js';
import { L as Link, u as useRouter, R as Route, a as Router } from './solid-app-router-3524d460.js';

const APIContext = createContext();
function APIProvider(props) {
  return createComponent(APIContext.Provider, {
    get value() {
      return createAPI();
    },

    get children() {
      return props.children;
    }

  });
}
function useAPI() {
  return useContext(APIContext);
}
const mapStories = {
  top: "news",
  new: "newest",
  show: "show",
  ask: "ask",
  job: "jobs"
};

function createAPI() {
  const cache = {};

  const get = path => cache[path] || (cache[path] = fetch(`https://node-hnapi.herokuapp.com/${path}`).then(r => r.json()));

  return {
    getItem: id => get(`item/${id}`),
    getUser: id => get(`user/${id}`),
    getStories: (type, page) => get(`${mapStories[type]}?page=${page}`)
  };
}

const _tmpl$ = template(`<b>HN</b>`, 2),
      _tmpl$2 = template(`<b>New</b>`, 2),
      _tmpl$3 = template(`<b>Show</b>`, 2),
      _tmpl$4 = template(`<b>Ask</b>`, 2),
      _tmpl$5 = template(`<b>Jobs</b>`, 2),
      _tmpl$6 = template(`<header class="header"><nav class="inner"><a class="github" href="http://github.com/ryansolid/solid" target="_blank" rel="noreferrer">Built with Solid</a></nav></header>`, 6);
function Nav() {
  return (() => {
    const _el$ = _tmpl$6.cloneNode(true),
          _el$2 = _el$.firstChild,
          _el$8 = _el$2.firstChild;

    insert(_el$2, createComponent(Link, {
      href: "",

      get children() {
        return _tmpl$.cloneNode(true);
      }

    }), _el$8);

    insert(_el$2, createComponent(Link, {
      href: "new",

      get children() {
        return _tmpl$2.cloneNode(true);
      }

    }), _el$8);

    insert(_el$2, createComponent(Link, {
      href: "show",

      get children() {
        return _tmpl$3.cloneNode(true);
      }

    }), _el$8);

    insert(_el$2, createComponent(Link, {
      href: "ask",

      get children() {
        return _tmpl$4.cloneNode(true);
      }

    }), _el$8);

    insert(_el$2, createComponent(Link, {
      href: "job",

      get children() {
        return _tmpl$5.cloneNode(true);
      }

    }), _el$8);

    return _el$;
  })();
}

const TYPES = ["new", "show", "ask", "job"];

function getType() {
  const {
    router
  } = useRouter();
  return createMemo(() => {
    const loc = router.location;

    for (let i = 0; i < TYPES.length; i++) {
      if (loc.includes(TYPES[i])) return TYPES[i];
    }

    return "top";
  });
}

function StoriesData(props) {
  const [stories, setStories] = createSignal(),
        {
    getStories
  } = useAPI(),
        page = () => {
    var _props$query;

    return +(((_props$query = props.query) === null || _props$query === void 0 ? void 0 : _props$query.page) || 1);
  },
        type = getType();

  createComputed(() => getStories(type(), page()).then(setStories));
  return {
    get type() {
      return type();
    },

    get stories() {
      return stories();
    },

    get page() {
      return page();
    }

  };
}

function StoryData(props) {
  const [story, setStory] = createSignal(),
        {
    getItem
  } = useAPI();
  createComputed(() => getItem(props.params.id).then(setStory));
  return {
    get story() {
      return story();
    }

  };
}

function UserData(props) {
  const [user, setUser] = createSignal(),
        {
    getUser
  } = useAPI();
  createComputed(() => getUser(props.params.id).then(setUser));
  return {
    get user() {
      return user();
    }

  };
}

var routes = [{
  path: "",
  component: "pages/stories.js",
  data: StoriesData
}, {
  path: "new",
  component: "pages/stories.js",
  data: StoriesData
}, {
  path: "show",
  component: "pages/stories.js",
  data: StoriesData
}, {
  path: "ask",
  component: "pages/stories.js",
  data: StoriesData
}, {
  path: "job",
  component: "pages/stories.js",
  data: StoriesData
}, {
  path: "users/:id",
  component: "pages/users/[id].js",
  data: UserData
}, {
  path: "stories/:id",
  component: "pages/stories/[id].js",
  data: StoryData
}, {
  path: "*",
  component: "pages/stories.js",
  data: StoriesData
}];

render(() => createComponent(Router, {
  routes: routes,

  get root() {
    return "/solid-hackernews/";
  },

  get children() {
    return createComponent(APIProvider, {
      get children() {
        return [createComponent(Nav, {}), createComponent(Route, {
          "class": "view"
        })];
      }

    });
  }

}), document.body);
