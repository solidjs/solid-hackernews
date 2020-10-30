import { i as insert, a as createComponent, t as template, S as Show, j as createRenderEffect, k as setAttribute } from '../../index-dab64add.js';

const _tmpl$ = template(`<h1>User : </h1>`, 2),
      _tmpl$2 = template(`<li class="about"></li>`, 2),
      _tmpl$3 = template(`<ul class="meta"><li><span class="label">Created:</span> </li><li><span class="label">Karma:</span> </li></ul>`, 10),
      _tmpl$4 = template(`<p class="links"><a>submissions</a> | <a>comments</a></p>`, 6),
      _tmpl$5 = template(`<div class="user-view"></div>`, 2),
      _tmpl$6 = template(`<h1>User not found.</h1>`, 2);

function User(props) {
  return (() => {
    const _el$ = _tmpl$5.cloneNode(true);

    insert(_el$, createComponent(Show, {
      get when() {
        return props.user;
      },

      get children() {
        return createComponent(Show, {
          get when() {
            return !props.user.error;
          },

          get fallback() {
            return _tmpl$6.cloneNode(true);
          },

          get children() {
            return [(() => {
              const _el$2 = _tmpl$.cloneNode(true),
                    _el$3 = _el$2.firstChild;

              insert(_el$2, () => props.user.id, null);

              return _el$2;
            })(), (() => {
              const _el$4 = _tmpl$3.cloneNode(true),
                    _el$5 = _el$4.firstChild,
                    _el$6 = _el$5.firstChild,
                    _el$7 = _el$6.nextSibling,
                    _el$8 = _el$5.nextSibling,
                    _el$9 = _el$8.firstChild,
                    _el$10 = _el$9.nextSibling;

              insert(_el$5, () => props.user.created, null);

              insert(_el$8, () => props.user.karma, null);

              insert(_el$4, createComponent(Show, {
                get when() {
                  return props.user.about;
                },

                get children() {
                  return [(() => {
                    const _el$11 = _tmpl$2.cloneNode(true);

                    createRenderEffect(() => _el$11.innerHTML = props.user.about);

                    return _el$11;
                  })(), " "];
                }

              }), null);

              return _el$4;
            })(), (() => {
              const _el$12 = _tmpl$4.cloneNode(true),
                    _el$13 = _el$12.firstChild,
                    _el$14 = _el$13.nextSibling,
                    _el$16 = _el$14.nextSibling;

              createRenderEffect(_p$ => {
                const _v$ = `https://news.ycombinator.com/submitted?id=${props.user.id}`,
                      _v$2 = `https://news.ycombinator.com/threads?id=${props.user.id}`;
                _v$ !== _p$._v$ && setAttribute(_el$13, "href", _p$._v$ = _v$);
                _v$2 !== _p$._v$2 && setAttribute(_el$16, "href", _p$._v$2 = _v$2);
                return _p$;
              }, {
                _v$: undefined,
                _v$2: undefined
              });

              return _el$12;
            })()];
          }

        });
      }

    }));

    return _el$;
  })();
}

export default User;
