"use client";

import { useState, useMemo } from "react";
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

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUtilities = useMemo(() => {
    if (!searchQuery.trim()) return utilities;

    const query = searchQuery.toLowerCase();
    return utilities.filter(
      (utility) =>
        utility.title.toLowerCase().includes(query) ||
        utility.description.toLowerCase().includes(query) ||
        utility.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        utility.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

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
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search utilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
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
                {searchQuery ? "Search Results" : "All Utilities"}
              </h2>
              <Badge variant="secondary" className="text-sm">
                {filteredUtilities.length}{" "}
                {filteredUtilities.length !== 1 ? "utilities" : "utility"}
              </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUtilities.map((utility) => {
                const IconComponent = utility.icon;
                return (
                  <Link
                    href={`/${utility.slug}`}
                    key={utility.id}
                    className="block"
                  >
                    <Card className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group h-full">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {utility.category}
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
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
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
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
