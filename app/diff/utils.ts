/**
 * Represents a single line in a diff result
 */
export interface DiffLine {
  type: "equal" | "added" | "removed";
  content: string;
  lineNumber1?: number;
  lineNumber2?: number;
}

/**
 * Diff options for customizing comparison behavior
 */
export interface DiffOptions {
  ignoreWhitespace?: boolean;
  ignoreCase?: boolean;
  contextLines?: number;
}

/**
 * Diff statistics
 */
export interface DiffStats {
  added: number;
  removed: number;
  unchanged: number;
  total: number;
}

/**
 * Complete diff result
 */
export interface DiffResult {
  lines: DiffLine[];
  stats: DiffStats;
  hasChanges: boolean;
}

/**
 * Processes text according to diff options
 */
export const processText = (
  text: string,
  options: DiffOptions = {}
): string => {
  let processed = text;

  if (options.ignoreCase) {
    processed = processed.toLowerCase();
  }

  if (options.ignoreWhitespace) {
    processed = processed.replace(/\s+/g, " ").trim();
  }

  return processed;
};

/**
 * Simple Longest Common Subsequence algorithm for better diff quality
 */
export const lcs = (a: string[], b: string[]): number[][] => {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;
};

/**
 * Generates diff using LCS algorithm
 */
export const generateLCSDiff = (
  lines1: string[],
  lines2: string[],
  processedLines1: string[],
  processedLines2: string[]
): DiffLine[] => {
  const dp = lcs(processedLines1, processedLines2);
  const result: DiffLine[] = [];

  let i = lines1.length;
  let j = lines2.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && processedLines1[i - 1] === processedLines2[j - 1]) {
      result.unshift({
        type: "equal",
        content: lines1[i - 1],
        lineNumber1: i,
        lineNumber2: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({
        type: "added",
        content: lines2[j - 1],
        lineNumber2: j,
      });
      j--;
    } else if (i > 0) {
      result.unshift({
        type: "removed",
        content: lines1[i - 1],
        lineNumber1: i,
      });
      i--;
    }
  }

  return result;
};

/**
 * Simple line-by-line diff algorithm (faster but less accurate)
 */
export const generateSimpleDiff = (
  lines1: string[],
  lines2: string[],
  processedLines1: string[],
  processedLines2: string[]
): DiffLine[] => {
  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;

  while (i < lines1.length || j < lines2.length) {
    if (i >= lines1.length) {
      // Remaining lines in text2 are additions
      result.push({
        type: "added",
        content: lines2[j],
        lineNumber2: j + 1,
      });
      j++;
    } else if (j >= lines2.length) {
      // Remaining lines in text1 are deletions
      result.push({
        type: "removed",
        content: lines1[i],
        lineNumber1: i + 1,
      });
      i++;
    } else if (processedLines1[i] === processedLines2[j]) {
      // Lines are equal
      result.push({
        type: "equal",
        content: lines1[i],
        lineNumber1: i + 1,
        lineNumber2: j + 1,
      });
      i++;
      j++;
    } else {
      // Look ahead to find matching lines
      let foundMatch = false;
      const lookAhead = 5;

      // Check if current line in text1 matches any upcoming line in text2
      for (let k = j + 1; k < Math.min(j + lookAhead, lines2.length); k++) {
        if (processedLines1[i] === processedLines2[k]) {
          // Add the lines between j and k as additions
          for (let l = j; l < k; l++) {
            result.push({
              type: "added",
              content: lines2[l],
              lineNumber2: l + 1,
            });
          }
          result.push({
            type: "equal",
            content: lines1[i],
            lineNumber1: i + 1,
            lineNumber2: k + 1,
          });
          i++;
          j = k + 1;
          foundMatch = true;
          break;
        }
      }

      if (!foundMatch) {
        // Check if current line in text2 matches any upcoming line in text1
        for (let k = i + 1; k < Math.min(i + lookAhead, lines1.length); k++) {
          if (processedLines1[k] === processedLines2[j]) {
            // Add the lines between i and k as deletions
            for (let l = i; l < k; l++) {
              result.push({
                type: "removed",
                content: lines1[l],
                lineNumber1: l + 1,
              });
            }
            result.push({
              type: "equal",
              content: lines1[k],
              lineNumber1: k + 1,
              lineNumber2: j + 1,
            });
            i = k + 1;
            j++;
            foundMatch = true;
            break;
          }
        }
      }

      if (!foundMatch) {
        // No match found, treat as both removal and addition
        result.push({
          type: "removed",
          content: lines1[i],
          lineNumber1: i + 1,
        });
        result.push({
          type: "added",
          content: lines2[j],
          lineNumber2: j + 1,
        });
        i++;
        j++;
      }
    }
  }

  return result;
};

/**
 * Calculates diff statistics
 */
export const calculateDiffStats = (lines: DiffLine[]): DiffStats => {
  const added = lines.filter((line) => line.type === "added").length;
  const removed = lines.filter((line) => line.type === "removed").length;
  const unchanged = lines.filter((line) => line.type === "equal").length;

  return {
    added,
    removed,
    unchanged,
    total: lines.length,
  };
};

/**
 * Main diff function that compares two texts
 */
