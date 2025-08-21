import { useState } from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import { cn } from '@/lib/utils';
import { MenuChildren, TypeMenu } from "./Menu.interface";
import IconButton from "../IconButton/IconButton";

const Menu = ({ title, child = [], size = 'sm' }: TypeMenu) => {
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  const closeMenu = () => {
    setOpenMenu(false);
  };

  return (
    <div className="relative">
      <IconButton title={title} onClick={toggleMenu} variant="warning" />

      {openMenu && (
        <OutsideClickHandler onOutsideClick={closeMenu}>
          <div className={cn(
            "absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg z-50",
            {
              "w-64": size === "lg",
              "w-48": size !== "lg"
            }
          )}>
            {child?.length > 0 && child.map((item: MenuChildren, index: number) => {
              const Icon = item.icon;
              return (
                <div
                  onClick={() => {
                    item.onClick && item?.onClick()!;
                    closeMenu();
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer",
                    {
                      "border-b border-gray-200": item.isBorder
                    }
                  )}
                  key={index}
                >
                  {Icon && <Icon />}
                  <p>{item.title}</p>
                </div>
              );
            })}
          </div>
        </OutsideClickHandler>
      )}
    </div>
  );
};

export default Menu;
