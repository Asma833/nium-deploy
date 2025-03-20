import { usePageTitle } from "@/hooks/usePageTitle";

const PageTitle = () => {
  const { title } = usePageTitle();
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-muted-foreground mb-3">{title}</h1>
    </div>
  );
};

export default PageTitle;
