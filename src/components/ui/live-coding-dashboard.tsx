

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StarBackground from "@/components/StarBackground";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  BarChart3,
  Bell,
  BookOpenText,
  CalendarDays,
  Clock3,
  FolderGit2,
  GitCompareArrows,
  Home,
  LayoutGrid,
  Loader2,
  LogOut,
  Menu,
  Search,
  Share2,
  TrendingUp,
  UserRoundCog,
  X,
  Code,
  Building2,
  ExternalLink,
  GitFork,
  Link as LinkIcon,
  MapPin,
  Star,
  Users,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";

import { createClient } from "@/app/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import * as htmlToImage from "html-to-image";

type ActivityPoint = {
  date: string;
  submissions: number;
};

type ContestHistoryPoint = {
  contestName?: string;
  rating?: number;
  newRating?: number;
  date?: string;
  ratingUpdateTimeSeconds?: number;
};

type CodingPlatformStats = {
  success: boolean;
  platform: string;
  handle?: string;
  totalSolved?: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  rating?: number;
  maxRating?: number;
  contestRating?: number;
  rank?: string | number;
  stars?: string;
  score?: number;
  monthlyScore?: number;
  institution?: string | null;
  articlesPublished?: number;
  potdCurrentStreak?: number;
  potdLongestStreak?: number;
  potdSolved?: number;
  activity?: ActivityPoint[];
  contestHistory?: ContestHistoryPoint[];
  history?: ContestHistoryPoint[];
};

type GitHubStats = {
  success: boolean;
  handle?: string;
  name?: string | null;
  bio?: string | null;
  company?: string | null;
  location?: string | null;
  blog?: string | null;
  publicRepos?: number;
  publicGists?: number;
  followers?: number;
  following?: number;
  avatar?: string;
  profileUrl?: string;
  createdAt?: string;
  totalStars?: number;
  totalForks?: number;
  topLanguages?: Array<{
    language: string;
    count: number;
  }>;
  recentRepos?: Array<{
    name: string;
    description?: string | null;
    url: string;
    language?: string | null;
    stars: number;
    forks: number;
    updatedAt?: string;
  }>;
  contributionCalendar?: {
    totalContributions: number;
    weeks: Array<{
      contributionDays: Array<{
        date: string;
        contributionCount: number;
        color?: string;
      }>;
    }>;
  } | null;
};

type AggregatedStatsApi = {
  success: boolean;
  message?: string;
  data?: {
    coding: CodingPlatformStats[];
    github: GitHubStats | null;
    totalSolved: number;
  };
};

type RatingSeries = {
  label: string;
  rating: number;
};

type DsaInsight = {
  platform: string;
  easy: number;
  medium: number;
  hard: number;
  total: number;
  hasDifficultySplit: boolean;
};

type CompetitiveInsight = {
  platform: string;
  currentRating: number | null;
  maxRating: number | null;
  rankLabel: string;
  totalSolved: number;
};

const platformLabels: Record<string, string> = {
  leetcode: "LeetCode",
  codeforces: "Codeforces",
  codechef: "CodeChef",
  atcoder: "AtCoder",
  gfg: "GFG",
  interviewbit: "InterviewBit",
};

function formatPlatformName(platform: string): string {
  return platformLabels[platform] ?? platform.charAt(0).toUpperCase() + platform.slice(1);
}

function getPlatformProfileUrl(platform: string, handle?: string): string | null {
  if (!handle) return null;
  const encodedHandle = encodeURIComponent(handle);

  switch (platform) {
    case "leetcode":
      return `https://leetcode.com/u/${encodedHandle}`;
    case "codeforces":
      return `https://codeforces.com/profile/${encodedHandle}`;
    case "codechef":
      return `https://www.codechef.com/users/${encodedHandle}`;
    case "atcoder":
      return `https://atcoder.jp/users/${encodedHandle}`;
    case "gfg":
      return `https://www.geeksforgeeks.org/profile/${encodedHandle}`;
    case "interviewbit":
      return `https://www.interviewbit.com/profile/${encodedHandle}`;
    case "github":
      return `https://github.com/${encodedHandle}`;
    default:
      return null;
  }
}

