import { useBook } from '@/hooks/book/useBook'
import { useScrollingStore } from '@/hooks/ScrollProvider'
import { BookDataModel } from '@/model/book'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/book/view/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { scrollContainerRef } = useScrollingStore()

  const params = Route.useParams()
  const { data } = useBook()

  const { id } = params

  // Filter the selected book based on ID
  const filteredItems = data?.filter((item: BookDataModel) => {
    return id ? item['ID'] === id : true
  })

  // Get the link from the filtered book
  const linkBook = filteredItems?.[0]?.['link'] || ''

  // Convert Google Drive link to a PDF embed link
  const pdfEmbedLink = linkBook
    ? linkBook.replace(
        /https:\/\/drive\.google\.com\/file\/d\/(.*?)\/view\?usp=sharing/,
        'https://drive.google.com/file/d/$1/preview',
      )
    : ''

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col items-center justify-center w-full h-screen"
    >
      {pdfEmbedLink ? (
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          {/* Mobile: Full Width | Tablet & Desktop: Custom Width */}
          <div className="w-full h-full md:w-4/5 lg:w-3/4 xl:w-1/2 max-h-screen">
            <iframe
              src={pdfEmbedLink}
              title="PDF Viewer"
              className="w-full h-full border-0 shadow-md"
            />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No PDF link available for this book.
        </p>
      )}
    </div>
  )
}
