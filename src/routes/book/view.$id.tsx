import { useBook } from '@/hooks/book/useBook'
import Seo from '@/components/layouts/Seo'
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
    titleBook,
    linkBook,
  } = useBook(id)

  // ----- SEO -----
  const pageUrl = typeof window !== 'undefined' ? window.location.href : undefined
  const canonical = typeof window !== 'undefined' ? `${window.location.origin}/book/view/${id}` : undefined
  const description = titleBook ? `ປຶ້ມ: ${titleBook}` : 'ປຶ້ມ'
  const schemaJson = titleBook
    ? {
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: titleBook,
        url: pageUrl,
        potentialAction: linkBook
          ? {
              '@type': 'ReadAction',
              target: linkBook,
            }
          : undefined,
      }
    : null

  return (
    <>
      <Seo
        title={`${titleBook || 'Book'} | ຄຳສອນພຸດທະ`}
        description={description}
        url={pageUrl}
        canonical={canonical}
        type='book'
        schemaJson={schemaJson as any}
      />
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
    </>
  )
}
