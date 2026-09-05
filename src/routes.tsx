import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CreateRecipe } from './pages/CreateRecipe';
import { ViewRecipe } from './pages/ViewRecipe';
import { ErrorPage } from './pages/ErrorPage';
import { ViewBake } from './pages/ViewBake';
import { RecipeListPage } from './pages/RecipeListPage';
import { BakeListPage } from './pages/BakeListPage';
import { AboutUsPage } from './pages/AboutUsPage';

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
    path: '/recipe/:id',
    element: <ViewRecipe />,
  },
  {
    path: '/bakes',
    element: <BakeListPage />,
  },
  {
    path: '/bakes/:recipeId',
    element: <BakeListPage />,
  },
  {
    path: '/recipes',
    element: <RecipeListPage />,
  },
  {
    path: '/bake/:bakeId',
    element: <ViewBake />,
  },
  {
    path: '/aboutus',
    element: <AboutUsPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
];

export const router = createBrowserRouter(routes);