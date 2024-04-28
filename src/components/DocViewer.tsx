import Image from "next/image";
import React from "react";

import { SidebarToggler } from "./SidebarToggler";

type Props = { url: string; name: string };

export const DocViewer = ({ url, name }: Props) => {
  let Component;
  if (/\.(jpe?g|png|gif|bmp)$/i.test(url)) {
    Component = () => getImage(url, name);
  } else {
    Component = () => getIframe(url);
  }

  return (
    <div className="w-full h-full">
      <SidebarToggler />
      <Component />
    </div>
  );
};

function getImage(url: string, name: string) {
  return (
    <Image
      height={100}
      width={100}
      alt={name}
      src={url}
      className="w-full h-[97%] object-contain"
      priority
    />
  );
}

function getIframe(url: string) {
  return (
    <iframe
      src={`https://drive.google.com/viewer?url=${url}&embedded=true`}
      className="w-full h-[97%]"
    />
  );
}
