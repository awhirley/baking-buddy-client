import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CreateRecipe } from './pages/CreateRecipe';
import { ViewRecipe } from './pages/ViewRecipe';
import { ErrorPage } from './pages/ErrorPage';
import { ViewBake } from './pages/ViewBake';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/create',
    element: <CreateRecipe />,
  },
  {
    path: '/view/:id',
    element: <ViewRecipe />,
  },
  {
    path: '/bake/:bakeId',
    element: <ViewBake />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
];

export const router = createBrowserRouter(routes);