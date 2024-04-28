"use client";

import { useSidebar } from "@/hooks/sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const SidebarToggler = () => {
  const sidebarContext = useSidebar();

  const Component = (props: React.SVGProps<SVGSVGElement>) =>
    sidebarContext.isOpen ? (
      <ChevronLeft {...props} />
    ) : (
      <ChevronRight {...props} />
    );

  return (
    <Component
      onClick={sidebarContext.toggle}
      className="w-8 mb-4 cursor-pointer hover:text-gray-500 transition-colors"
    />
  );
};
