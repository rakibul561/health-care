import { getDefaultDashboardRoute } from "@/lib/auth-utils";

import { UserInfo } from "@/types/user.interface";
import DashboardNavbarContent from "./DashboardNavbarContent";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { getNavItemsByRole } from "@/lib/navItems.config";

const DashboardNavbar = async () => {
  const userInfo = (await getUserInfo()) as UserInfo;
  const navItems = getNavItemsByRole(userInfo.role);
  const dashboardHome = getDefaultDashboardRoute(userInfo.role);

  return (
    <DashboardNavbarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
};

export default DashboardNavbar;