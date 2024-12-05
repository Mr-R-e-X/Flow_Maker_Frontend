import { Helmet } from "react-helmet-async";

const Title = ({
  title = "Flow Maker",
  description = "Create/Manage your sequences with automated emails & timely tasks.",
}: {
  title: string;
  description: string;
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Title;
