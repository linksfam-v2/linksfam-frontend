import { useState } from "react";
import Input from "../Input/Input";
import cx from "classnames";
import OutsideClickHandler from 'react-outside-click-handler';
import { toast } from "react-toastify";
const Dropdown = ({ children, placeholder, label, isInput, leftIcon, rightIcon, selectedChild, setSelectChild, errorDropdown }: TypeDropdown) => {

  const [hideMenu, showMenu] = useState(false);

  return (
    <OutsideClickHandler onOutsideClick={() => showMenu(false)}>
      <div className="">
        {label && <label>{label}</label>}

        {isInput ? <Input placeholder={placeholder} value="" /> : <div className={cx({
          [""]: selectedChild?.label
        })} onClick={() => showMenu((prev) => !prev)}>
          <span>{leftIcon}{selectedChild?.label ? selectedChild?.label : placeholder}</span>
          <span>
            {rightIcon}
          </span>
        </div>}
        {hideMenu && <span className="">
          {children && children.map((item, i) => {
            return <div className={cx({
              ["disabled"]: item?.disabled
            })} key={i} onClick={() => {
              if (item?.disabled) {
                toast("Coming soon!")
              } else {
                setSelectChild(item);
                showMenu(false);
                errorDropdown && errorDropdown!()
              }
            }}>{item?.label}</div>
          })}
        </span>}
      </div>
    </OutsideClickHandler >
  );
}

export default Dropdown;

type TypeDropdown = {
  className?: string;
  isInput?: boolean;
  children: ListProps[],
  placeholder?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  selectedChild?: ListProps;
  setSelectChild: (child: ListProps) => void;
  errorDropdown?: any
};

export type ListProps = {
  label: string;
  value: string;
  disabled?: boolean;
};