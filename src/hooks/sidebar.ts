import { createContext, useContext } from "react";

export const SidebarContext = createContext({
  isOpen: false,
  toggle: () => {},
});

export const useSidebar = () => useContext(SidebarContext);
