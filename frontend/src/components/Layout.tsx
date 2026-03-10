import { pb } from '@lib/db';
import { Outlet } from 'react-router';
import { useAuth } from 'src/hooks/auth';

function Layout() {
  const auth = useAuth();

  function signOut() {
    pb.authStore.clear();
    auth.refetch();
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <header className="border-b border-base-300 bg-base-100">
        <nav className="navbar mx-auto max-w-6xl px-4">
          <div className="flex-1">
            <a href="/" className="text-2xl font-bold">
              PS68
            </a>
          </div>

          <div className="flex gap-2 items-center">
            <a href="/upload" className="btn btn-ghost btn-sm">
              Upload
            </a>
            <a href="/score" className="btn btn-ghost btn-sm">
              Score
            </a>

            {!auth.isAuthenticated && (
              <a href="/login" className="btn btn-ghost btn-sm">
                Login
              </a>
            )}

            {auth.isAuthenticated && (
              <button className="btn btn-ghost btn-sm" onClick={signOut}>
                Sign Out
              </button>
            )}

            <div className="badge badge-neutral px-3 py-3">
              {auth?.data?.name ?? 'Guest'}
            </div>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
          <Outlet />
        </div>
      </main>

      <footer className="footer footer-center border-t border-base-300 bg-base-100 p-4 text-base-content/70">
        <p>&copy; Production Support 2026</p>
      </footer>
    </div>
  );
}

export default Layout;
