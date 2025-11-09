import { Outlet, useLocation } from "react-router-dom";
import { PortfolioLayoutWidget, usePortfolioLayoutScript } from "@orderly.network/portfolio";
import { useOrderlyConfig } from "@/utils/config";
import { useNav } from "@/hooks/useNav";
import { useMemo } from "react";

export default function PortfolioLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  const { onRouteChange } = useNav();
  const config = useOrderlyConfig();
  
  const layoutScript = usePortfolioLayoutScript({ current: pathname });
  
  const filteredItems = useMemo(() => {
    return layoutScript.items.filter((item) => item.href !== "/portfolio/apiKey");
  }, [layoutScript.items]);

  return (
    <PortfolioLayoutWidget
      footerProps={config.scaffold.footerProps}
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: "/portfolio",
      }}
      routerAdapter={{
        onRouteChange,
      }}
      items={filteredItems}
      bottomNavProps={config.scaffold.bottomNavProps}
    >
      <Outlet />
    </PortfolioLayoutWidget>
  );
}

