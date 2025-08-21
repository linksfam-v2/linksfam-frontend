import { Outlet } from "react-router-dom";

const UnAuthBase = () => {

  return (
    <div className="">
      <div className="">
        <p>LinksFam</p>
        <span className="">

        </span>
      </div>
      <Outlet />
    </div>
  )
}

export default UnAuthBase;
