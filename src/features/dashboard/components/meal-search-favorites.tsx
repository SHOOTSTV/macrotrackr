"use client";

import { useMemo, useState } from "react";
import type { FocusEvent } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { getAuthHeaders } from "@/src/lib/auth/client-auth";
import type { MealSearchResult, MealType } from "@/src/types/meal";

interface SearchResponse {
  data: MealSearchResult[];
}

interface EditDraft {
  title: string;
  kcal: string;
  protein_g: string;
  carbs_g: string;
  fat_g: string;
  meal_type: MealType;
}

const selectClassName =
  "w-full rounded-[18px] border border-black/8 bg-white px-3.5 py-2.5 text-sm text-[#151515] outline-none ring-[#d8e2d6] transition focus:ring-2";

function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-[18px] bg-[#ddd6ca]/80 ${className ?? ""}`} />;
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-2.5">
      <div className="rounded-[22px] border border-black/8 bg-[#f8f4ee] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-14 rounded-full bg-white/75" />
              <Skeleton className="h-6 w-20 rounded-full bg-white/75" />
            </div>
            <Skeleton className="h-6 w-44 rounded-[14px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full bg-white/80" />
            <Skeleton className="h-10 w-24 rounded-full bg-white/80" />
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Skeleton className="h-10 w-full rounded-xl bg-white/75" />
          <Skeleton className="h-10 w-full rounded-xl bg-white/75" />
          <Skeleton className="h-10 w-full rounded-xl bg-white/75" />
          <Skeleton className="h-10 w-full rounded-xl bg-white/75" />
        </div>
      </div>

      <div className="rounded-[22px] border border-black/8 bg-[#f8f4ee] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full bg-white/75" />
              <Skeleton className="h-6 w-24 rounded-full bg-white/75" />
            </div>
            <Skeleton className="h-6 w-52 rounded-[14px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full bg-white/80" />
            <Skeleton className="h-10 w-24 rounded-full bg-white/80" />
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Skeleton className="h-10 w-full rounded-xl bg-white/75" />
          <Skeleton className="h-10 w-full rounded-xl bg-white/75" />
          <Skeleton className="h-10 w-full rounded-xl bg-white/75" />
          <Skeleton className="h-10 w-full rounded-xl bg-white/75" />
        </div>
      </div>
    </div>
  );
}

function toDraft(result: MealSearchResult): EditDraft {
  return {
    title: result.title,
    kcal: String(result.kcal),
    protein_g: String(result.protein_g),
    carbs_g: String(result.carbs_g),
    fat_g: String(result.fat_g),
    meal_type: result.meal_type,
  };
}