export const diffTexts = (
  text1: string,
  text2: string,
  options: DiffOptions = {}
): DiffResult => {
  if (!text1 && !text2) {
    return {
      lines: [],
      stats: { added: 0, removed: 0, unchanged: 0, total: 0 },
      hasChanges: false,
    };
  }

  // Handle one empty text case
  const lines1 = text1 ? text1.split("\n") : [];
  const lines2 = text2 ? text2.split("\n") : [];
  const processedLines1 = lines1.map((line) => processText(line, options));
  const processedLines2 = lines2.map((line) => processText(line, options));

  // Use LCS algorithm for better quality diff, fallback to simple for very large texts
  const useLCS = lines1.length + lines2.length < 1000;
  const diffLines = useLCS
    ? generateLCSDiff(lines1, lines2, processedLines1, processedLines2)
    : generateSimpleDiff(lines1, lines2, processedLines1, processedLines2);

  const stats = calculateDiffStats(diffLines);
  const hasChanges = stats.added > 0 || stats.removed > 0;

  return {
    lines: diffLines,
    stats,
    hasChanges,
  };
};

/**
 * Formats diff as unified diff format
 */
export const formatUnifiedDiff = (
  diffResult: DiffResult,
  filename1: string = "text1",
  filename2: string = "text2"
): string => {
  const lines = diffResult.lines;
  const result: string[] = [];
  result.push(`--- ${filename1}`);
  result.push(`+++ ${filename2}`);

  if (lines.length === 0) {
    return result.join("\n");
  }

  // If no changes but we have equal lines, show them
  if (!diffResult.hasChanges && lines.length > 0) {
    // Show all lines as unchanged context
    const equalLines = lines.filter((line) => line.type === "equal");
    if (equalLines.length > 0) {
      const firstLine = equalLines[0];
      const startLine1 = firstLine.lineNumber1 || 1;
      const startLine2 = firstLine.lineNumber2 || 1;
      result.push(
        `@@ -${startLine1},${equalLines.length} +${startLine2},${equalLines.length} @@`
      );

      for (const line of equalLines) {
        result.push(` ${line.content}`);
      }
    }
    return result.join("\n");
  }

  let i = 0;
  while (i < lines.length) {
    // Find the start of a change block
    while (i < lines.length && lines[i].type === "equal") {
      i++;
    }

    if (i >= lines.length) break;

    // Find the end of the change block
    const start = i;
    while (i < lines.length && lines[i].type !== "equal") {
      i++;
    }

    // Calculate hunk header - simplified approach
    const removedCount = lines.filter(
      (l, idx) => idx >= start && idx < i && l.type === "removed"
    ).length;
    const addedCount = lines.filter(
      (l, idx) => idx >= start && idx < i && l.type === "added"
    ).length;

    // Include context before changes
    const contextStart = start > 0 ? start - 1 : start;
    const contextBefore = start > 0 ? 1 : 0;

    const startLine1 = lines[contextStart].lineNumber1 || 1;
    const startLine2 = lines[contextStart].lineNumber2 || 1;
    const length1 = contextBefore + removedCount;
    const length2 = contextBefore + addedCount;

    result.push(`@@ -${startLine1},${length1} +${startLine2},${length2} @@`);

    // Add context line if exists
    if (start > 0) {
      const contextLine = lines[start - 1];
      result.push(` ${contextLine.content}`);
    }

    for (let j = start; j < i; j++) {
      const line = lines[j];
      const prefix =
        line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
      result.push(`${prefix}${line.content}`);
    }
  }

  return result.join("\n");
};

/**
 * Formats diff for display with line numbers
 */
export const formatDiffWithLineNumbers = (diffResult: DiffResult): string => {
  return diffResult.lines
    .map((line) => {
      const lineNum1 = line.lineNumber1 ? line.lineNumber1.toString() : "  ";
      const lineNum2 = line.lineNumber2 ? line.lineNumber2.toString() : " ";
      const prefix =
        line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
      return `${lineNum1} | ${lineNum2} | ${prefix} ${line.content}`;
    })
    .join("\n");
};

/**
 * Exports diff as patch format
 */
export const exportAsPatch = (
  text1: string,
  text2: string,
  filename1: string = "a.txt",
  filename2: string = "b.txt",
  options: DiffOptions = {}
): string => {
  const diffResult = diffTexts(text1, text2, options);
  return formatUnifiedDiff(diffResult, filename1, filename2);
};

/**
 * Checks if two texts are identical
 */
export const areTextsIdentical = (
  text1: string,
  text2: string,
  options: DiffOptions = {}
): boolean => {
  const processed1 = processText(text1, options);
  const processed2 = processText(text2, options);
  return processed1 === processed2;
};

/**
 * Gets similarity percentage between two texts
 */
export const getSimilarityPercentage = (
  text1: string,
  text2: string,
  options: DiffOptions = {}
): number => {
  if (!text1 && !text2) return 100;
  if (!text1 || !text2) return 0;

  const lines1 = text1.split("\n");
  const lines2 = text2.split("\n");
  const totalLines = Math.max(lines1.length, lines2.length);

  if (totalLines === 0) return 100;

  const diffResult = diffTexts(text1, text2, options);
  const { stats } = diffResult;

  const similarity = (stats.unchanged / totalLines) * 100;
  return Math.round(similarity * 100) / 100;
};
