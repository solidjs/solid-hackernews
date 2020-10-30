import { t as template, f as delegateEvents, b as createSignal, i as insert, a as createComponent, m as memo, j as createRenderEffect, S as Show, F as For, n as classList, k as setAttribute } from '../../index-dab64add.js';
import { L as Link } from '../../solid-app-router-6ab26aeb.js';

const _tmpl$ = template(`<div class="toggle"><a></a></div>`, 4),
      _tmpl$2 = template(`<ul class="comment-children"></ul>`, 2),
      _tmpl$3 = template(`<li class="comment"><div class="by"> <!----> ago</div><div class="text"></div></li>`, 7);

const pluralize = n => n + (n === 1 ? " reply" : " replies");

function Comment(props) {
  const [open, setOpen] = createSignal(true);
  return (() => {
    const _el$ = _tmpl$3.cloneNode(true),
          _el$2 = _el$.firstChild,
          _el$3 = _el$2.firstChild,
          _el$5 = _el$3.nextSibling,
          _el$4 = _el$5.nextSibling,
          _el$6 = _el$2.nextSibling;

    insert(_el$2, createComponent(Link, {
      get href() {
        return `/users/${props.comment.user}`;
      },

      get children() {
        return props.comment.user;
      }

    }), _el$3);

    insert(_el$2, () => props.comment.time_ago, _el$5);

    insert(_el$, createComponent(Show, {
      get when() {
        return props.comment.comments.length;
      },

      get children() {
        return [(() => {
          const _el$7 = _tmpl$.cloneNode(true),
                _el$8 = _el$7.firstChild;

          _el$8.__click = () => setOpen(!open());

          insert(_el$8, (() => {
            const _c$ = memo(() => !!open(), true);

            return () => _c$() ? "[-]" : "[+] " + pluralize(props.comment.comments.length) + " collapsed";
          })());

          createRenderEffect(_$p => classList(_el$7, {
            open: open()
          }, _$p));

          return _el$7;
        })(), createComponent(Show, {
          get when() {
            return open();
          },

          get children() {
            const _el$9 = _tmpl$2.cloneNode(true);

            insert(_el$9, createComponent(For, {
              get each() {
                return props.comment.comments;
              },

              children: comment => createComponent(Comment, {
                comment: comment
              })
            }));

            return _el$9;
          }

        })];
      }

    }), null);

    createRenderEffect(() => _el$6.innerHTML = props.comment.content);

    return _el$;
  })();
}

delegateEvents(["click"]);

const _tmpl$$1 = template(`<div class="item-view"><div class="item-view-header"><a target="_blank"><h1></h1></a><span v-if="item.url" class="host">(<!---->)</span><p class="meta"> points | by <!----> <!----> ago</p></div><div class="item-view-comments"><p class="item-view-comments-header"></p><ul class="comment-children"></ul></div></div>`, 21);
function Story(props) {
  return createComponent(Show, {
    get when() {
      return props.story;
    },

    get children() {
      const _el$ = _tmpl$$1.cloneNode(true),
            _el$2 = _el$.firstChild,
            _el$3 = _el$2.firstChild,
            _el$4 = _el$3.firstChild,
            _el$5 = _el$3.nextSibling,
            _el$6 = _el$5.firstChild,
            _el$8 = _el$6.nextSibling,
            _el$7 = _el$8.nextSibling,
            _el$9 = _el$5.nextSibling,
            _el$10 = _el$9.firstChild,
            _el$14 = _el$10.nextSibling,
            _el$12 = _el$14.nextSibling,
            _el$15 = _el$12.nextSibling,
            _el$13 = _el$15.nextSibling,
            _el$16 = _el$2.nextSibling,
            _el$17 = _el$16.firstChild,
            _el$18 = _el$17.nextSibling;

      insert(_el$4, () => props.story.title);

      insert(_el$5, () => props.story.domain, _el$8);

      insert(_el$9, () => props.story.points, _el$10);

      insert(_el$9, createComponent(Link, {
        get href() {
          return `users/${props.story.user}`;
        },

        get children() {
          return props.story.user;
        }

      }), _el$14);

      insert(_el$9, () => props.story.time_ago, _el$15);

      insert(_el$17, () => props.story.comments_count ? props.story.comments_count + " comments" : "No comments yet.");

      insert(_el$18, createComponent(For, {
        get each() {
          return props.story.comments;
        },

        children: comment => createComponent(Comment, {
          comment: comment
        })
      }));

      createRenderEffect(() => setAttribute(_el$3, "href", props.story.url));

      return _el$;
    }

  });
}

export default Story;
