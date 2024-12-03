import Title from "@/shared/Title";
import Header from "./Header";

interface LayoutOptions {
  title?: string;
  description?: string;
}

const Layout = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: LayoutOptions
) => {
  return (props: P & { title?: string; description?: string }) => {
    const title = props.title || options?.title || "Flow Maker";
    const description =
      props.description ||
      options?.description ||
      "Create/Manage your sequences with automated emails & timely tasks.";

    return (
      <>
        <Title title={title} description={description} />
        <Header />
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default Layout;
