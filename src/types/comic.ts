export interface Comic {
  _id: string;
  title: string;
  coverUrl: string;
  downloadUrls: string[];
  pages: string[];
  onlineRead: boolean;
  seriesId: string;
  createdAt?: string;
  updatedAt?: string;
}
