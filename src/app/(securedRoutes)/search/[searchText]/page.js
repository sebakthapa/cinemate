import Search from '@/components/Search';

const page = ({ params }) => {
  return <Search searchText={params?.searchText || null} />;
};

export default page;
