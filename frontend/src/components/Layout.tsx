import { pb } from '@lib/db';
import { Outlet } from 'react-router';
import { useAuth } from 'src/hooks/auth';

function Layout() {
  const auth = useAuth();
  console.log('auth', auth);
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

          <div className="flex items-center gap-2 lg:hidden">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-50 mt-3 w-52 rounded-box border border-base-300 bg-base-100 p-2 shadow"
              >
                <li>
                  <a href="/upload">อัพโหลด</a>
                </li>
                <li>
                  <a href="/score">คะแนน</a>
                </li>
                <li>
                  <a href="/instruction">คำแนะนำ</a>
                </li>

                {auth.isAdmin && (
                  <li>
                    <a href="/evalsummary">สรุปการประเมิน</a>
                  </li>
                )}

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
            </div>

            <div className="badge badge-neutral px-3 py-3">
              {auth?.data?.name ?? 'Guest'}
            </div>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <a href="/upload" className="btn btn-ghost btn-sm">
              อัพโหลด
            </a>
            <a href="/score" className="btn btn-ghost btn-sm">
              คะแนน
            </a>
            <a href="/instruction" className="btn btn-ghost btn-sm">
              คำแนะนำ
            </a>
            {auth.isAdmin && (
              <a href="/evalsummary" className="btn btn-ghost btn-sm">
                สรุปการประเมิน
              </a>
            )}
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
