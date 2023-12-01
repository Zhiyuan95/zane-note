"use client";

import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  PlusCircle,
  Search,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./userItem";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Item from "./item";
import { toast } from "sonner";

const Navigation = () => {
  const pathName = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);

  const [isCollapse, setIsCollapse] = useState(isMobile);
  const [isResetting, setIsResetting] = useState(false);

  const getDocs = useQuery(api.documents.get);
  const createDoc = useMutation(api.documents.create);

  useEffect(() => {
    isMobile ? collapse() : resetWidth();
  }, [isMobile]);

  useEffect(() => {
    isMobile && collapse();
  }, [pathName, isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseup);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };
  const handleMouseup = () => {
    isResizingRef.current = false;

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseup);
  };

  const resetWidth = () => {
    setIsCollapse(false);
    setIsResetting(true);
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100%-240px"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapse(true);
      setIsResetting(true);
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
    }
  };

  const handleCreate = () => {
    const promise = createDoc({ title: "Untitled" });
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };
  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar flex h-full bg-secondary overflow-y-auto relative w-60 flex-col z-[99999] ",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          role="button"
          onClick={collapse}
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <Item label="setting" icon={Settings} onClick={() => {}} />
          <Item label="search page" icon={Search} onClick={() => {}} isSearch />
          <Item label="new page" icon={PlusCircle} onClick={handleCreate} />
        </div>
        <div className="mt-4">
          {/* <p>Documents</p> */}
          {getDocs?.map((document) => (
            <p key={document._id}>{document.title}</p>
          ))}
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        className={cn(
          "absolute top-0 left-60 w-[cala(100%-240px",
          isResetting && "transition-all ease-in-out",
          isMobile && "left-0 w-full"
        )}
        ref={navbarRef}
      >
        <nav className="px-3 bg-transparent py-2 w-full">
          {isCollapse && (
            <MenuIcon
              onClick={resetWidth}
              role="button"
              className="h-6 to-muted-foreground w-6"
            />
          )}
        </nav>
      </div>
    </>
  );
};

export default Navigation;
