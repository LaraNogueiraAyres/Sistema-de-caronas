import { MapPin, Navigation } from "lucide-react";
import type { RouteOption } from "../types/route";

interface RouteMapProps {
  routes: RouteOption[];
  selectedRoute: string | null;
  onSelectRoute: (routeId: string) => void;
}

export function RouteMap({ routes, selectedRoute, onSelectRoute }: RouteMapProps) {
  const getRouteColor = (routeId: string, isSelected: boolean) => {
    const route = routes.find((r) => r.id === routeId);
    if (!route) return "#CBD5E1";
    
    if (isSelected) {
      return "#1D3557"; // Navy blue for selected
    }
    
    // Different colors for different routes
    if (route.isFastest) return "#10B981"; // Green
    if (route.isShortest) return "#3B82F6"; // Blue
    return "#8B5CF6"; // Purple
  };

  const getRouteOpacity = (routeId: string) => {
    if (!selectedRoute) return 1;
    return routeId === selectedRoute ? 1 : 0.3;
  };

  const getRouteStrokeWidth = (routeId: string) => {
    return routeId === selectedRoute ? 8 : 5;
  };

  return (
    <div className="bg-background rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Map Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4" />
          <span className="text-sm font-medium">Visualização das rotas</span>
        </div>
        <span className="text-xs opacity-75">Toque para selecionar</span>
      </div>

      {/* SVG Map */}
      <div className="relative bg-background aspect-[4/3]">
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Map Background Grid */}
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#grid)" />

          {/* Decorative map elements (streets, areas) */}
          <rect x="20" y="40" width="120" height="80" fill="#E8EFF5" rx="4" opacity="0.5" />
          <rect x="260" y="180" width="100" height="70" fill="#E8EFF5" rx="4" opacity="0.5" />
          <rect x="150" y="120" width="90" height="60" fill="#D1E3F0" rx="4" opacity="0.4" />
          
          {/* Small streets */}
          <line x1="0" y1="150" x2="400" y2="150" stroke="#CBD5E1" strokeWidth="1.5" opacity="0.3" />
          <line x1="200" y1="0" x2="200" y2="300" stroke="#CBD5E1" strokeWidth="1.5" opacity="0.3" />

          {/* Route 1 - Via Av. Principal (Fast/Green or Selected) */}
          <g
            onClick={() => onSelectRoute(routes[0].id)}
            className="cursor-pointer transition-all"
            style={{ opacity: getRouteOpacity(routes[0].id) }}
          >
            <path
              d="M 50 50 Q 150 80, 250 100 T 350 150"
              fill="none"
              stroke={getRouteColor(routes[0].id, selectedRoute === routes[0].id)}
              strokeWidth={getRouteStrokeWidth(routes[0].id)}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
            {/* Route waypoint markers */}
            <circle cx="150" cy="80" r="4" fill="white" stroke={getRouteColor(routes[0].id, selectedRoute === routes[0].id)} strokeWidth="2" />
            <circle cx="250" cy="100" r="4" fill="white" stroke={getRouteColor(routes[0].id, selectedRoute === routes[0].id)} strokeWidth="2" />
          </g>

          {/* Route 2 - Via Centro (Short/Blue or Selected) */}
          <g
            onClick={() => onSelectRoute(routes[1].id)}
            className="cursor-pointer transition-all"
            style={{ opacity: getRouteOpacity(routes[1].id) }}
          >
            <path
              d="M 50 50 L 120 90 L 200 120 L 280 135 L 350 150"
              fill="none"
              stroke={getRouteColor(routes[1].id, selectedRoute === routes[1].id)}
              strokeWidth={getRouteStrokeWidth(routes[1].id)}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
            {/* Route waypoint markers */}
            <circle cx="120" cy="90" r="4" fill="white" stroke={getRouteColor(routes[1].id, selectedRoute === routes[1].id)} strokeWidth="2" />
            <circle cx="200" cy="120" r="4" fill="white" stroke={getRouteColor(routes[1].id, selectedRoute === routes[1].id)} strokeWidth="2" />
            <circle cx="280" cy="135" r="4" fill="white" stroke={getRouteColor(routes[1].id, selectedRoute === routes[1].id)} strokeWidth="2" />
          </g>

          {/* Route 3 - Via Litoral (Scenic/Purple or Selected) */}
          <g
            onClick={() => onSelectRoute(routes[2].id)}
            className="cursor-pointer transition-all"
            style={{ opacity: getRouteOpacity(routes[2].id) }}
          >
            <path
              d="M 50 50 Q 100 120, 150 180 Q 250 220, 350 150"
              fill="none"
              stroke={getRouteColor(routes[2].id, selectedRoute === routes[2].id)}
              strokeWidth={getRouteStrokeWidth(routes[2].id)}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
            {/* Route waypoint markers */}
            <circle cx="100" cy="120" r="4" fill="white" stroke={getRouteColor(routes[2].id, selectedRoute === routes[2].id)} strokeWidth="2" />
            <circle cx="150" cy="180" r="4" fill="white" stroke={getRouteColor(routes[2].id, selectedRoute === routes[2].id)} strokeWidth="2" />
            <circle cx="250" cy="220" r="4" fill="white" stroke={getRouteColor(routes[2].id, selectedRoute === routes[2].id)} strokeWidth="2" />
          </g>

          {/* Origin Marker */}
          <g>
            <circle cx="50" cy="50" r="12" fill="#1D3557" />
            <circle cx="50" cy="50" r="6" fill="white" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="#1D3557" strokeWidth="2" opacity="0.2" />
          </g>

          {/* Destination Marker */}
          <g>
            <path
              d="M 350 150 L 350 130 Q 350 125, 345 125 Q 340 125, 340 130 L 340 150 Q 345 155, 350 150 Z"
              fill="#E63946"
            />
            <circle cx="345" cy="130" r="3" fill="white" />
            <circle cx="350" cy="150" r="18" fill="none" stroke="#E63946" strokeWidth="2" opacity="0.2" />
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-background/95 backdrop-blur-sm rounded-lg shadow-md p-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-gray-700 font-medium">Origem</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="w-3 h-3 text-accent" />
            <span className="text-gray-700 font-medium">Destino</span>
          </div>
        </div>

        {/* Route Legend */}
        <div className="absolute bottom-3 right-3 bg-background/95 backdrop-blur-sm rounded-lg shadow-md p-3 space-y-1.5">
          {routes.map((route, index) => (
            <button
              key={route.id}
              onClick={() => onSelectRoute(route.id)}
              className={`flex items-center gap-2 text-xs transition-all hover:bg-gray-50 px-2 py-1 rounded ${
                selectedRoute === route.id ? 'bg-gray-50' : ''
              }`}
            >
              <div
                className="w-4 h-1.5 rounded-full"
                style={{
                  backgroundColor: getRouteColor(route.id, selectedRoute === route.id),
                  opacity: getRouteOpacity(route.id)
                }}
              ></div>
              <span className={`text-gray-700 ${selectedRoute === route.id ? 'font-semibold' : ''}`}>
                Rota {index + 1}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Footer Info */}
      {selectedRoute && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Rota selecionada:</span>
            <span className="text-foreground font-semibold">
              {routes.find(r => r.id === selectedRoute)?.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
