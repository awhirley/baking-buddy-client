import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CreateRecipe } from './pages/CreateRecipe';
import { ViewRecipe } from './pages/ViewRecipe';
import { ErrorPage } from './pages/ErrorPage';

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
    path: '*',
    element: <ErrorPage />,
  },
];

export const router = createBrowserRouter(routes);