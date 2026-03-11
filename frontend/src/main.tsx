import AuthGuard from '@components/AuthGuard.tsx';
import App from '@components/Home.tsx';
import Instruction from '@components/Instruction';
import Layout from '@components/Layout';
import Login from '@components/Login';
import Score from '@components/Score';
import Upload from '@components/Upload';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import './global.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route element={<AuthGuard />}>
              <Route path="/score" element={<Score />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/instruction" element={<Instruction />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
