import Search from "@/components/Search"


const page = async ({ params }) => {
  return (
      <Search searchText={params?.searchText || null} />
  )
}

export default page
