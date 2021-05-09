import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/client";
import styled from "styled-components";
import { primeButton } from "../../styles/uiComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Cross as Hamburger } from "hamburger-react";

const NavBar = () => {
  const [session, loading] = useSession();
  const [isOpen, setOpen] = useState(false);

  const hamburgerHandler = (e) => {
    setOpen(false);
  };

  const logouthandler = (params) => {
    signOut();
    setOpen(false);
  };
  return (
    <StyledNav>
      <div className="nav-container">
        <Link href="/">
          <h1 className="theatrum-logo">Theatrum</h1>
        </Link>

        <nav>
          <StyledUL>
            <div className="desktop nav-list-style">
              {session && (
                <li>
                  <Link href={`/${session.user.image}/profile`}>
                    <FontAwesomeIcon
                      className="fa-user"
                      icon={faUser}
                      size="lg"
                    />
                  </Link>
                </li>
              )}

              <div className="user-buttons">
                {!session && !loading && (
                  <li>
                    <Link href="/login">
                      <MainButton primary> Login</MainButton>
                    </Link>
                  </li>
                )}

                <li>
                  <Link href="/signup">
                    <MainButton> Sign up</MainButton>
                  </Link>
                </li>

                {session && (
                  <li>
                    <MainButton onClick={logouthandler} primary>
                      Logout
                    </MainButton>
                  </li>
                )}
              </div>
            </div>

            {isOpen && (
              <div className="mobile nav-list-style">
                {session && (
                  <li>
                    <Link href={`/${session.user.image}/profile`}>
                      <FontAwesomeIcon
                        className="fa-user"
                        icon={faUser}
                        size="lg"
                        onClick={hamburgerHandler}
                      />
                    </Link>
                  </li>
                )}

                <div className="user-buttons">
                  {!session && !loading && (
                    <li>
                      <Link href="/login">
                        <MainButton primary onClick={hamburgerHandler}>
                          Login
                        </MainButton>
                      </Link>
                    </li>
                  )}

                  <li>
                    <Link href="/signup">
                      <MainButton onClick={hamburgerHandler}>
                        {" "}
                        Sign up
                      </MainButton>
                    </Link>
                  </li>

                  {session && (
                    <li>
                      <MainButton onClick={logouthandler} primary>
                        Logout
                      </MainButton>
                    </li>
                  )}
                </div>
              </div>
            )}
          </StyledUL>
          <div className="hamburger-icon">
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </div>
        </nav>
      </div>
    </StyledNav>
  );
};

const StyledNav = styled.header`
  background: var(--main-bg-color);
  color: white;
  width: 100%;

  .theatrum-logo {
    z-index: 999;
    cursor: pointer;
  }

  .fa-user {
    cursor: pointer;
    &:hover {
      color: var(--light-pink);
    }

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  .hamburger-icon {
    display: none;

    div {
      z-index: 999;
    }
    @media (max-width: 768px) {
      display: block;
    }
  }

  .nav-container {
    min-height: 4.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: var(--main-margin);

    @media only screen and (min-width: 2000px) {
      width: var(--max-width-rem);
      margin: 0rem;
      margin: auto;
    }

    @media (max-width: 900px) {
      margin: var(--tablet-margin);
    }

    @media (max-width: 370px) {
      margin: var(--mobile-margin);
    }
  }
`;

const StyledUL = styled.ul`
  .desktop {
    li {
      margin-left: 3rem;
      font-weight: 400;
      white-space: nowrap;
      color: #ffffff;
    }

    .user-buttons {
      display: flex;
      padding-left: 3rem;

      li {
        margin-left: 1rem;
      }
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  .mobile {
    display: none;
    background: var(--main-bg-color);
    min-height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    min-width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 10vh 0rem;
    align-items: center;
    text-align: center;
    z-index: 20;

    li,
    div,
    button {
      margin: 0rem;
    }

    button {
      margin: 1rem 0rem;
    }

    @media (max-width: 768px) {
      display: flex;
    }
  }
`;

const MainButton = styled(primeButton)``;

export default NavBar;
