import { Link, useNavigate } from "react-router-dom";
import Avatar from "../../components/Avatar/Avatar";
import Menu from "../../components/Menu/Menu";
import { USER_TYPE } from "../../constants/conts";

const NotFound = () => {
  const navigate = useNavigate();

  const logout = () => {
    const type = localStorage.getItem("type");
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    if (type === USER_TYPE.COMPAMY) {
      navigate("/brand/login");
    } else {
      navigate("/creator/login");
    }
  }
  return (
    <>
      <div className="">
        <Link to="/creator/home">{"Back to LinksFam"}</Link>
        <span className="">
          <Menu title={<Avatar name={"P"} size={2} />} size="sm" child={[
            {
              title: 'Logout',
              value: 'Logout',
              onClick: () => logout(),
            },

          ]} />
        </span>
      </div>
      <div style={{ fontSize: "2rem", color: "grey", textAlign: 'center' }}>
        404 | NOT FOUND
      </div>
    </>
  )
}

export default NotFound
