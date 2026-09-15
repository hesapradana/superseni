import Image from "next/image"

/**
 * The landscape as the page's own ground, not a picture inside a card.
 *
 * Fixed behind everything, so the header, the chips and the tiles all float on
 * it and the page has no visible seam where the map "ends". The scrim is not
 * themed: the photograph looks the same in light and dark, so anything drawn
 * over it has to be light in both.
 */
export function MapBackdrop() {
  return (
    <div className="fixed inset-0 -z-10">
      <Image
        src="/background/map.png"
        alt=""
        aria-hidden
        fill
        /* The one large picture on the map screen, so it is the LCP: start it
           from the <head>. (`priority` is deprecated as of Next 16.) */
        preload
        sizes="100vw"
        className="object-cover"
      />
      <div className="photo-scrim absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#10151a]/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#10151a]/70 to-transparent" />
    </div>
  )
}
