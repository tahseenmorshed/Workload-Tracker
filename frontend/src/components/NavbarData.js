import React from "react";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as GiIcons from "react-icons/gi"

export const SidebarData = [
  {
    title: "Summary",
    path: "/",
    icon: <MdIcons.MdSummarize />,
    cName: "nav-text",
  },
  {
    title: "Admin",
    path: "/admin",
    icon: <RiIcons.RiAdminFill />,
    cName: "nav-text",
  },
  {
    title: "Schedule",
    path: "/schedule",
    icon: <MdIcons.MdSchedule />,
    cName: "nav-text",
  },
  {
    title: "Units",
    path: "/units",
    icon: <GiIcons.GiNotebook />,
    cName: "nav-text",
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: <MdIcons.MdNotificationsActive />,
    cName: "nav-text",
  },
];