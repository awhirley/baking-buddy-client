import { useParams } from 'react-router-dom';

import { SearchAndFilterBar } from "./SearchAndFilterBar"
import { RecipeList } from './RecipeList';

export function Body() {
  const { showSideBar } = useParams(); 

  if (showSideBar === 'true') {
    return (
      <div className="grid grid-cols-4 gap-4 w-300">
        <SearchAndFilterBar />
        <div className="col-span-3">
          <RecipeList />
        </div>
      </div>
    );
  }

  return (
    <div className="w-300">
      <RecipeList />
    </div>
  );
}
