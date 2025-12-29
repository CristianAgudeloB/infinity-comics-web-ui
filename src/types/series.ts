export interface Series {
  _id: string;
  name: string;
  publisher: string;
  startYear: number;
  endYear?: number;
  coverUrl: string;
  views?: number;
  hasOnlineRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
