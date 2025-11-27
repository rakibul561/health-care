import { getDefaultDashboardRoute } from "@/lib/auth-utils";

import { UserInfo } from "@/types/user.interface";
import DashboardSidebarContent from "./DashboardContentSlidebar";
import { getNavItemsByRole } from "@/lib/navItems.config";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { NavSection } from "@/types/DashboardInterface";


const DashboardSidebar = async () => {
  const userInfo = (await getUserInfo()) as UserInfo;

  const navItems: NavSection[] = getNavItemsByRole(userInfo.role);
  const dashboardHome = getDefaultDashboardRoute(userInfo.role);

  return (
    <DashboardSidebarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
};

export default DashboardSidebar;