function formatDatePretty(dateText: string): string {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeUpdate(dateText: string | null): string {
  if (!dateText) return "No recent update";
  const then = new Date(dateText).getTime();
  const now = Date.now();
  if (!Number.isFinite(then)) return "No recent update";
  const minutes = Math.max(1, Math.floor((now - then) / 60000));
  if (minutes < 60) return `Last update ${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Last update ${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `Last update ${days} days ago`;
}

function formatMonthYear(dateText?: string): string {
  if (!dateText) return "Unknown";
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}

function aggregateActivity(codingStats: CodingPlatformStats[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const stat of codingStats) {
    for (const point of stat.activity ?? []) {
      if (!point.date) continue;
      const value = Number.isFinite(point.submissions) ? point.submissions : 0;
      map.set(point.date, (map.get(point.date) ?? 0) + Math.max(value, 0));
    }
  }
  return map;
}

type HeatmapDay = {
  date: string;
  submissions: number;
};

type HeatmapMonth = {
  key: string;
  label: string;
  weeks: Array<Array<HeatmapDay | null>>;
};

type GithubDay = {
  date: string;
  contributionCount: number;
  color?: string;
};

type GithubHeatmapMonth = {
  key: string;
  label: string;
  weeks: Array<Array<GithubDay | null>>;
};

function buildGithubHeatmapMonths(weeksArray: any[]): GithubHeatmapMonth[] {
  if (!weeksArray || weeksArray.length === 0) return [];

  const allDays: GithubDay[] = [];
  for (const w of weeksArray) {
    if (w?.contributionDays) {
      allDays.push(...w.contributionDays);
    }
  }

  if (allDays.length === 0) return [];

  const monthGroups = new Map<string, GithubDay[]>();
  for (const day of allDays) {
    const d = new Date(day.date);
    if (Number.isNaN(d.getTime())) continue;
    const groupKey = `${d.getFullYear()}-${d.getMonth()}`;
    if (!monthGroups.has(groupKey)) {
      monthGroups.set(groupKey, []);
    }
    monthGroups.get(groupKey)!.push(day);
  }

  const generatedMonths: GithubHeatmapMonth[] = [];

  for (const [key, daysInMonth] of monthGroups.entries()) {
    if (daysInMonth.length === 0) continue;

    daysInMonth.sort((a, b) => a.date.localeCompare(b.date));

    const firstDayObj = new Date(daysInMonth[0].date);
    const monthLabel = firstDayObj.toLocaleDateString(undefined, { month: "short" });
    
    const weeks: Array<Array<GithubDay | null>> = [];
    let currentWeek: Array<GithubDay | null> = [];

    const startingDayOfWeek = firstDayObj.getDay();
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push(null);
    }

    for (const day of daysInMonth) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    generatedMonths.push({
      key,
      label: monthLabel,
      weeks,
    });
  }

  return generatedMonths.sort((a, b) => {
    const [yearA, monthA] = a.key.split("-").map(Number);
    const [yearB, monthB] = b.key.split("-").map(Number);
    return yearA !== yearB ? yearA - yearB : monthA - monthB;
  });
}

function buildHeatmapMonthsByRange(
  activityByDay: Map<string, number>,
  start: Date,
  end: Date,
): HeatmapMonth[] {
  const normalizedStart = new Date(start);
  normalizedStart.setHours(0, 0, 0, 0);
  const normalizedEnd = new Date(end);
  normalizedEnd.setHours(0, 0, 0, 0);

  const months: HeatmapMonth[] = [];
  const cursor = new Date(normalizedStart.getFullYear(), normalizedStart.getMonth(), 1);

  while (cursor.getTime() <= normalizedEnd.getTime()) {
    const monthStart = new Date(cursor);
    const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const visibleStart = monthStart.getTime() < normalizedStart.getTime() ? normalizedStart : monthStart;
    const visibleEnd = monthEnd.getTime() > normalizedEnd.getTime() ? normalizedEnd : monthEnd;
    const weeks: Array<Array<HeatmapDay | null>> = [];
    let week: Array<HeatmapDay | null> = [];

    for (let i = 0; i < visibleStart.getDay(); i += 1) {
      week.push(null);
    }

    const day = new Date(visibleStart);
    while (day.getTime() <= visibleEnd.getTime()) {
      const key = day.toISOString().slice(0, 10);
      week.push({ date: key, submissions: activityByDay.get(key) ?? 0 });

      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }

      day.setDate(day.getDate() + 1);
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }

    months.push({
      key: `${cursor.getFullYear()}-${cursor.getMonth()}`,
      label: cursor.toLocaleDateString(undefined, { month: "short" }),
      weeks,
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return months;
}

function getHeatColorLevel(submissions: number): string {
  if (submissions <= 0) return "bg-zinc-100 dark:bg-zinc-900";
  if (submissions <= 2) return "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-200/30";
  if (submissions <= 5) return "bg-emerald-300 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-300";
  return "bg-emerald-500 dark:bg-emerald-500 text-white";
}

function getGithubHeatColorLevel(contributions: number): string {
  if (contributions <= 0) return "bg-zinc-100 dark:bg-zinc-900";
  if (contributions <= 2) return "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-400 border border-blue-200/30";
  if (contributions <= 5) return "bg-blue-300 dark:bg-blue-800 text-blue-900 dark:text-blue-300";
  if (contributions <= 10) return "bg-blue-500 dark:bg-blue-600 text-white";
  return "bg-blue-600 dark:bg-blue-500 text-white";
}

export const CodingDashboard: React.FC = () => {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AggregatedStatsApi["data"] | null>(null);
  const [ratingPlatform, setRatingPlatform] = useState<string>("leetcode");
  const [topicMode, setTopicMode] = useState<"dsa" | "competitive">("dsa");
  const [heatmapPage, setHeatmapPage] = useState(0);
  const [activeView, setActiveView] = useState<"dashboard" | "github">("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);

  const handleDownloadCard = async () => {
    const card = document.getElementById("profile-card");
    if (!card) return;

    const dataUrl = await htmlToImage.toPng(card);
    const link = document.createElement("a");
    link.download = "profile-card.png";
    link.href = dataUrl;
    link.click();
  };

  const handleNativeShare = async () => {
    const card = document.getElementById("profile-card");
    if (!card) return;

    const blob = await htmlToImage.toBlob(card);
    if (!blob) {
      console.error("Failed to generate image blob.");
      return;
    }

    const shareData = {
      files: [new File([blob], "profile-card.png", { type: "image/png" })],
      title: "My Coding Profile",
    };

    if ('canShare' in navigator && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing or share cancelled:", error);
      }
    } else {
      alert("Sharing not supported on this device.");
    }
  };

  useEffect(() => {
    let alive = true;

    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/user/stats", { cache: "no-store" });
        const payload = (await response.json()) as AggregatedStatsApi;

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Could not load dashboard stats.");
        }

        if (!alive) return;
        setStats(payload.data ?? null);
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Failed to load dashboard.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadStats();
    return () => {
      alive = false;
    };
  }, []);

  const codingStats = useMemo(
    () => (stats?.coding ?? []).filter((entry) => entry.success),
    [stats],
  );

  const githubStats = stats?.github?.success ? stats.github : null;
  const totalQuestions = stats?.totalSolved ?? 0;

  const profileLinks = useMemo(() => {
    const links = codingStats
      .map((entry) => ({
        platform: entry.platform,
        label: formatPlatformName(entry.platform),
        handle: entry.handle,
        url: getPlatformProfileUrl(entry.platform, entry.handle),
      }))
      .filter((entry): entry is { platform: string; label: string; handle: string; url: string } =>
        Boolean(entry.handle && entry.url),
      );

    if (githubStats?.handle) {
      links.unshift({
        platform: "github",
        label: "GitHub",
        handle: githubStats.handle,
        url: githubStats.profileUrl ?? `https://github.com/${encodeURIComponent(githubStats.handle)}`,
      });
    }

    return links;
  }, [codingStats, githubStats]);

  const githubMonths = useMemo(() => {
    return buildGithubHeatmapMonths(githubStats?.contributionCalendar?.weeks ?? []);
  }, [githubStats]);

  const gfgStats = useMemo(
    () => codingStats.find((entry) => entry.platform === "gfg") ?? null,
    [codingStats],
  );

  const activityByDay = useMemo(() => aggregateActivity(codingStats), [codingStats]);
  const totalActiveDays = useMemo(
    () => [...activityByDay.values()].filter((count) => count > 0).length,
    [activityByDay],
  );

  const lastActiveDate = useMemo(() => {
    const activeDates = [...activityByDay.entries()]
      .filter(([, count]) => count > 0)
      .map(([date]) => date)
      .sort();
    return activeDates.length ? activeDates[activeDates.length - 1] : null;
  }, [activityByDay]);

  const isActive = useMemo(() => {
    if (!lastActiveDate) return false;
    const now = new Date();
    const last = new Date(lastActiveDate);
    const diff = now.getTime() - last.getTime();
    return diff <= 48 * 60 * 60 * 1000;
  }, [lastActiveDate]);

  const ratingByPlatform = useMemo(() => {
    const map = new Map<string, RatingSeries[]>();

    for (const platform of codingStats) {
      const key = platform.platform;
      const rows: RatingSeries[] = [];

      if (key === "leetcode") {
        const history = platform.contestHistory ?? [];
        for (const point of history) {
          if (typeof point.rating === "number") {
            rows.push({
              label: point.date ? formatDatePretty(point.date) : point.contestName ?? "Contest",
              rating: point.rating,
            });
          }
        }
      } else if (key === "codeforces") {
        const history = platform.history ?? [];
        for (const point of history) {
          const ratingValue = typeof point.newRating === "number" ? point.newRating : null;
          if (ratingValue !== null) {
            const dateText = point.ratingUpdateTimeSeconds
              ? new Date(point.ratingUpdateTimeSeconds * 1000).toISOString()
              : undefined;
            rows.push({
              label: dateText ? formatDatePretty(dateText) : point.contestName ?? "Contest",
              rating: ratingValue,
            });
          }
        }
      }

      if (rows.length === 0) {
        const fallback =
          typeof platform.contestRating === "number"
            ? platform.contestRating
            : typeof platform.rating === "number"
              ? platform.rating
              : null;
        if (fallback !== null && fallback > 0) {
          rows.push({ label: "Current", rating: fallback });
        }
      }

      if (rows.length > 0) {
        map.set(key, rows);
      }
    }

    return map;
  }, [codingStats]);

  useEffect(() => {
    const firstPlatform = ratingByPlatform.keys().next().value as string | undefined;
    if (firstPlatform && !ratingByPlatform.has(ratingPlatform)) {
      setRatingPlatform(firstPlatform);
    }
  }, [ratingByPlatform, ratingPlatform]);

  const dsaInsights = useMemo<DsaInsight[]>(() => {
    const rows: DsaInsight[] = [];
    for (const platform of codingStats) {
      if (!["leetcode", "gfg"].includes(platform.platform)) continue;
      const easy = platform.easySolved ?? 0;
      const medium = platform.mediumSolved ?? 0;
      const hard = platform.hardSolved ?? 0;
      const splitTotal = easy + medium + hard;
      const total = splitTotal > 0 ? splitTotal : platform.totalSolved ?? 0;
      if (total <= 0) continue;
      rows.push({
        platform: formatPlatformName(platform.platform),
        easy,
        medium,
        hard,
        total,
        hasDifficultySplit: splitTotal > 0,
      });
    }
    return rows;
  }, [codingStats]);

  const competitiveInsights = useMemo<CompetitiveInsight[]>(() => {
    const competitivePlatforms = codingStats.filter((entry) =>
      ["codeforces", "codechef", "atcoder"].includes(entry.platform),
    );

    return competitivePlatforms.map((entry) => ({
      platform: formatPlatformName(entry.platform),
      currentRating:
        typeof entry.rating === "number"
          ? entry.rating
          : typeof entry.contestRating === "number"
            ? entry.contestRating
            : null,
      maxRating: typeof entry.maxRating === "number" ? entry.maxRating : null,
      rankLabel: String(entry.rank ?? entry.stars ?? "N/A"),
      totalSolved: entry.totalSolved ?? 0,
    }));
  }, [codingStats]);

  const earliestActivityDate = useMemo(() => {
    const dates = [...activityByDay.keys()].sort();
    return dates.length ? dates[0] : null;
  }, [activityByDay]);

  const heatmapRange = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setDate(today.getDate() - heatmapPage * 182);
    const start = new Date(end);
    start.setDate(end.getDate() - 181);
    return { start, end };
  }, [heatmapPage]);

  const heatmapMonths = useMemo(
    () => buildHeatmapMonthsByRange(activityByDay, heatmapRange.start, heatmapRange.end),
    [activityByDay, heatmapRange],
  );

  const canShowOlderHeatmap = useMemo(() => {
    if (!earliestActivityDate) return false;
    const earliest = new Date(earliestActivityDate);
    earliest.setHours(0, 0, 0, 0);
    return earliest.getTime() < heatmapRange.start.getTime();
  }, [earliestActivityDate, heatmapRange.start]);

  const heatmapRangeLabel = useMemo(() => {
    const from = heatmapRange.start.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const to = heatmapRange.end.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${from} - ${to}`;
  }, [heatmapRange]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          <span className="text-sm font-medium tracking-wide">Assembling analytics pipeline...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-white flex items-center justify-center p-6">
        <Card className="max-w-lg w-full bg-zinc-900 border-zinc-800 shadow-2xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Pipeline Interrupted
            </CardTitle>
            <CardDescription className="text-zinc-400 mt-2">{error}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-end border-t border-zinc-800/60 pt-4">
            <Button
              className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition font-medium rounded-xl"
              onClick={() => window.location.reload()}
            >
              Retry Connection
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const relativeUpdateLabel = formatRelativeUpdate(lastActiveDate);
  const githubProfileUrl = githubStats?.profileUrl ?? (githubStats?.handle ? `https://github.com/${githubStats.handle}` : null);

  return (
    <TooltipProvider>
      <div className="relative min-h-screen w-full bg-zinc-950 text-zinc-50 antialiased font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
        <StarBackground />
        
        {/* Modern ambient layout backdrop */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[500px] overflow-hidden">
          <div className="absolute top-[-250px] left-[20%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[140px]" />
          <div className="absolute top-[-200px] right-[10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] xl:p-4 gap-4">
          
          {/* Sidebar / Navigation Hub */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-md lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <aside className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-zinc-900 bg-zinc-950 p-6 transition-transform duration-300 lg:sticky lg:translate-x-0 lg:rounded-3xl lg:border lg:h-[calc(100vh-2rem)] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex items-center gap-3 pb-8 border-b border-zinc-900">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-zinc-950 shadow-lg shadow-emerald-500/20">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight text-white">CodeAtlas</p>
                <p className="text-xs font-medium text-zinc-500">Unified Engineering Hub</p>
              </div>
            </div>

            <div className="flex-1 py-8 space-y-8">
              <div className="space-y-1">
                <p className="px-3 text-[11px] font-bold tracking-widest text-zinc-600 uppercase mb-3">Analytics</p>
                <button
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition font-medium ${activeView === "dashboard"
                    ? "bg-zinc-900 text-white border border-zinc-800 shadow-inner"
                    : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
                    }`}
                  onClick={() => {
                    setActiveView("dashboard");
                    setIsSidebarOpen(false);
                  }}
                >
                  <BarChart3 className="h-4 w-4 text-emerald-500" />
                  Performance Metrics
                </button>
                <button
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition font-medium ${activeView === "github"
                    ? "bg-zinc-900 text-white border border-zinc-800 shadow-inner"
                    : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
                    }`}
                  onClick={() => {
                    setActiveView("github");
                    setIsSidebarOpen(false);
                  }}
                >
                  <FaGithub className="h-4 w-4 text-blue-400" />
                  GitHub Repository Matrix
                </button>
              </div>

              <div className="space-y-1">
                <p className="px-3 text-[11px] font-bold tracking-widest text-zinc-600 uppercase mb-3">Management</p>
                <button
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-400 font-medium transition hover:bg-zinc-900/40 hover:text-zinc-200"
                  onClick={() => {
                    router.push("/dashboard/links");
                    setIsSidebarOpen(false);
                  }}
                >
                  <UserRoundCog className="h-4 w-4 text-zinc-500" />
                  Integration Pipeline
                </button>
                <button
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-400 font-medium transition hover:bg-zinc-900/40 hover:text-zinc-200"
                  onClick={() => {
                    router.push("/");
                    setIsSidebarOpen(false);
                  }}
                >
                  <Home className="h-4 w-4 text-zinc-500" />
                  Terminal Mainframe
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-900">
              <Button
                className="w-full justify-start gap-3 rounded-xl bg-zinc-900 hover:bg-rose-950/30 border border-zinc-800 hover:border-rose-900/50 text-zinc-300 hover:text-rose-400 py-6 transition group"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 text-zinc-500 group-hover:text-rose-400 transition" />
                Disconnect Session
              </Button>
            </div>
          </aside>

          {/* Main Interface Workstation */}
          <main className="flex-1 min-w-0 flex flex-col p-4 lg:p-2 space-y-6">
            
            {/* Top Workspace Bar */}
            <div className="flex items-center justify-between gap-4 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-zinc-400 hover:text-white hover:bg-zinc-900"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                    {activeView === "github" ? "GitHub Repository Matrix" : "Performance Metrics"}
                  </h1>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">{relativeUpdateLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="gap-2 rounded-xl border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200 font-semibold px-4 shadow-sm"
                  onClick={() => setShowProfileCard(true)}
                >
                  <Share2 className="h-4 w-4 text-emerald-400" />
                  Share Card
                </Button>
              </div>
            </div>

            {/* Content Layers */}
            {activeView === "github" ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                {!githubStats ? (
                  <Card className="rounded-2xl border-zinc-900 bg-zinc-950 shadow-2xl p-6 text-center max-w-xl mx-auto mt-12 border-dashed">
                    <CardHeader className="p-0 flex flex-col items-center">
                      <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 grid place-items-center mb-4">
                        <FaGithub className="h-6 w-6 text-zinc-400" />
                      </div>
                      <CardTitle className="text-lg text-white font-bold">GitHub Node Disconnected</CardTitle>
                      <CardDescription className="text-zinc-500 max-w-sm mx-auto mt-2">
                        Integrate your public identity pipeline inside the parameters workspace to monitor stars, language distribution metrics, and active trees.
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-0 pt-6 justify-center">
                      <Button
                        className="gap-2 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold px-5"
                        onClick={() => router.push("/dashboard/links")}
                      >
                        <UserRoundCog className="h-4 w-4" />
                        Configure Pipeline
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <>
                    {/* Bento Grid Row 1: Profile & High Value Counters */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                      
                      {/* Identity Analytics Card */}
                      <Card className="rounded-3xl border-zinc-900 bg-zinc-950/60 shadow-xl backdrop-blur-md xl:col-span-5 border-l-2 border-l-blue-500">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row gap-5">
                            <div
                              className="h-24 w-24 shrink-0 rounded-2xl border-2 border-zinc-800 bg-cover bg-center shadow-lg ring-4 ring-blue-500/10"
                              style={{ backgroundImage: githubStats.avatar ? `url(${githubStats.avatar})` : undefined }}
                            />
                            <div className="min-w-0 flex-1 flex flex-col justify-between space-y-4">
                              <div>
                                <h2 className="truncate text-xl font-bold tracking-tight text-white">
                                  {githubStats.name || githubStats.handle}
                                </h2>
                                <p className="text-sm font-semibold text-blue-400/80">@{githubStats.handle}</p>
                                {githubStats.bio && (
                                  <p className="text-xs leading-relaxed text-zinc-400 mt-2 line-clamp-2">{githubStats.bio}</p>
                                )}
                              </div>
                              
                              <div className="space-y-1.5 text-xs text-zinc-400 border-t border-zinc-900/80 pt-3">
                                {githubStats.company && (
                                  <div className="flex items-center gap-2">
                                    <Building2 className="h-3.5 w-3.5 text-zinc-600" />
                                    <span className="truncate font-medium">{githubStats.company}</span>
                                  </div>
                                )}
                                {githubStats.location && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-3.5 w-3.5 text-zinc-600" />
                                    <span className="truncate font-medium">{githubStats.location}</span>
                                  </div>
                                )}
                                {githubStats.blog && (
                                  <div className="flex items-center gap-2">
                                    <LinkIcon className="h-3.5 w-3.5 text-zinc-600" />
                                    <a className="truncate text-blue-400 hover:underline font-medium" href={githubStats.blog.startsWith("http") ? githubStats.blog : `https://${githubStats.blog}`} target="_blank" rel="noreferrer">
                                      {githubStats.blog}
                                    </a>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between gap-2 pt-1">
                                {githubProfileUrl && (
                                  <Button
                                    variant="outline"
                                    className="h-8 gap-1.5 rounded-lg border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold px-3"
                                    onClick={() => window.open(githubProfileUrl, "_blank", "noopener,noreferrer")}
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Code Vault
                                  </Button>
                                )}
                                <Badge className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 rounded-md font-bold">
                                  Sync: {formatMonthYear(githubStats.createdAt)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Numerical Counter Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 xl:col-span-7">
                        {[
                          { label: "Public Storage Trees", value: githubStats.publicRepos ?? 0, icon: FolderGit2, tracking: "Repositories" },
                          { label: "Receptive Pipeline", value: githubStats.followers ?? 0, icon: Users, tracking: "Followers" },
                          { label: "Outbound Matrix", value: githubStats.following ?? 0, icon: UserRoundCog, tracking: "Following" },
                          { label: "Endorsements", value: githubStats.totalStars ?? 0, icon: Star, tracking: "Stars Earned" },
                          { label: "Downstream Clusters", value: githubStats.totalForks ?? 0, icon: GitFork, tracking: "Forks Generated" },
                          { label: "Code Snippets", value: githubStats.publicGists ?? 0, icon: Code, tracking: "Public Gists" },
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <Card key={item.label} className="rounded-2xl border-zinc-900 bg-zinc-950/40 shadow-md backdrop-blur-md p-5 flex flex-col justify-between hover:border-zinc-800 transition duration-200 group">
                              <div className="flex items-center justify-between space-y-0">
                                <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">{item.tracking}</span>
                                <Icon className="h-4 w-4 text-zinc-600 group-hover:text-blue-400 transition" />
                              </div>
                              <div className="mt-4">
                                <p className="text-3xl font-bold tracking-tight text-white">{item.value.toLocaleString()}</p>
                                <p className="text-[11px] text-zinc-500 font-medium mt-1 line-clamp-1">{item.label}</p>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>

                    {/* Matrix Row 2: Grid Stream Calendar Mapping */}
                    <Card className="rounded-3xl border-zinc-900 bg-zinc-950/40 shadow-xl backdrop-blur-md">
                      <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-900/60 pb-4">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-base font-bold text-white tracking-tight">
                            <GitCompareArrows className="h-4 w-4 text-blue-400" />
                            Repository Chronological Grid
                          </CardTitle>
                          <CardDescription className="text-xs text-zinc-500 mt-1">
                            {githubStats.contributionCalendar
                              ? `${githubStats.contributionCalendar.totalContributions.toLocaleString()} operations executed within active tree arrays across the annual cycle.`
                              : "Matrix tracking array missing infrastructure key context token."}
                          </CardDescription>
                        </div>
                        {githubStats.contributionCalendar && (
                          <Badge className="bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-[10px] rounded-lg px-2.5 py-0.5">
                            Active Sync Horizon
                          </Badge>
                        )}
                      </CardHeader>
                      <CardContent className="pt-6">
                        {githubStats.contributionCalendar ? (
                          <>
                            <div className="w-full overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/80 p-5 
                              [&::-webkit-scrollbar]:h-2 
                              [&::-webkit-scrollbar-track]:bg-transparent 
                              [&::-webkit-scrollbar-thumb]:rounded-full 
                              [&::-webkit-scrollbar-thumb]:bg-zinc-800 
                              hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700">
                              
                              <div className="flex gap-6 pb-2 pt-1 min-w-max">
                                {githubMonths.map((month) => (
                                  <div key={month.key} className="flex flex-col space-y-2.5 shrink-0">
                                    <div className="flex gap-1.5">
                                      {month.weeks.map((week, weekIndex) => (
                                        <div key={`${month.key}-week-${weekIndex}`} className="flex flex-col gap-1.5">
                                          {week.map((day, dayIndex) =>
                                            day ? (
                                              <Tooltip key={day.date}>
                                                <TooltipTrigger asChild>
                                                  <div
                                                    className={`h-3.5 w-3.5 rounded-[4px] transition-all duration-200 hover:scale-125 cursor-crosshair ${getGithubHeatColorLevel(day.contributionCount)}`}
                                                  />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-zinc-900 border border-zinc-800 text-white rounded-lg shadow-xl text-xs px-3 py-1.5">
                                                  <p className="font-semibold text-zinc-200">
                                                    {formatDatePretty(day.date)}
                                                  </p>
                                                  <p className="text-blue-400 font-bold mt-0.5">
                                                    {day.contributionCount} operations logged
                                                  </p>
                                                </TooltipContent>
                                              </Tooltip>
                                            ) : (
                                              <div
                                                key={`${month.key}-empty-${weekIndex}-${dayIndex}`}
                                                className="h-3.5 w-3.5 rounded-[4px] opacity-0"
                                              />
                                            )
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                    <p className="text-center text-[10px] font-bold tracking-widest text-zinc-500 uppercase pt-1 select-none border-t border-zinc-900/60">
                                      {month.label}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-[10px] font-bold tracking-wider text-zinc-500 uppercase mt-4 justify-end bg-zinc-950/30 p-2.5 rounded-xl max-w-max ml-auto border border-zinc-900">
                              <span>Quiescent</span>
                              <div className="flex gap-1">
                                <div className="h-3 w-3 rounded-[3px] bg-zinc-900 border border-zinc-800" />
                                <div className="h-3 w-3 rounded-[3px] bg-blue-950 border border-blue-900/30" />
                                <div className="h-3 w-3 rounded-[3px] bg-blue-800" />
                                <div className="h-3 w-3 rounded-[3px] bg-blue-600" />
                                <div className="h-3 w-3 rounded-[3px] bg-blue-500" />
                              </div>
                              <span>Saturated</span>
                            </div>
                          </>
                        ) : (
                          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-4 text-sm text-zinc-500 font-medium text-center border-dashed">
                            Infrastructure synchronization token key context context missing.
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Matrix Row 3: Active Tree Terminals & Languages */}
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                      <Card className="rounded-3xl border-zinc-900 bg-zinc-950/40 shadow-xl backdrop-blur-md xl:col-span-8">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base font-bold text-white tracking-tight">
                            <FolderGit2 className="h-4 w-4 text-zinc-400" />
                            Active Repositories Matrix
                          </CardTitle>
                          <CardDescription className="text-xs text-zinc-500">
                            Operational codebases tracked based on chronological update triggers.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {(githubStats.recentRepos ?? []).length === 0 ? (
                            <p className="text-xs text-zinc-500 font-medium py-6 text-center">No structural indices detected.</p>
                          ) : (
                            githubStats.recentRepos?.map((repo) => (
                              <a
                                key={repo.name}
                                href={repo.url}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4 transition duration-200 hover:border-zinc-800 hover:bg-zinc-950 group shadow-sm"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="font-bold text-sm text-zinc-100 group-hover:text-blue-400 transition tracking-tight">{repo.name}</p>
                                  <div className="flex items-center gap-3 text-[11px] font-bold text-zinc-500 bg-zinc-900 px-2.5 py-0.5 rounded-lg border border-zinc-800">
                                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" />{repo.stars}</span>
                                    <span className="flex items-center gap-1"><GitFork className="h-3 w-3 text-blue-400" />{repo.forks}</span>
                                  </div>
                                </div>
                                {repo.description && (
                                  <p className="mt-2 line-clamp-2 text-xs text-zinc-400 leading-relaxed font-medium">{repo.description}</p>
                                )}
                                <div className="mt-3.5 flex flex-wrap items-center gap-4 text-[10px] font-bold tracking-wider text-zinc-500 uppercase border-t border-zinc-900/60 pt-2.5">
                                  {repo.language && (
                                    <span className="flex items-center gap-1.5 text-zinc-300">
                                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                                      {repo.language}
                                    </span>
                                  )}
                                  <span>Index Mutation: {formatDatePretty(repo.updatedAt ?? "")}</span>
                                </div>
                              </a>
                            ))
                          )}
                        </CardContent>
                      </Card>

                      <Card className="rounded-3xl border-zinc-900 bg-zinc-950/40 shadow-xl backdrop-blur-md xl:col-span-4">
                        <CardHeader>
                          <CardTitle className="text-base font-bold text-white tracking-tight">Compiling Paradigms</CardTitle>
                          <CardDescription className="text-xs text-zinc-500">
                            Syntactical composition calculated across targeted code architecture trees.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {(githubStats.topLanguages ?? []).length === 0 ? (
                            <p className="text-xs text-zinc-500 font-medium py-6 text-center">No paradigm allocations indices found.</p>
                          ) : (
                            githubStats.topLanguages?.map((item) => {
                              const maxCount = Math.max(...(githubStats.topLanguages ?? []).map((entry) => entry.count), 1);
                              return (
                                <div key={item.language} className="space-y-2 bg-zinc-950/60 p-3 rounded-xl border border-zinc-900">
                                  <div className="flex items-center justify-between text-xs font-bold tracking-wide">
                                    <span className="text-zinc-200">{item.language}</span>
                                    <span className="text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md text-[10px]">{item.count} Nodes</span>
                                  </div>
                                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-900 border border-zinc-800/40">
                                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: `${(item.count / maxCount) * 100}%` }} />
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* Core Analytical Metric Strips */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                  {[
                    { label: "Compiled Implementations", value: totalQuestions, icon: BookOpenText, desc: "Aggregated solved count", border: "border-l-emerald-500" },
                    { label: "GFG Score Allocation", value: gfgStats?.score ?? 0, icon: Code, desc: gfgStats ? `${(gfgStats.totalSolved ?? 0).toLocaleString()} parsed entities` : "Connection unavailable", border: "border-l-teal-500" },
                    { label: "Active Engine Logs", value: totalActiveDays, icon: CalendarDays, desc: "Operational index points", border: "border-l-cyan-500" },
                    { label: "GitHub Trees Connected", value: githubStats?.publicRepos ?? 0, icon: FolderGit2, desc: githubStats?.handle ? `@${githubStats.handle}` : "No profile tied", border: "border-l-blue-500" },
                    { label: "Latest System Pulse", value: lastActiveDate ? formatDatePretty(lastActiveDate) : "Dead", icon: Clock3, desc: "Real-time engine heartbeat", status: isActive, border: "border-l-indigo-500" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Card key={item.label} className={`rounded-2xl border-zinc-900 bg-zinc-950/40 p-5 flex flex-col justify-between hover:border-zinc-800/80 transition duration-200 border-l-2 ${item.border} shadow-lg`}>
                        <div className="flex items-center justify-between space-y-0">
                          <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">{item.label}</span>
                          {item.status !== undefined ? (
                            <span className={`h-2 w-2 rounded-full ${item.status ? "bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/50" : "bg-zinc-600"}`} />
                          ) : (
                            <Icon className="h-4 w-4 text-zinc-600" />
                          )}
                        </div>
                        <div className="mt-5">
                          <p className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">{typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</p>
                          <p className="text-[11px] text-zinc-500 font-semibold mt-1 truncate">{item.desc}</p>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* Main Interactive Graph & Performance Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                  <Card className="rounded-3xl border-zinc-900 bg-zinc-950/40 shadow-xl backdrop-blur-md xl:col-span-8">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900/60 pb-5 gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-base font-bold text-white tracking-tight">
                          <BarChart3 className="h-4 w-4 text-emerald-400" />
                          Algorithmic Execution Over Time
                        </CardTitle>
                        <CardDescription className="text-xs text-zinc-500 mt-1">
                          Evaluated algorithmic tracking across connected compilation platforms.
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-1.5 bg-zinc-950/80 p-1 rounded-xl border border-zinc-900">
                        {[...ratingByPlatform.keys()].map((key) => (
                          <Button
                            key={key}
                            size="sm"
                            variant={ratingPlatform === key ? "default" : "ghost"}
                            className={`h-7 rounded-lg text-xs font-bold px-3 transition ${
                              ratingPlatform === key
                                ? "bg-zinc-800 text-white shadow-inner"
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                            }`}
                            onClick={() => setRatingPlatform(key)}
                          >
                            {formatPlatformName(key)}
                          </Button>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {ratingByPlatform.size === 0 ? (
                        <p className="text-xs text-zinc-500 font-medium py-12 text-center">
                          Analytical progression metrics require system platform configuration.
                        </p>
                      ) : (
                        <div className="h-[340px] w-full text-xs font-medium">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ratingByPlatform.get(ratingPlatform) ?? []} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                              <CartesianGrid stroke="#18181b" strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="label" minTickGap={30} stroke="#4b5563" tickLine={false} axisLine={false} dy={10} />
                              <YAxis stroke="#4b5563" tickLine={false} axisLine={false} dx={-5} />
                              <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                                labelStyle={{ color: '#9ca3af', fontWeight: 'bold' }}
                              />
                              <Legend verticalAlign="top" height={36} iconType="circle" />
                              <Line
                                type="monotone"
                                dataKey="rating"
                                name={`${formatPlatformName(ratingPlatform)} Platform Index`}
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#34d399' }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl border-zinc-900 bg-zinc-950/40 shadow-xl backdrop-blur-md xl:col-span-4">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base font-bold text-white tracking-tight">
                        <TrendingUp className="h-4 w-4 text-zinc-400" />
                        Arena Standing Snapshots
                      </CardTitle>
                      <CardDescription className="text-xs text-zinc-500">
                        Competitive runtime tracking status across verified endpoints.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {competitiveInsights.length === 0 ? (
                        <p className="text-xs text-zinc-500 font-medium py-6 text-center">No standing matrix profiles mapped.</p>
                      ) : (
                        competitiveInsights.map((item) => {
                          const cappedRating = Math.min(Math.max(item.currentRating ?? 0, 0), 4000);
                          const progress = (cappedRating / 4000) * 100;
                          return (
                            <div key={item.platform} className="space-y-3 rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4 hover:border-zinc-800 transition duration-200">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-zinc-100 tracking-tight">{item.platform}</p>
                                <Badge className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-[10px] rounded-md px-2 py-0.5">
                                  {item.rankLabel}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-[11px] font-bold tracking-wide text-zinc-500">
                                <span>Index: <strong className="text-zinc-300">{item.currentRating ?? "Unranked"}</strong></span>
                                <span>Peak: <strong className="text-zinc-400">{item.maxRating ?? "N/A"}</strong></span>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-900 border border-zinc-800/40">
                                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${progress}%` }} />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Analytical Matrix Row 3: Grid Calendar & Section Arrays */}
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                  <Card className="rounded-3xl border-zinc-900 bg-zinc-950/40 shadow-xl backdrop-blur-md xl:col-span-7">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-900/60 pb-4">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-base font-bold text-white tracking-tight">
                          <GitCompareArrows className="h-4 w-4 text-emerald-400" />
                          Compilation Activity Heatmap
                        </CardTitle>
                        <CardDescription className="text-xs text-zinc-500 mt-1">
                          6-month compilation execution history segment wrapper bounds array tracking ({heatmapRangeLabel}).
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1.5 bg-zinc-950/80 p-1 rounded-xl border border-zinc-900">
                        {heatmapPage > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 rounded-lg text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 px-2.5"
                            onClick={() => setHeatmapPage(0)}
                          >
                            Newer
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={!canShowOlderHeatmap}
                          className="h-7 rounded-lg text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 disabled:opacity-40 disabled:hover:bg-transparent px-2.5"
                          onClick={() => setHeatmapPage((prev) => prev + 1)}
                        >
                          Older
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="w-full overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/80 p-5 
                        [&::-webkit-scrollbar]:h-2 
                        [&::-webkit-scrollbar-track]:bg-transparent 
                        [&::-webkit-scrollbar-thumb]:rounded-full 
                        [&::-webkit-scrollbar-thumb]:bg-zinc-800 
                        hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700">
                        
                        <div className="flex gap-6 pb-2 pt-1 min-w-max">
                          {heatmapMonths.map((month) => (
                            <div key={month.key} className="flex flex-col space-y-2.5 shrink-0">
                              <div className="flex gap-1.5">
                                {month.weeks.map((week, weekIndex) => (
                                  <div key={`${month.key}-week-${weekIndex}`} className="flex flex-col gap-1.5">
                                    {week.map((day, dayIndex) =>
                                      day ? (
                                        <Tooltip key={day.date}>
                                          <TooltipTrigger asChild>
                                            <div className={`h-3.5 w-3.5 rounded-[4px] transition-all duration-200 hover:scale-125 cursor-crosshair ${getHeatColorLevel(day.submissions)}`} />
                                          </TooltipTrigger>
                                          <TooltipContent className="bg-zinc-900 border border-zinc-800 text-white rounded-lg shadow-xl text-xs px-3 py-1.5">
                                            <p className="font-semibold text-zinc-200">{formatDatePretty(day.date)}</p>
                                            <p className="text-emerald-400 font-bold mt-0.5">{day.submissions} compiled allocations</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      ) : (
                                        <div
                                          key={`${month.key}-empty-${weekIndex}-${dayIndex}`}
                                          className="h-3.5 w-3.5 rounded-[4px] opacity-0"
                                        />
                                      )
                                    )}
                                  </div>
                                ))}
                              </div>
                              <p className="text-center text-[10px] font-bold tracking-widest text-zinc-500 uppercase pt-1 select-none border-t border-zinc-900/60">
                                {month.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[10px] font-bold tracking-wider text-zinc-500 uppercase mt-4 justify-end bg-zinc-950/30 p-2.5 rounded-xl max-w-max ml-auto border border-zinc-900">
                        <span>Quiescent</span>
                        <div className="flex gap-1">
                          <div className="h-3 w-3 rounded-[3px] bg-zinc-900 border border-zinc-800" />
                          <div className="h-3 w-3 rounded-[3px] bg-emerald-950 border border-emerald-900/30" />
                          <div className="h-3 w-3 rounded-[3px] bg-emerald-800" />
                          <div className="h-3 w-3 rounded-[3px] bg-emerald-500" />
                        </div>
                        <span>Saturated</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl border-zinc-900 bg-zinc-950/40 shadow-xl backdrop-blur-md xl:col-span-5">
                    <CardHeader className="space-y-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-bold text-white tracking-tight">Granular Node Profiles</CardTitle>
                        <div className="flex gap-1 bg-zinc-950/80 p-1 rounded-xl border border-zinc-900">
                          <Button
                            size="sm"
                            variant={topicMode === "dsa" ? "default" : "ghost"}
                            className={`h-7 rounded-lg text-xs font-bold px-3 transition ${
                              topicMode === "dsa"
                                ? "bg-zinc-800 text-white shadow-inner"
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                            }`}
                            onClick={() => setTopicMode("dsa")}
                          >
                            DSA Array
                          </Button>
                          <Button
                            size="sm"
                            variant={topicMode === "competitive" ? "default" : "ghost"}
                            className={`h-7 rounded-lg text-xs font-bold px-3 transition ${
                              topicMode === "competitive"
                                ? "bg-zinc-800 text-white shadow-inner"
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                            }`}
                            onClick={() => setTopicMode("competitive")}
                          >
                            Competitive
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ScrollArea className="h-[250px] pr-2">
                        <div className="space-y-3">
                          {topicMode === "dsa" ? (
                            dsaInsights.length === 0 ? (
                              <p className="text-xs text-zinc-500 font-medium py-6 text-center">No structural verification indices logged.</p>
                            ) : (
                              dsaInsights.map((item) => {
                                const easyDeg = (item.easy / item.total) * 360;
                                const mediumDeg = (item.medium / item.total) * 360;
                                const easyEnd = easyDeg;
                                const mediumEnd = easyDeg + mediumDeg;

                                return (
                                  <div key={item.platform} className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4 flex items-center justify-between gap-6 hover:border-zinc-800 transition duration-200">
                                    <div className="space-y-3 flex-1">
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-zinc-100 tracking-tight">{item.platform}</p>
                                        <Badge className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-bold">
                                          {item.total} Solved Nodes
                                        </Badge>
                                      </div>

                                      {item.hasDifficultySplit ? (
                                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold tracking-wide">
                                          <div className="rounded-xl border border-zinc-900 bg-zinc-950/80 p-2 border-t-2 border-t-emerald-500">
                                            <p className="text-zinc-500 uppercase">Easy</p>
                                            <p className="text-sm font-extrabold text-emerald-400 mt-1">{item.easy}</p>
                                          </div>
                                          <div className="rounded-xl border border-zinc-900 bg-zinc-950/80 p-2 border-t-2 border-t-amber-500">
                                            <p className="text-zinc-500 uppercase">Medium</p>
                                            <p className="text-sm font-extrabold text-amber-400 mt-1">{item.medium}</p>
                                          </div>
                                          <div className="rounded-xl border border-zinc-900 bg-zinc-950/80 p-2 border-t-2 border-t-rose-500">
                                            <p className="text-zinc-500 uppercase">Hard</p>
                                            <p className="text-sm font-extrabold text-rose-400 mt-1">{item.hard}</p>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="rounded-xl border border-zinc-900 bg-zinc-950/80 p-3 text-xs text-zinc-500 font-semibold text-center border-dashed">
                                          Compilation metrics node partition division missing.
                                        </div>
                                      )}
                                    </div>

                                    {item.hasDifficultySplit && (
                                      <div
                                        className="relative h-14 w-14 rounded-full shrink-0 shadow-lg hidden sm:block"
                                        style={{
                                          background: `conic-gradient(#10b981 0deg ${easyEnd}deg, #f59e0b ${easyEnd}deg ${mediumEnd}deg, #ef4444 ${mediumEnd}deg 360deg)`,
                                        }}
                                      >
                                        <div className="absolute inset-[8px] grid place-items-center rounded-full bg-zinc-950 text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
                                          Core
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )
                          ) : competitiveInsights.length === 0 ? (
                            <p className="text-xs text-zinc-500 font-medium py-6 text-center">Structural verification indices missing active target endpoint maps.</p>
                          ) : (
                            competitiveInsights.map((item) => (
                              <div key={item.platform} className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-3.5 flex items-center justify-between text-xs font-semibold hover:border-zinc-800 transition duration-200">
                                <div>
                                  <p className="font-bold text-zinc-200 tracking-tight">{item.platform}</p>
                                  <p className="text-[11px] text-zinc-500 mt-1">Saturated: {item.totalSolved} entities</p>
                                </div>
                                <Badge className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-[10px]">
                                  Arena Position: {item.rankLabel}
                                </Badge>
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Profile Card Mainframe Presentation Layer */}
      {showProfileCard && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-zinc-950/80 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
          <div
            id="profile-card"
            className="relative w-[360px] rounded-3xl bg-zinc-900 text-zinc-50 p-6 shadow-2xl border border-zinc-800 overflow-hidden"
          >
            {/* Ambient card layer context */}
            <div className="absolute top-[-100px] left-[-50px] w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-100px] right-[-50px] w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <button
              className="absolute top-4 right-4 bg-zinc-800/80 hover:bg-zinc-800 p-2 rounded-xl text-zinc-400 hover:text-white border border-zinc-700/50 transition"
              onClick={() => setShowProfileCard(false)}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center mt-4">
              <div className="h-20 w-20 rounded-full overflow-hidden border-[3px] border-emerald-500 shadow-xl shadow-emerald-500/10">
                <img
                  src={githubStats?.avatar || "/placeholder.png"}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-lg font-bold text-white tracking-tight">{githubStats?.name || "Verified Operator"}</p>
                <p className="text-xs font-semibold text-emerald-400 mt-0.5">@{githubStats?.handle || "anonymous"}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-center">
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-3.5">
                <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Compiled Tree</p>
                <p className="text-2xl font-extrabold text-white mt-1">{totalQuestions}</p>
              </div>
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-3.5">
                <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Logged Pulses</p>
                <p className="text-2xl font-extrabold text-white mt-1">{totalActiveDays}</p>
              </div>
            </div>

            <div className="mt-5 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4">
              <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase text-center mb-3">Identity Node Paths</p>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {profileLinks.length > 0 ? (
                  profileLinks.map((link) => (
                    <a
                      key={`${link.platform}-${link.handle}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-2.5 text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800"
                    >
                      <span className="min-w-0 flex flex-col">
                        <span className="text-xs font-bold text-white truncate">{link.label}</span>
                        <span className="text-[10px] text-zinc-500 truncate mt-0.5">@{link.handle}</span>
                      </span>
                      <ExternalLink className="h-3 w-3 text-zinc-500 shrink-0" />
                    </a>
                  ))
                ) : (
                  <p className="text-center text-[11px] text-zinc-600 font-medium col-span-2 py-2">
                    No active node keys detected.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3 border-t border-zinc-800/80 pt-4">
              <Button
                variant="secondary"
                className="flex-1 rounded-xl bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 font-semibold"
                onClick={handleDownloadCard}
              >
                Download PNG
              </Button>
              <Button
                variant="secondary"
                className="flex-1 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold"
                onClick={handleNativeShare}
              >
                Share Node
              </Button>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
};