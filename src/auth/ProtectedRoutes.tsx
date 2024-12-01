import { Navigate, Outlet } from "react-router-dom";

type ProtectedRoutesProps = {
  children?: JSX.Element;
  userExists: boolean;
  redirect?: string;
};

const ProtectedRoutes = ({
  children,
  userExists,
  redirect = "/signin",
}: ProtectedRoutesProps) => {
  return userExists ? (
    children ? (
      children
    ) : (
      <Outlet />
    )
  ) : (
    <Navigate to={redirect} />
  );
};

export default ProtectedRoutes;
