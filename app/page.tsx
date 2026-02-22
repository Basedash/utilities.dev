"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { utilities } from "@/lib/generated/utilities-index";
import {
  getCategoryLabel,
  getUtilityCategories,
  type UtilityCategoryId,
} from "@/lib/utilities/categories";
import { filterUtilities } from "@/lib/utilities/discovery";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<UtilityCategoryId | "all">(
    "all"
  );
  const categoryOptions = getUtilityCategories();
  const hasSearchQuery = searchQuery.trim().length > 0;

  const filteredUtilities = filterUtilities(utilities, {
    query: searchQuery,
    category: selectedCategory,
  });

  const resultsTitle = hasSearchQuery
    ? "Search Results"
    : selectedCategory === "all"
      ? "All Utilities"
      : getCategoryLabel(selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Essential developer tools for everyday coding tasks
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Simple, fast, and free online utilities
          </p>

          {/* Search Bar */}
          <div className="mx-auto max-w-3xl">
            <div className="flex h-14 overflow-hidden rounded-md border border-input bg-background shadow-xs transition-[box-shadow,border-color] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search utilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-full w-full border-0 bg-transparent pl-10 pr-4 text-base shadow-none focus-visible:ring-0 focus-visible:border-transparent"
                />
              </div>
              <div className="flex w-44 shrink-0 items-center border-l border-border px-3 sm:w-52">
                <div className="relative w-full">
                  <select
                    aria-label="Filter by category"
                    value={selectedCategory}
                    onChange={(e) =>
                      setSelectedCategory(e.target.value as UtilityCategoryId | "all")
                    }
                    className="h-9 w-full appearance-none border-0 bg-transparent pr-6 text-sm font-medium text-foreground outline-none"
                  >
                    <option value="all">All utilities</option>
                    {categoryOptions.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Utilities Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredUtilities.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No utilities found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or browse all available utilities.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {resultsTitle}
              </h2>
              <Badge variant="secondary" className="text-sm">
                {filteredUtilities.length}{" "}
                {filteredUtilities.length !== 1 ? "utilities" : "utility"}
              </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUtilities.map((utility) => (
                <UtilityCard key={utility.id} utility={utility} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function UtilityCard({ utility }: { utility: (typeof utilities)[number] }) {
  const IconComponent = utility.icon;

  return (
    <Link href={`/${utility.slug}`} className="block">
      <Card className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group h-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <IconComponent className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="text-xs">
              {getCategoryLabel(utility.category)}
            </Badge>
          </div>
          <CardTitle className="group-hover:text-primary transition-colors">
            {utility.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {utility.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {utility.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {utility.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{utility.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
