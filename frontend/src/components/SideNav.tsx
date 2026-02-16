"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  name: string;
  href: string;
  badge?: string;
};

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/", badge: "Live" },
  { name: "Analytics", href: "/analytics" },
  { name: "Products", href: "/products" },
  { name: "Orders", href: "/orders" },
  { name: "Custom Order", href: "/sales" },
  { name: "Customers", href: "/customers" },
  { name: "Settings", href: "/settings" },
];

export default function SideNav() {
  const pathname = usePathname();
  const isItemActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="md:hidden sticky top-0 z-40 -mx-4 mb-4 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mb-2">
          <div className="text-sm font-semibold text-slate-900">E-Commerce</div>
          <div className="text-xs text-slate-500">Analytics Suite</div>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1">
          {NAV_ITEMS.map((item) => {
            const isActive = isItemActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch
                className={
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                  (isActive
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900")
                }
                aria-current={isActive ? "page" : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <aside className="sidebar hidden md:flex w-64 shrink-0 flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="mb-4 px-2">
          <div className="text-sm font-semibold text-slate-900">E-Commerce</div>
          <div className="text-xs text-slate-500">Analytics Suite</div>
        </div>
        <nav className="mt-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = isItemActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch
                className={
                  "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors " +
                  (isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100")
                }
                aria-current={isActive ? "page" : undefined}
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="text-[10px] rounded-md bg-emerald-100 px-2 py-0.5 text-emerald-700">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            Status:{" "}
            <span className="ml-1 inline-block h-2 w-2 rounded-full bg-emerald-500 align-middle" />{" "}
            Online
          </div>
        </div>
      </aside>
    </>
  );
}
