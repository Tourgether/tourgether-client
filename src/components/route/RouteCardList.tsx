// src/components/route/RouteCardList.tsx
import { RouteCard } from "./RouteCard";
import { Route } from "../../types/route";

interface RouteCardListProps {
  routes: Route[];
}

export function RouteCardList({ routes }: RouteCardListProps) {
  return (
    <div>
      {routes.map((route, index) => (
        <RouteCard key={index} route={route} />
      ))}
    </div>
  );
}
