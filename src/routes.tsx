import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CreateRecipe } from './pages/CreateRecipe';
import { ViewRecipe } from './pages/ViewRecipe';

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
    path: '/view',
    element: <ViewRecipe />,
  }
];

export const router = createBrowserRouter(routes);