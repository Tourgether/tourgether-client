import { RouteCard } from "./RouteCard";
import { Route } from "../../types/route";

interface RouteCardListProps {
  routes: Route[];
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  destName: string;
  id: string;
}

export function RouteCardList({ routes, start, end, destName, id }: RouteCardListProps) {
  return (
    <div>
      {routes.map((route, index) => (
        <RouteCard key={index} route={route} start={start} end={end} destName={destName} id={id}/>
      ))}
    </div>
  );
}
