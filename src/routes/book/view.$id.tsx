import { useBook } from '@/hooks/book/useBook'
import { useScrollingStore } from '@/hooks/ScrollProvider'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/book/view/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const { id } = params

  const { scrollContainerRef } = useScrollingStore()

  const {
    // PDF Link
    pdfEmbedLink,
  } = useBook(id)

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col items-center justify-center w-full h-screen"
    >
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        {/* Mobile: Full Width | Tablet & Desktop: Custom Width */}
        <div className="w-full h-full md:w-4/5 lg:w-3/4 xl:w-1/2 max-h-screen">
          {pdfEmbedLink && (
            <iframe
              src={pdfEmbedLink}
              title="PDF Viewer"
              className="w-full h-full border-0 shadow-md"
            />
          )}
        </div>
      </div>
      {!pdfEmbedLink && (
        <p className="text-center text-gray-500">
          No PDF link available, and you're offline.
        </p>
      )}
    </div>
  )
}
