import { Card, CardContent, CardHeader, CardTitle } from "./../ui/card";
import { P } from "./../ui/typography";

export function SearchAndFilterBar() {
  return (
    <Card className="rounded-sm bg-primary">
      <CardHeader>
        <CardTitle>Search & Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <P>Tags, Ratings, Search bar</P>
      </CardContent>
    </Card>
  );
}