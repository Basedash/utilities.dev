"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Code,
  FileText,
  TestTube,
  Key,
  Palette,
  Clock,
  Timer,
  GitCompare,
} from "lucide-react";

interface Utility {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
  category: string;
}

const utilities: Utility[] = [
  {
    id: "base64-encoding",
    title: "Base64 Encoding",
    description:
      "Encode and decode text using Base64 encoding. Perfect for handling binary data in text format.",
    path: "/base64-encoding",
    icon: Code,
    tags: ["encoding", "base64", "decode", "binary", "text"],
    category: "Encoding",
  },
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description:
      "Format, minify, and validate JSON data with syntax highlighting and error detection.",
    path: "/json-formatter",
    icon: FileText,
    tags: ["json", "format", "validate", "prettify", "minify", "syntax"],
    category: "Formatting",
  },
  {
    id: "regex-tester",
    title: "Regex Tester",
    description:
      "Test regular expressions with real-time matching, capture groups, and detailed results.",
    path: "/regex-tester",
    icon: TestTube,
    tags: [
      "regex",
      "regular expression",
      "pattern",
      "match",
      "test",
      "validation",
    ],
    category: "Testing",
  },
  {
    id: "jwt-decoder",
    title: "JWT Decoder",
    description:
      "Decode and inspect JWT tokens with detailed header, payload, and signature information.",
    path: "/jwt-decoder",
    icon: Key,
    tags: ["jwt", "token", "decode", "authentication", "security", "json"],
    category: "Security",
  },
  {
    id: "color-converter",
    title: "Color Converter",
    description:
      "Convert colors between different formats including HEX, RGB, HSL, HSV, and more with live preview.",
    path: "/color-converter",
    icon: Palette,
    tags: ["color", "hex", "rgb", "hsl", "hsv", "convert", "picker", "design"],
    category: "Design",
  },
  {
    id: "cron-parser",
    title: "Cron Expression Parser",
    description:
      "Parse and understand cron expressions with human-readable descriptions and upcoming execution times.",
    path: "/cron-parser",
    icon: Clock,
    tags: ["cron", "schedule", "parser", "time", "automation", "unix"],
    category: "Development",
  },
  {
    id: "unix-timestamp",
    title: "Unix Timestamp Converter",
    description:
      "Convert Unix timestamps to human-readable dates and vice versa. Support for seconds and milliseconds.",
    path: "/unix-timestamp",
    icon: Timer,
    tags: ["unix", "timestamp", "epoch", "date", "time", "converter", "posix"],
    category: "Development",
  },
  {
    id: "diff",
    title: "Text Diff Tool",
    description:
      "Compare two text blocks and highlight differences line by line. Perfect for code reviews and document comparisons.",
    path: "/diff",
    icon: GitCompare,
    tags: ["diff", "compare", "text", "changes", "review", "git", "patch"],
    category: "Development",
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

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

  const handleUtilityClick = (path: string) => {
    router.push(path);
  };

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
                  <Card
                    key={utility.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group"
                    onClick={() => handleUtilityClick(utility.path)}
                  >
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
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
