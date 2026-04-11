import { ai as attributes, j as clsx, k as derived } from "./index.js";
function Button($$renderer, $$props) {
  let {
    variant = "default",
    size = "default",
    href,
    class: className = "",
    children,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const variantClasses = {
    default:
      "bg-[rgb(var(--accent))] text-white shadow-sm hover:bg-[rgb(var(--accent))]/90",
    destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
    outline: "border bg-white shadow-sm hover:bg-slate-50",
    secondary: "bg-slate-100 text-slate-700 shadow-sm hover:bg-slate-200/70",
    ghost: "hover:bg-slate-100",
    link: "text-[rgb(var(--accent))] underline-offset-4 hover:underline",
  };
  const sizeClasses = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-lg px-3 text-xs",
    lg: "h-10 rounded-lg px-8",
    icon: "h-9 w-9",
  };
  let classes = derived(
    () =>
      `inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-[background-color,color,transform,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))]/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`,
  );
  if (href) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(
      `<a${attributes({ href, class: clsx(classes()), ...rest })}>`,
    );
    children($$renderer);
    $$renderer.push(`<!----></a>`);
  } else {
    $$renderer.push("<!--[-1-->");
    $$renderer.push(
      `<button${attributes({ class: clsx(classes()), ...rest })}>`,
    );
    children($$renderer);
    $$renderer.push(`<!----></button>`);
  }
  $$renderer.push(`<!--]-->`);
}
export { Button as B };
