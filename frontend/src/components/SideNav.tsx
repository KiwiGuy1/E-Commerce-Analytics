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
  { name: "Customers", href: "/customers" },
  { name: "Settings", href: "/settings" },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="sidebar hidden md:flex w-60 shrink-0 flex-col rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur p-4 shadow-sm">
      <div className="mb-4 px-2">
        <div className="text-sm font-semibold text-slate-900">E‑Commerce</div>
        <div className="text-xs text-slate-500">Analytics Suite</div>
      </div>
      <nav className="mt-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch
              className={
                "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors " +
                (isActive
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-700 hover:bg-slate-100/70")
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
        <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
          Status:{" "}
          <span className="ml-1 inline-block h-2 w-2 rounded-full bg-emerald-500 align-middle" />{" "}
          Online
        </div>
      </div>
    </aside>
  );
}
