import { api } from "./axios";
import type { Comic } from "../types/comic";

export const getComicById = async (id: string): Promise<Comic> => {
  const res = await api.get(`/comics/${id}`);
  return res.data;
};

export const getAllComics = async (): Promise<Comic[]> => {
  const res = await api.get("/comics");
  return res.data;
};

// Nota: Estos endpoints no existen en el backend, pero los mantenemos
// para uso futuro. Por ahora retornan arrays vacíos o usan getAllComics
export const getFeaturedComics = async (): Promise<Comic[]> => {
  // Por ahora, obtener los más recientes como "destacados"
  const res = await api.get("/comics");
  const comics = res.data as Comic[];
  // Retornar los primeros 12 más recientes (ordenados por createdAt en el backend)
  return comics.slice(0, 12);
};

export const getRecentComics = async (limit: number = 20): Promise<Comic[]> => {
  const res = await api.get("/comics", { params: { limit } });
  return res.data;
};

export const searchComics = async (query: string): Promise<Comic[]> => {
  // El backend no tiene búsqueda de comics, así que filtramos en el frontend
  const res = await api.get("/comics");
  const comics = res.data as Comic[];
  const lowerQuery = query.toLowerCase();
  return comics.filter(
    (comic) =>
      comic.title.toLowerCase().includes(lowerQuery)
  );
};


