export const HeroBackdrop = () => {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 lg:-top-32">
        <div className="paper-hero-glow paper-hero-glow--ambient paper-breathe size-96 md:size-[32rem] lg:size-[42rem]" />
      </div>
      <div className="paper-hero-glow paper-hero-glow--primary paper-drift-slow -right-20 top-4 size-72 md:size-96 lg:-right-16 lg:-top-8 lg:size-[34rem]" />
      <div className="paper-hero-glow paper-hero-glow--secondary paper-drift-fast -left-16 top-44 size-64 md:size-[22rem] lg:bottom-12 lg:left-0 lg:top-auto lg:size-[26rem]" />
    </div>
  )
}
