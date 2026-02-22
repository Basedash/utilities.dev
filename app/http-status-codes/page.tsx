"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, Copy } from "lucide-react";
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import manifest from "./manifest";
import {
  filterStatusCodes,
  groupByCategory,
  HTTP_STATUS_CATEGORIES,
  HTTP_CATEGORY_LABELS,
  type HttpStatusCategory,
} from "./utils";

export default function HttpStatusCodesPage() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<HttpStatusCategory | null>(null);

  const filtered = useMemo(
    () => filterStatusCodes(query, categoryFilter),
    [query, categoryFilter]
  );

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  const handleClearSearch = () => {
    setQuery("");
  };

  const toggleCategory = (cat: HttpStatusCategory) => {
    setCategoryFilter((prev) => (prev === cat ? null : cat));
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <UtilityPageHero manifest={manifest} />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search
            </CardTitle>
            <CardDescription>
              Search by status code (e.g. 404) or phrase (e.g. not found)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g. 404 or not found"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
                aria-label="Search status codes"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleClearSearch}
                disabled={!query}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground self-center">Category:</span>
              {HTTP_STATUS_CATEGORIES.map((cat) => (
                <Badge
                  key={cat}
                  variant={categoryFilter === cat ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCategory(cat)}
                >
                  {cat} {HTTP_CATEGORY_LABELS[cat]}
                </Badge>
              ))}
              {categoryFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCategoryFilter(null)}
                  className="h-6 px-2 text-xs"
                >
                  Clear filter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No status codes match your search. Try a different code or phrase.
              </CardContent>
            </Card>
          ) : (
            HTTP_STATUS_CATEGORIES.map((cat) => {
              const entries = grouped.get(cat) ?? [];
              if (entries.length === 0) return null;

              return (
                <Card key={cat}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {cat} - {HTTP_CATEGORY_LABELS[cat]}
                    </CardTitle>
                    <CardDescription>
                      {entries.length} code{entries.length !== 1 ? "s" : ""} in this category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {entries.map((entry) => (
                        <div
                          key={entry.code}
                          className="rounded-lg border bg-muted/30 p-3"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-mono font-semibold text-sm">
                              {entry.code}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {entry.category}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleCopy(
                                    `${entry.code} ${entry.name} - ${entry.description}`
                                  )
                                }
                                className="h-7 w-7 p-0"
                                aria-label={`Copy ${entry.code} ${entry.name}`}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          <div className="font-medium text-sm">{entry.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {entry.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
