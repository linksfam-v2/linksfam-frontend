import React from "react";
import { IconType } from "react-icons";

export type MenuChildren = {
  title:string;
  value:string;
  onClick?: () => void;
  icon?:IconType,
  isBorder?:boolean;
}

export type TypeMenu = {
  title: React.ReactNode,
  child?: MenuChildren[],
  size?: 'lg' | "sm",
};