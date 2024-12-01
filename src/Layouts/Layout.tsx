import Header from "./Header";

const Layout = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return (props: P) => (
    <>
      <Header />
      <WrappedComponent {...props} />
    </>
  );
};

export default Layout;
