import { SearchIcon } from '@/components/layouts/icons'
import CategoryCard from '@/containers/sutra/CategoryCard'
import SutraCard from '@/containers/sutra/SutraCard'
import { useSutra } from '@/hooks/sutra/useSutra'
import { Input } from '@nextui-org/react'
import { createLazyFileRoute } from '@tanstack/react-router'
export const Route = createLazyFileRoute('/sutra/')({
  component: () => <RouteComponent />,
})

function RouteComponent() {
  const { data, isLoading, getGroupedData, searchTerm, setSearchTerm } =
    useSutra()

  return (
    <>
      <section className="flex flex-col items-center justify-center mb-4">
        {/* Search Bar */}
        <Input
          placeholder="ຄົ້ນຫາພຣະສູດທັງໝົດ..." // Translates to "Search for Sutra"
          classNames={{
            inputWrapper: 'bg-default-100',
            input: 'text-lg',
          }}
          className="mb-4 sticky top-14 z-10 w-full sm:max-w-md md:max-w-lg lg:max-w-xl"
          value={searchTerm}
          startContent={
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
          }
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
        {/* Category Filter */}
        {searchTerm === '' && (
          <div className="gap-2 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5">
            {getGroupedData().map(([category, item]) => (
              <CategoryCard
                key={category}
                category={category}
                item={item}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
        {/* Render Filtered Items with Collapsible Detail */}
        {searchTerm !== '' && (
          <div className="flex flex-col gap-2">
            {data?.map((item) => (
              <SutraCard
                key={item.ID}
                title={item['ຊື່ພຣະສູດ']}
                detail={item['ພຣະສູດ']}
                searchTerm={searchTerm}
                route={`/sutra/details/${item['ໝວດທັມ']}/${item['ຊື່ພຣະສູດ']}`}
              />
            ))}
            {/* Fallback for Empty Data */}
            {!data?.length && (
              <div className="text-center text-gray-600 text-lg">
                ບໍ່ພົບຂໍ້ມູນ
              </div>
            )}
          </div>
        )}
      </section>
    </>
  )
}
