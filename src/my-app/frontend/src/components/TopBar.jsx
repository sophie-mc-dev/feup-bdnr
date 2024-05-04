import "../index.css";
import React, {useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const VisitorOptions = () => {
  return (
    <>
      <a href="/">Events</a>
      <a href="/artists">Artists</a>
      <div className="fle flex-row">
        <Link to="/login">
          <button className="py-1 px-3 rounded-bl-lg rounded-l-lg font-normal border border-white hover:bg-white hover:bg-opacity-15"> Log In </button>
        </Link>
        <Link to="/register">
          <button className="py-1 px-3 rounded-br-lg rounded-r-lg font-normal text-[#242565] border bg-white border-white hover:bg-white"> Register </button>
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
      navigate('/login');
    });
  }

  return (
    <>
      <a>MY EVENTS</a>
      <Link to="/new_event">
        <button className="py-1.5 px-3 rounded-lg border border-white hover:bg-white hover:bg-opacity-15">
          CREATE EVENT
        </button>
      </Link>
      <div className="fle flex-row">
        <Link to="/profile">
          <button className="py-1 px-3 rounded-bl-lg rounded-l-lg font-normal border border-white hover:bg-white hover:bg-opacity-15"> My Account </button>
        </Link>
        <button onClick={handleLogout} className="py-1 px-3 rounded-br-lg rounded-r-lg font-normal text-[#242565] border bg-white border-white hover:bg-white"> Log Out </button>
      </div>
    </>
  );
};

const ConsumerOptions = () => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout().then(() => {
      navigate('/login');
    });
  }

  return (
    <>
      <a href="/">EVENTS</a>
      <a href="/artists">ARTISTS</a>
      <Link to="/profile/favorites">
        <img src="/favorites.svg" alt="Favorites" />
      </Link>
      <Link to="/shopping-cart">
        <img src="/shoppingCart.svg" alt="Shopping Cart" />
      </Link>
      <div className="fle flex-row">
        <Link to="/profile">
          <button className="py-1 px-3 rounded-bl-lg rounded-l-lg font-normal text-[#242565] border bg-white border-white hover:bg-white"> My Account </button>
        </Link>
        <button onClick={handleLogout} className="py-1 px-3 rounded-br-lg rounded-r-lg font-normal border border-white hover:bg-white hover:bg-opacity-15"> Log Out </button>
      </div>
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
            <OrganizationOptions/>
          ) : (
            <ConsumerOptions/>
          )
        ) : (
          <VisitorOptions />
        )}
      </div>
    </header>
  );
};
export default TopBar;