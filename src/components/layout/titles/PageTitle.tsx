import { usePageTitle } from '@/hooks/usePageTitle';

const PageTitle = () => {
  const { title } = usePageTitle();
  return (
    <div className="page-title-wrap w-full">
      <h2 className="page-title text-2xl font-bold text-muted-foreground mb-2">{title}</h2>
    </div>
  );
};

export default PageTitle;
