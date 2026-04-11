import { s as sanitize_props, a as spread_props, b as slot } from "./index.js";
import { I as Icon } from "./Icon.js";
function Calendar_plus($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M16 2v4" }],
    [
      "path",
      {
        d: "M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8",
      },
    ],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "M16 19h6" }],
    ["path", { d: "M19 16v6" }],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "calendar-plus" },
      $$sanitized_props,
      {
        /**
         * @component @name CalendarPlus
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOCAydjQiIC8+CiAgPHBhdGggZD0iTTE2IDJ2NCIgLz4KICA8cGF0aCBkPSJNMjEgMTNWNmEyIDIgMCAwIDAtMi0ySDVhMiAyIDAgMCAwLTIgMnYxNGEyIDIgMCAwIDAgMiAyaDgiIC8+CiAgPHBhdGggZD0iTTMgMTBoMTgiIC8+CiAgPHBhdGggZD0iTTE2IDE5aDYiIC8+CiAgPHBhdGggZD0iTTE5IDE2djYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/calendar-plus
         * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
         *
         * @param {Object} props - Lucide icons props and any valid SVG attribute
         * @returns {FunctionalComponent} Svelte component
         *
         */
        iconNode,
        children: ($$renderer2) => {
          $$renderer2.push(`<!--[-->`);
          slot($$renderer2, $$props, "default", {});
          $$renderer2.push(`<!--]-->`);
        },
        $$slots: { default: true },
      },
    ]),
  );
}
export { Calendar_plus as C };
