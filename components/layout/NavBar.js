import Link from "next/link";
import { useSession, signOut } from "next-auth/client";

const NavBar = () => {
  const [session, loading] = useSession();

  const logouthandler = (params) => {
    signOut();
  };
  return (
    <header>
      <Link href="/">theatrum</Link>
      <nav>
        <ul>
          {!session && !loading && (
            <li>
              <Link href="/login">Login</Link>
            </li>
          )}

          <li>
            <Link href="/signup">Signup</Link>
          </li>

          <li>
            <Link href="/search/kong">Kong</Link>
          </li>

          {session && (
            <Link href={`/${session.user.image}/profile`}>Profile</Link>
          )}

          {session && (
            <li>
              <button onClick={logouthandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>

      <hr />
    </header>
  );
};

export default NavBar;
