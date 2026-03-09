import { pb } from '@lib/db';
import { Outlet } from 'react-router';
import { useAuth } from 'src/hooks/auth';

function Layout() {
  const auth = useAuth();
  console.log(auth);

  function signOut() {
    pb.authStore.clear();
    auth.refetch();
  }

  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/upload">Upload</a>
            </li>
            <li>
              <a href="/score">Score</a>
            </li>

            {!auth.isAuthenticated && (
              <li>
                <a href="/login">Login</a>
              </li>
            )}
            {auth.isAuthenticated && (
              <li>
                <button onClick={signOut}>Sign Out</button>
              </li>
            )}
          </ul>
          <span>{auth?.data?.name ?? 'Guest'}</span>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>&copy; 2024 My App</p>
      </footer>
    </div>
  );
}

export default Layout;
