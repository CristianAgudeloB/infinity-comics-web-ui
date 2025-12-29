import { api } from "./axios";
import type { Series } from "../types/series";
import type { Comic } from "../types/comic";

export const getSeries = async (publisher?: string): Promise<Series[]> => {
  const params = publisher ? { publisher } : {};
  const res = await api.get("/series", { params });
  return res.data;
};

export const getSeriesById = async (id: string): Promise<Series> => {
  const res = await api.get(`/series/${id}`);
  return res.data;
};

export const getComicsBySeries = async (seriesId: string): Promise<Comic[]> => {
  const res = await api.get(`/series/${seriesId}/comics`);
  return res.data;
};

export const searchSeries = async (query: string): Promise<Series[]> => {
  const res = await api.get("/series/search", { params: { q: query } });
  return res.data;
};

export const incrementSeriesViews = async (id: string): Promise<void> => {
  await api.post(`/series/${id}/views`);
};

export const getTopSeries = async (limit: number = 10): Promise<Series[]> => {
  const res = await api.get("/series/top", { params: { limit } });
  return res.data;
};
