import "../index.css";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const VisitorOptions = () => {
  return (
    <>
      <a href="/">Events</a>
      <a href="/artists">Artists</a>
      <div className="fle flex-row">
        <Link to="/login">
          <button className="py-1 px-3 rounded-bl-lg rounded-l-lg font-normal border border-white hover:bg-white hover:bg-opacity-15">
            {" "}
            Log In{" "}
          </button>
        </Link>
        <Link to="/register">
          <button className="py-1 px-3 rounded-br-lg rounded-r-lg font-normal text-[#242565] border bg-white border-white hover:bg-white">
            {" "}
            Register{" "}
          </button>
        </Link>
      </div>
    </>
  );
};

const OrganizationOptions = () => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout().then(() => {
      navigate("/");
    });
  }

  return (
    <>
      <a className="font-semibold" href="/">EVENTS</a>
      <a className="font-semibold" href="/artists">ARTISTS</a>
      <a className="font-semibold" href="/my_events">MY EVENTS</a>
      <Link to="/profile" className="inline-block">
        <svg
          className="h-6 w-6 text-white fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            stroke="currentColor"
            fill="none"
            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          />
          <circle cx={12} cy={7} r={4} fill="currentColor" />
        </svg>
      </Link>

      <div className="fle flex-row">
        <button
          onClick={handleLogout}
          className="bg-[#494391] text-white font-semibold  text-base rounded-lg px-4 py-2 font-500 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
        >
          {" "}
          Log Out{" "}
        </button>
      </div>
    </>
  );
};

const ConsumerOptions = () => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout().then(() => {
      navigate("/");
    });
  }

  return (
    <>
      <a className="font-semibold" href="/">EVENTS</a>
      <a className="font-semibold" href="/artists">ARTISTS</a>
      <Link to="/favorites">
        <img src="/favorites.svg" alt="Favorites" />
      </Link>
      <Link to="/shopping-cart">
        <img src="/shoppingCart.svg" alt="Shopping Cart" />
      </Link>
      <Link to="/profile" className="inline-block">
        <svg
          className="h-6 w-6 text-white fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            stroke="currentColor"
            fill="none"
            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          />
          <circle cx={12} cy={7} r={4} fill="currentColor" />
        </svg>
      </Link>
      <button
        onClick={handleLogout}
        className="bg-[#494391] text-white font-semibold  text-base rounded-lg px-4 py-2 font-500 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
      >
        {" "}
        Log out{" "}
      </button>
    </>
  );
};

const TopBar = () => {
  const { user, isLoggedIn } = useContext(UserContext);

  return (
    <header className="px-2 py-4 flex justify-between bg-[#242565]">
      <Link to="/">
        <img className="w-40 ml-4" src="/logo.svg" alt="ComforTix Logo" />
      </Link>

      <div className="flex items-center gap-x-8 me-4 text-l text-white font-light">
        {isLoggedIn ? (
          user.is_organization ? (
            <OrganizationOptions />
          ) : (
            <ConsumerOptions />
          )
        ) : (
          <VisitorOptions />
        )}
      </div>
    </header>
  );
};
export default TopBar;
