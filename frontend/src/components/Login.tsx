import { pb } from '@lib/db';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from 'src/hooks/auth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();
  const mutationFn = async (credentials: {
    username: string;
    password: string;
  }) => {
    return pb
      .collection('users')
      .authWithPassword(credentials.username, credentials.password);
  };

  const mutation = useMutation({
    mutationFn: mutationFn,

    onSuccess: () => {
      navigate('/');
      auth.refetch();
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate({ username, password });
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="card border border-base-300 bg-base-100">
        <div className="card-body gap-4">
          <div>
            <h1 className="card-title text-2xl">Sign in</h1>
            <p className="text-sm text-base-content/70">
              Access your account to continue.
            </p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="form-control w-full">
              <span className="label-text mb-1">Username</span>
              <input
                type="text"
                placeholder="CMU Email"
                className="input input-bordered w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">Password</span>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {mutation.isError && (
              <div className="alert alert-error py-2 text-sm">
                <span>Invalid username or password.</span>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary w-full ${mutation.isPending ? 'btn-disabled' : ''}`}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <div className="alert alert-info/20 border border-info/30 items-start">
            <div className="space-y-1 text-sm">
              <p className="font-medium text-info">หมายเหตุการเข้าสู่ระบบ</p>
              <p className="text-base-content/80">
                Password จะอยู่ในรูปแบบ{' '}
                <span className="font-semibold">"prodsupXXXX"</span> โดย{' '}
                <span className="font-semibold">XXXX</span> คือเลข 4 หลักจาก
                Mango Canvas Assignment ชื่อ{' '}
                <span className="font-semibold">"เวปดูคะแนน"</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
