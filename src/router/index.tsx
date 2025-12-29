import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import SeriesDetail from "../pages/SeriesDetail";
import PublisherPage from "../pages/PublisherPage";
import RecentComicsPage from "../pages/RecentComicsPage";
import ComicDetail from "../pages/ComicDetail";
import ComicReader from "../pages/ComicReader";
import ElCorpsPage from "../pages/ElCorpsPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/series/:id", element: <SeriesDetail /> },
      { path: "/comic/:id", element: <ComicDetail /> },
      { path: "/comic/:id/read", element: <ComicReader /> },
      { path: "/marvel", element: <PublisherPage /> },
      { path: "/dc", element: <PublisherPage /> },
      { path: "/image", element: <PublisherPage /> },
      { path: "/indie", element: <PublisherPage /> },
      { path: "/manga", element: <PublisherPage /> },
      { path: "/novedades", element: <RecentComicsPage /> },
      { path: "/el-corps", element: <ElCorpsPage /> },
      { path: "/editorial/:publisher", element: <PublisherPage /> }
    ]
  }
]);
