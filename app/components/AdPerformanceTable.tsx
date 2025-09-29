"use client";
import React, { useMemo, useState } from "react";

type Campaign = {
  id: string;
  name: string;
  platform: string;
  ctr: number;
  cpc: number;
  conversions: number;
  spend: number;
};

// Only allow numeric keys to be sortable
type SortableKey = "ctr" | "cpc" | "conversions" | "spend";

export default function AdPerformanceTable({
  campaigns,
}: {
  campaigns: Campaign[];
}) {
  const [sortBy, setSortBy] = useState<{ key: SortableKey; dir: "asc" | "desc" }>({
    key: "spend",
    dir: "desc",
  });
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const filtered = campaigns.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.platform.toLowerCase().includes(query.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const s = sortBy.dir === "asc" ? 1 : -1;
      return (a[sortBy.key] - b[sortBy.key]) * s;
    });
  }, [campaigns, sortBy, query]);

  function header(key: SortableKey | "name" | "platform") {
    return (
      <button
        onClick={() =>
          setSortBy((s) => ({
            key: (key as SortableKey) || s.key,
            dir: s.key === key && s.dir === "asc" ? "desc" : "asc",
          }))
        }
        className="flex items-center gap-2"
      >
        <span className="text-sm font-medium">{key.toUpperCase()}</span>
      </button>
    );
  }

  return (
    <div className="rounded-lg bg-white dark:bg-slate-800 shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold">Campaign performance</div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search campaigns"
            className="px-3 py-2 rounded border bg-slate-50 dark:bg-slate-900"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-auto">
          <thead>
            <tr className="text-slate-500 text-left">
              <th className="py-2">{header("name")}</th>
              <th className="py-2">{header("platform")}</th>
              <th className="py-2">{header("ctr")}</th>
              <th className="py-2">{header("cpc")}</th>
              <th className="py-2">{header("conversions")}</th>
              <th className="py-2">{header("spend")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-t border-slate-100 dark:border-slate-700"
              >
                <td className="py-3">{r.name}</td>
                <td className="py-3">{r.platform}</td>
                <td className="py-3">{r.ctr}%</td>
                <td className="py-3">${r.cpc}</td>
                <td className="py-3">{r.conversions}</td>
                <td className="py-3">${r.spend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
