"use client";

import { useEffect, useState } from "react";

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

interface GroupedCommits {
  [dateKey: string]: Commit[];
}

// GitHub repo details - update these to match your repo
const GITHUB_OWNER = "kriskruse";
const GITHUB_REPO = "Personal-Portfolio-app";

export default function Changelog() {
  const [commits, setCommits] = useState<GroupedCommits>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchCommits() {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?per_page=50`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch commits: ${response.status}`);
        }

        const data: Commit[] = await response.json();

        // Group commits by date (Mmm, DD - YYYY)
        const grouped: GroupedCommits = {};
        data.forEach((commit) => {
          const date = new Date(commit.commit.author.date);
          const dateKey = formatDateKey(date);

          if (!grouped[dateKey]) {
            grouped[dateKey] = [];
          }
          grouped[dateKey].push(commit);
        });

        setCommits(grouped);

        // Expand only the first (most recent) date group by default
        const dateKeys = Object.keys(grouped);
        if (dateKeys.length > 0) {
          setExpandedGroups(new Set([dateKeys[0]]));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load commits");
      } finally {
        setLoading(false);
      }
    }

    fetchCommits();
  }, []);

  // Format: "Mmm, DD - YYYY" (e.g., "Feb, 04 - 2026")
  function formatDateKey(date: Date): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}, ${day} - ${year}`;
  }

  // Format time: "HH:MM"
  function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  // Parse commit message into title and description
  function parseCommitMessage(message: string): { title: string; description: string | null } {
    const lines = message.split("\n");
    const title = lines[0];
    const description = lines.slice(1).join("\n").trim() || null;
    return { title, description };
  }

  // Toggle group expansion
  function toggleGroup(dateKey: string) {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dateKey)) {
        newSet.delete(dateKey);
      } else {
        newSet.add(dateKey);
      }
      return newSet;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-zinc-400">Loading commits...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
        <p className="text-sm text-zinc-500 mt-2">
          Unable to fetch commits from GitHub. Please try again later.
        </p>
      </div>
    );
  }

  const dateKeys = Object.keys(commits);

  if (dateKeys.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No commits found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-zinc-100 mb-2">
          Changelog
        </h2>
        <p className="text-zinc-400">
          A history of updates and changes to this project.
        </p>
      </div>

      {dateKeys.map((dateKey) => {
        const isExpanded = expandedGroups.has(dateKey);
        const commitCount = commits[dateKey].length;

        return (
          <div key={dateKey} className="relative">
            {/* Date header - clickable to toggle */}
            <button
              onClick={() => toggleGroup(dateKey)}
              className="w-full sticky top-0 z-10 bg-zinc-900/80 backdrop-blur-sm py-2 mb-2 flex items-center gap-2 hover:bg-zinc-800/90 transition-colors rounded-lg px-2 -mx-2"
            >
              {/* Arrow indicator */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-5 h-5 text-purple-400 transition-transform duration-200 ${
                  isExpanded ? "rotate-90" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <h3 className="text-lg font-semibold text-purple-400">
                {dateKey}
              </h3>
              <span className="text-sm text-zinc-500">
                ({commitCount} commit{commitCount !== 1 ? "s" : ""})
              </span>
            </button>

            {/* Commits for this date - collapsible */}
            {isExpanded && (
              <div className="space-y-4 pl-4 border-l-2 border-purple-800 animate-in slide-in-from-top-2 duration-200">
                {commits[dateKey].map((commit) => {
                  const { title, description } = parseCommitMessage(commit.commit.message);
                  const time = formatTime(commit.commit.author.date);

                  return (
                    <div
                      key={commit.sha}
                      className="relative pl-4 pb-4 group"
                    >
                      {/* Timeline dot */}
                      <div className="absolute -left-2.5 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-zinc-900"></div>

                      {/* Commit content */}
                      <a
                        href={commit.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-zinc-100 group-hover:text-purple-400 transition-colors">
                            {title}
                          </h4>
                          <span className="shrink-0 text-xs text-zinc-500 font-mono">
                            {time}
                          </span>
                        </div>

                        {description && (
                          <p className="mt-1 text-sm text-zinc-400 whitespace-pre-wrap">
                            {description}
                          </p>
                        )}

                        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                          <span className="font-mono">{commit.sha.slice(0, 7)}</span>
                          <span>by {commit.commit.author.name}</span>
                        </div>
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
