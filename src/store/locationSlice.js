import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildApiUrl } from "@/lib/apiConfig";

const CACHE_TTL_MS = 30 * 60 * 1000;

function normalizeLocations(rawItems) {
  const seen = new Set();
  const out = [];

  for (const item of rawItems || []) {
    const value = String(item || "").trim();
    if (!value) continue;
    const dedupeKey = value.toLowerCase();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    out.push(value);
  }

  return out.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
}

function toTitleCase(value) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase();
      if (lower === "&") return "&";
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function normalizeStateName(raw) {
  const cleaned = String(raw || "")
    .replace(/^[,\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "";

  const lowered = cleaned.toLowerCase();
  const aliases = {
    delhi: "Delhi",
    gujrat: "Gujarat",
    kerela: "Kerala",
    himachal: "Himachal Pradesh",
    "himachal prades": "Himachal Pradesh",
    arunanchal: "Arunachal Pradesh",
    meghalya: "Meghalaya",
    maharastra: "Maharashtra",
    "jammu and kashmir": "Jammu & Kashmir",
    srilanka: "Sri Lanka",
    tamilnadu: "Tamil Nadu",
    uttrakhand: "Uttarakhand",
    leh: "Ladakh",
    "leh ladakh": "Ladakh",
  };

  if (aliases[lowered]) return aliases[lowered];
  return toTitleCase(cleaned);
}

function normalizeStates(rawItems) {
  const seen = new Set();
  const out = [];

  for (const item of rawItems || []) {
    const normalized = normalizeStateName(item);
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(normalized);
  }

  return out.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
}

export const fetchHotelCities = createAsyncThunk(
  "locations/fetchHotelCities",
  async () => {
    const response = await fetch(
      buildApiUrl("api/packagemaker//get-packagemaker-hotel-cities"),
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch cities (${response.status})`);
    }

    const payload = await response.json();
    if (!payload?.success || !Array.isArray(payload.data)) {
      throw new Error("Invalid city API response");
    }

    return normalizeLocations(payload.data);
  },
  {
    condition: (_, { getState }) => {
      const { locations } = getState();
      if (!locations) return true;
      if (locations.status === "loading") return false;
      if (!locations.lastFetched) return true;
      return Date.now() - locations.lastFetched > CACHE_TTL_MS;
    },
  }
);

export const fetchHotelStates = createAsyncThunk(
  "locations/fetchHotelStates",
  async () => {
    const response = await fetch(
      buildApiUrl("api/packagemaker//get-packagemaker-hotel-states"),
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch states (${response.status})`);
    }

    const payload = await response.json();
    if (!payload?.success || !Array.isArray(payload.data)) {
      throw new Error("Invalid states API response");
    }

    return normalizeStates(payload.data);
  },
  {
    condition: (_, { getState }) => {
      const { locations } = getState();
      if (!locations) return true;
      if (locations.statesStatus === "loading") return false;
      if (!locations.statesLastFetched) return true;
      return Date.now() - locations.statesLastFetched > CACHE_TTL_MS;
    },
  }
);

const locationSlice = createSlice({
  name: "locations",
  initialState: {
    cities: [],
    status: "idle",
    error: null,
    lastFetched: null,
    states: [],
    statesStatus: "idle",
    statesError: null,
    statesLastFetched: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotelCities.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHotelCities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cities = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchHotelCities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Unable to load locations";
      })
      .addCase(fetchHotelStates.pending, (state) => {
        state.statesStatus = "loading";
        state.statesError = null;
      })
      .addCase(fetchHotelStates.fulfilled, (state, action) => {
        state.statesStatus = "succeeded";
        state.states = action.payload;
        state.statesLastFetched = Date.now();
      })
      .addCase(fetchHotelStates.rejected, (state, action) => {
        state.statesStatus = "failed";
        state.statesError = action.error?.message || "Unable to load states";
      });
  },
});

export const locationsReducer = locationSlice.reducer;
