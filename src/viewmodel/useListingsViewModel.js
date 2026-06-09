// src/viewmodel/useListingsViewModel.js
// ─────────────────────────────────────────────
// VIEWMODEL LAYER — owns real-time Firestore subscription for listings,
// plus search / filter / sort logic.
// Calls model/services. Exposes clean state to the View.
// No Firebase imports. No JSX. No UI rendering.
// ─────────────────────────────────────────────

import { useState, useEffect, useMemo } from "react";
import { subscribeToListings } from "../model/services/listings.service";

export function useListingsViewModel() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // ── Search / filter / sort state ────────────────────────────────────────
  const [query, setQuery]           = useState("");
  const [category, setCategory]     = useState("all");
  const [sort, setSort]             = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToListings(
      (data) => {
        setListings(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("[ListingsVM]", err.message);
        setError("Could not load listings. Check your internet connection.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const trimmed = query.trim().toLowerCase();

  const filteredListings = useMemo(() => {
    let out = listings;

    if (category !== "all") {
      out = out.filter((l) => (l.category || "other") === category);
    }

    if (trimmed) {
      out = out.filter((l) => {
        const haystack = [
          l.title, l.address, l.city, l.description, l.category, l.ownerName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(trimmed);
      });
    }

    if (sort === "priceAsc") {
      out = [...out].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sort === "priceDesc") {
      out = [...out].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }

    return out;
  }, [listings, trimmed, category, sort]);

  const filtersActive = category !== "all" || sort !== "newest";

  return {
    listings,
    filteredListings,
    loading,
    error,
    // search / filter / sort
    query,        setQuery,
    category,     setCategory,
    sort,         setSort,
    filtersOpen,  setFiltersOpen,
    filtersActive,
    trimmed,
  };
}
