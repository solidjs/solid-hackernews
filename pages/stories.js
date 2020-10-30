import { t as template, i as insert, a as createComponent, j as createRenderEffect, S as Show, m as memo, k as setAttribute, F as For } from '../index-deff7418.js';
import { L as Link } from '../solid-app-router-c06edea4.js';

const _tmpl$ = template(`<a target="_blank" rel="noreferer"></a>`, 2),
      _tmpl$2 = template(`<span class="host"> (<!---->)</span>`, 3),
      _tmpl$3 = template(`<span class="label"></span>`, 2),
      _tmpl$4 = template(`<li class="news-item"><span class="score"></span><span class="title"></span><br><span class="meta"></span></li>`, 9);
function Story(props) {
  return (() => {
    const _el$ = _tmpl$4.cloneNode(true),
          _el$2 = _el$.firstChild,
          _el$3 = _el$2.nextSibling,
          _el$9 = _el$3.nextSibling,
          _el$10 = _el$9.nextSibling;

    insert(_el$2, () => props.story.points);

    insert(_el$3, createComponent(Show, {
      get when() {
        return props.story.url;
      },

      get fallback() {
        return createComponent(Link, {
          get href() {
            return `item/${props.story.id}`;
          },

          get children() {
            return props.story.title;
          }

        });
      },

      get children() {
        return [(() => {
          const _el$4 = _tmpl$.cloneNode(true);

          insert(_el$4, () => props.story.title);

          createRenderEffect(() => setAttribute(_el$4, "href", props.story.url));

          return _el$4;
        })(), (() => {
          const _el$5 = _tmpl$2.cloneNode(true),
                _el$6 = _el$5.firstChild,
                _el$8 = _el$6.nextSibling,
                _el$7 = _el$8.nextSibling;

          insert(_el$5, () => props.story.domain, _el$8);

          return _el$5;
        })()];
      }

    }));

    insert(_el$10, createComponent(Show, {
      get when() {
        return props.story.type !== "job";
      },

      get fallback() {
        return createComponent(Link, {
          get href() {
            return `stories/${props.story.id}`;
          },

          get children() {
            return props.story.time_ago;
          }

        });
      },

      get children() {
        return ["by ", createComponent(Link, {
          get href() {
            return `users/${props.story.user}`;
          },

          get children() {
            return props.story.user;
          }

        }), " ", memo(() => props.story.time_ago), " |", " ", createComponent(Link, {
          get href() {
            return `stories/${props.story.id}`;
          },

          get children() {
            return props.story.comments_count ? `${props.story.comments_count} comments` : "discuss";
          }

        })];
      }

    }));

    insert(_el$, createComponent(Show, {
      get when() {
        return props.story.type !== "link";
      },

      get children() {
        return [" ", (() => {
          const _el$11 = _tmpl$3.cloneNode(true);

          insert(_el$11, () => props.story.type);

          return _el$11;
        })()];
      }

    }), null);

    return _el$;
  })();
}

const _tmpl$$1 = template(`<ul></ul>`, 2),
      _tmpl$2$1 = template(`<div class="news-view"><div class="news-list-nav"><span>page </span></div><div class="news-list"></div></div>`, 8),
      _tmpl$3$1 = template(`<a class="disabled">&lt; prev</a>`, 2),
      _tmpl$4$1 = template(`<a class="disabled">more &gt;</a>`, 2);
function Stories(props) {
  return (() => {
    const _el$ = _tmpl$2$1.cloneNode(true),
          _el$2 = _el$.firstChild,
          _el$3 = _el$2.firstChild,
          _el$4 = _el$3.firstChild,
          _el$5 = _el$2.nextSibling;

    insert(_el$2, createComponent(Show, {
      get when() {
        return props.page > 1;
      },

      get fallback() {
        return _tmpl$3$1.cloneNode(true);
      },

      get children() {
        return createComponent(Link, {
          get href() {
            return `${props.type}?page=${props.page - 1}`;
          },

          get children() {
            return ["<", " prev"];
          }

        });
      }

    }), _el$3);

    insert(_el$3, () => props.page, null);

    insert(_el$2, createComponent(Show, {
      get when() {
        var _props$stories;

        return ((_props$stories = props.stories) === null || _props$stories === void 0 ? void 0 : _props$stories.length) === 30;
      },

      get fallback() {
        return _tmpl$4$1.cloneNode(true);
      },

      get children() {
        return createComponent(Link, {
          get href() {
            return `${props.type}?page=${props.page + 1}`;
          },

          get children() {
            return ["more ", ">"];
          }

        });
      }

    }), null);

    insert(_el$5, createComponent(Show, {
      get when() {
        return props.stories;
      },

      get children() {
        const _el$6 = _tmpl$$1.cloneNode(true);

        insert(_el$6, createComponent(For, {
          get each() {
            return props.stories;
          },

          children: story => createComponent(Story, {
            story: story
          })
        }));

        return _el$6;
      }

    }));

    return _el$;
  })();
}

export default Stories;
