import { Link, useLocation } from "react-router-dom";
import { Home, Store, BookOpen, Compass, User } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/"
    },
    {
      icon: Store,
      label: "Shop",
      path: "/shop"
    },
    {
      icon: BookOpen,
      label: "Blogs",
      path: "/blog"
    },
    {
      icon: Compass,
      label: "Discover",
      path: "/categories"
    },
    {
      icon: User,
      label: "Profile",
      path: "/profile"
    }
  ];

  // Only show on mobile devices
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-lg transition-all duration-200 ease-spring",
                "min-h-[44px] min-w-[44px]", // iOS touch target size
                isActive
                  ? "text-primary bg-primary/10 shadow-glow scale-105"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5 active:scale-95"
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  "h-5 w-5 mb-1 transition-transform duration-200",
                  isActive && "scale-110"
                )} />
              </div>
              <span className={cn(
                "text-xs font-medium transition-all duration-200",
                isActive ? "opacity-100 scale-105" : "opacity-75"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-primary-glow rounded-full animate-pulse-glow" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;