"use client";

import { useMemo, useState } from "react";
import type { FocusEvent } from "react";
import { useRouter } from "next/navigation";

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
      setError(searchError instanceof Error ? searchError.message : "Unknown error");
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
      setError(submitError instanceof Error ? submitError.message : "Unknown error");
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
      <Card className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Search meals & favorites</h2>
          <p className="text-sm text-slate-600">Find previous meals and log them instantly.</p>
        </div>

        <div className="grid gap-2 md:grid-cols-[1fr_auto]">
          <Input
            value={query}
            onChange={(event) => void onSearchChange(event.target.value)}
            placeholder="Search your meals..."
          />
          <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={(event) => void onToggleFavoritesOnly(event.target.checked)}
            />
            Favorites only
          </label>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {isSearchActive && !shouldShowResults ? (
          <p className="text-sm text-slate-500">Search your meals...</p>
        ) : null}
        {shouldRenderSearchContent && !loading && results.length === 0 ? (
          <p className="text-sm text-slate-500">No meals found.</p>
        ) : null}

        {shouldRenderSearchContent && loading ? (
          <p className="text-sm text-slate-500">Searching...</p>
        ) : null}

        <div className="space-y-2">
          {shouldRenderSearchContent
            ? results.map((result) => {
              const itemKey = `${result.source}-${result.id}`;
              const isEditing = editingKey === itemKey;
              const isLogging = loggingKey === itemKey;

              return (
                <div key={itemKey} className="rounded-xl border border-slate-200 bg-white/80 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">{result.title}</p>
                      <p className="text-xs text-slate-500">
                        {result.kcal} kcal | P {result.protein_g}g | C {result.carbs_g}g | F {result.fat_g}g
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-lg leading-none"
                      aria-label={result.is_favorite ? "Remove favorite" : "Add favorite"}
                      onClick={() => void toggleFavorite(result)}
                    >
                      {result.is_favorite ? "\u2605" : "\u2606"}
                    </button>
                  </div>

                  {isEditing && editDraft ? (
                    <div className="mt-2 space-y-2">
                      <Input
                        value={editDraft.title}
                        onChange={(event) =>
                          setEditDraft((current) =>
                            current ? { ...current, title: event.target.value } : current,
                          )}
                      />
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                        <Input
                          type="number"
                          value={editDraft.kcal}
                          onChange={(event) =>
                            setEditDraft((current) =>
                              current ? { ...current, kcal: event.target.value } : current,
                            )}
                        />
                        <Input
                          type="number"
                          value={editDraft.protein_g}
                          onChange={(event) =>
                            setEditDraft((current) =>
                              current ? { ...current, protein_g: event.target.value } : current,
                            )}
                        />
                        <Input
                          type="number"
                          value={editDraft.carbs_g}
                          onChange={(event) =>
                            setEditDraft((current) =>
                              current ? { ...current, carbs_g: event.target.value } : current,
                            )}
                        />
                        <Input
                          type="number"
                          value={editDraft.fat_g}
                          onChange={(event) =>
                            setEditDraft((current) =>
                              current ? { ...current, fat_g: event.target.value } : current,
                            )}
                        />
                      </div>
                      <select
                        className="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-800 outline-none ring-blue-200 focus:ring-2"
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

                  <div className="mt-2 flex gap-2">
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
                      {isEditing ? "Cancel" : "Edit"}
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
