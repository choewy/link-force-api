import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import AlertIFrame from './pages/AlertIFrame';
import AlertWidget from './pages/AlertWidget';

export default function App() {
  return (
    <RecoilRoot>
      <RouterProvider
        router={createBrowserRouter([
          {
            path: ':id',
            element: <AlertIFrame />,
          },
          {
            path: 'alert/:id',
            element: <AlertWidget />,
          },
        ])}
      />
    </RecoilRoot>
  );
}
