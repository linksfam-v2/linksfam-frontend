import { Link } from "react-router-dom";
import Logo from "../assets/images/textLogoVer.svg";
const Header = () => {

  return (
    <div>
      <header className="h-[4.25rem] w-full flex items-center p-4 justify-between border-b border-gray-200">
        <div className="flex gap-6 items-center justify-center">
          <div>
            <Link to="/">
              <img src={Logo} alt="Linksfam" className="h-10 max-w-full block" />
            </Link>
          </div>
        </div>
        <div className="flex gap-6 items-center">
        </div>
      </header>
    </div>
  );
};

export default Header;
