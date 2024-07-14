import { PATH } from '@/configs'
import CodePage from '@/pages/code'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const Routes = () => {
  const routesForNotAuthenticatedOnly = [
    {
      path: PATH.LOGIN,
      element: <div>Login</div>
    },
    {
      path: PATH.REGISTER,
      element: <div>Register</div>
    },
    {
      path: PATH.DASHBOARD,
      element: <div>Dashboard</div>
    },
    {
      path: PATH.CODE,
      element: <CodePage />
    }
  ]

  const router = createBrowserRouter([...routesForNotAuthenticatedOnly])

  return <RouterProvider router={router} />
}

export default Routes