function FavoriteIcon({ active }: { active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

export function MealSearchFavorites() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [results, setResults] = useState<MealSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [loggingKey, setLoggingKey] = useState<string | null>(null);

  const shouldShowResults = useMemo(
    () => query.trim().length > 0 || favoritesOnly,
    [favoritesOnly, query],
  );
  const shouldRenderSearchContent = isSearchActive && shouldShowResults;

  function onSearchSectionBlur(event: FocusEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget;

    if (nextTarget && event.currentTarget.contains(nextTarget as Node)) {
      return;
    }

    setIsSearchActive(false);
  }

  async function fetchResults(nextQuery: string, nextFavoritesOnly: boolean) {
    setError(null);
    setLoading(true);

    try {
      const authHeaders = await getAuthHeaders();
      const params = new URLSearchParams({
        q: nextQuery,
        favoritesOnly: String(nextFavoritesOnly),
        limit: "20",
      });

      const response = await fetch(`/api/meals/search?${params.toString()}`, {
        headers: {
          ...authHeaders,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to search meals");
      }

      const body = (await response.json()) as SearchResponse;
      setResults(body.data);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite(result: MealSearchResult) {
    try {
      const authHeaders = await getAuthHeaders();
      if (result.is_favorite) {
        await fetch(`/api/favorites/${result.id}`, {
          method: "DELETE",
          headers: {
            ...authHeaders,
          },
        });
      } else if (result.source_meal_id) {
        await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify({ meal_id: result.source_meal_id }),
        });
      }

      await fetchResults(query, favoritesOnly);
    } catch {
      setError("Failed to update favorite.");
    }
  }

  async function logNow(result: MealSearchResult, itemKey: string, override?: EditDraft) {
    setError(null);

    try {
      setLoggingKey(itemKey);
      const authHeaders = await getAuthHeaders();
      const payload = {
        source: result.source,
        favorite_id: result.source === "favorite" ? result.id : undefined,
        source_meal_id: result.source_meal_id,
        title: override?.title ?? result.title,
        kcal: Number(override?.kcal ?? result.kcal),
        protein_g: Number(override?.protein_g ?? result.protein_g),
        carbs_g: Number(override?.carbs_g ?? result.carbs_g),
        fat_g: Number(override?.fat_g ?? result.fat_g),
        meal_type: override?.meal_type ?? result.meal_type,
      };

      const response = await fetch("/api/meals/log-from-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to log meal");
      }

      setEditingKey(null);
      setEditDraft(null);
      router.refresh();
      await fetchResults(query, favoritesOnly);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unexpected error");
    } finally {
      setLoggingKey(null);
    }
  }

  async function onSearchChange(nextQuery: string) {
    setQuery(nextQuery);
    await fetchResults(nextQuery, favoritesOnly);
  }

  async function onToggleFavoritesOnly(nextValue: boolean) {
    setFavoritesOnly(nextValue);
    await fetchResults(query, nextValue);
  }

  return (
    <div onFocusCapture={() => setIsSearchActive(true)} onBlurCapture={onSearchSectionBlur}>
      <Card className="space-y-4">
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">
            Library
          </p>
          <h2 className="text-2xl font-medium tracking-[-0.05em] text-[#151515]">
            Search meals & favorites
          </h2>
          <p className="max-w-sm text-sm leading-7 text-[#6f685f]">
            Find something you already ate, tweak it if needed, and log it again without friction.
          </p>
        </div>

        <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
          <Input
            className="h-12 rounded-[18px] bg-[#f8f4ee]"
            value={query}
            onChange={(event) => void onSearchChange(event.target.value)}
            placeholder="Search your meals..."
          />
          <label className="inline-flex items-center gap-2 rounded-[18px] border border-black/8 bg-white/72 px-3 py-3 text-sm text-[#4f4a43]">
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={(event) => void onToggleFavoritesOnly(event.target.checked)}
            />
            Favorites only
          </label>
        </div>

        {error ? <p className="text-sm text-[#8a3d30]">{error}</p> : null}

        {isSearchActive && !shouldShowResults ? (
          <div className="rounded-[20px] border border-dashed border-black/10 bg-[#f8f4ee] px-4 py-5 text-sm text-[#6f685f]">
            Start typing to search your meal library.
          </div>
        ) : null}
        {shouldRenderSearchContent && !loading && results.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-black/10 bg-[#f8f4ee] px-4 py-5 text-sm text-[#6f685f]">
            No meals found for this search.
          </div>
        ) : null}

        {shouldRenderSearchContent && loading ? <SearchResultsSkeleton /> : null}

        <div className="space-y-2.5">
          {shouldRenderSearchContent
            ? results.map((result) => {
              const itemKey = `${result.source}-${result.id}`;
              const isEditing = editingKey === itemKey;
              const isLogging = loggingKey === itemKey;

              return (
                <div key={itemKey} className="rounded-[22px] border border-black/8 bg-[#f8f4ee] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-[#151515]">{result.title}</p>
                        <Badge>{result.meal_type}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-[#edf1ea] px-3 py-1.5 text-[#365141]">kcal {result.kcal}</span>
                        <span className="rounded-full bg-[#e4ece9] px-3 py-1.5 text-[#44747b]">protein {result.protein_g}g</span>
                        <span className="rounded-full bg-[#f2eadb] px-3 py-1.5 text-[#7a5b33]">carbs {result.carbs_g}g</span>
                        <span className="rounded-full bg-[#ece7f0] px-3 py-1.5 text-[#66557e]">fat {result.fat_g}g</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`rounded-full border border-black/8 p-2 transition ${result.is_favorite ? "bg-[#151515] text-[#f4efe7]" : "bg-white text-[#6f685f] hover:bg-[#f3ede5]"}`}
                      aria-label={result.is_favorite ? "Remove favorite" : "Add favorite"}
                      onClick={() => void toggleFavorite(result)}
                    >
                      <FavoriteIcon active={result.is_favorite} />
                    </button>
                  </div>

                  {isEditing && editDraft ? (
                    <div className="mt-3 space-y-3 rounded-[20px] border border-black/6 bg-white/70 p-3.5">
                      <Input
                        value={editDraft.title}
                        onChange={(event) =>
                          setEditDraft((current) =>
                            current ? { ...current, title: event.target.value } : current,
                          )}
                        className="bg-white"
                      />
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                        <Input
                          type="number"
                          value={editDraft.kcal}
                          onChange={(event) =>
                            setEditDraft((current) =>
                              current ? { ...current, kcal: event.target.value } : current,
                            )}
                          className="bg-white"
                        />
                        <Input
                          type="number"
                          value={editDraft.protein_g}
                          onChange={(event) =>
                            setEditDraft((current) =>
                              current ? { ...current, protein_g: event.target.value } : current,
                            )}
                          className="bg-white"
                        />
                        <Input
                          type="number"
                          value={editDraft.carbs_g}
                          onChange={(event) =>
                            setEditDraft((current) =>
                              current ? { ...current, carbs_g: event.target.value } : current,
                            )}
                          className="bg-white"
                        />
                        <Input
                          type="number"
                          value={editDraft.fat_g}
                          onChange={(event) =>
                            setEditDraft((current) =>
                              current ? { ...current, fat_g: event.target.value } : current,
                            )}
                          className="bg-white"
                        />
                      </div>
                      <select
                        className={selectClassName}
                        value={editDraft.meal_type}
                        onChange={(event) =>
                          setEditDraft((current) =>
                            current
                              ? {
                                  ...current,
                                  meal_type: event.target.value as MealType,
                                }
                              : current,
                          )}
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                      </select>
                    </div>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      disabled={isLogging}
                      className={isLogging ? "scale-[0.98] opacity-80" : undefined}
                      onClick={() =>
                        void logNow(
                          result,
                          itemKey,
                          isEditing ? (editDraft ?? undefined) : undefined,
                        )}
                    >
                      {isLogging ? "Logging..." : "Log now"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        if (isEditing) {
                          setEditingKey(null);
                          setEditDraft(null);
                          return;
                        }

                        setEditingKey(itemKey);
                        setEditDraft(toDraft(result));
                      }}
                    >
                      {isEditing ? "Cancel" : "Edit before logging"}
                    </Button>
                  </div>
                </div>
              );
            })
            : null}
        </div>
      </Card>
    </div>
  );
}
