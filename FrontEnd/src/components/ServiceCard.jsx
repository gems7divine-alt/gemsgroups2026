export default function ServiceCard({ icon: Icon, title, description, image, imageAlt, imageFit, imageBg }) {
  const isRacing = image?.includes("racing");
  const isMai = image?.includes("mai");
  const isLogo = isRacing || isMai;
  const isContain = isLogo || image?.includes("film") || image?.includes("travel");
  const fit = imageFit || (isLogo ? "object-contain object-center p-3" : isContain ? "object-contain object-center" : "object-cover object-center");
  const bg = imageBg || (isContain ? "bg-white" : "bg-deepnavy");
  return (
    <article className="group w-full overflow-hidden rounded-2xl border border-gold/20 bg-white/[0.04] backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:shadow-[0_0_30px_rgba(217,164,65,0.18)]">
      {image && (
        <div className={`relative h-48 w-full overflow-hidden ${bg}`}>
          <img
            src={image}
            alt={imageAlt || title}
            loading="lazy"
            className={`h-full w-full ${fit} transition-transform duration-500 group-hover:scale-105`}
          />
          {!isContain && (
            <div className="absolute inset-0 bg-gradient-to-t from-deepnavy/70 via-transparent to-transparent" aria-hidden="true" />
          )}
        </div>
      )}
      <div className="p-6">
        <div className="-mt-12 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-deepnavy/90 text-gold shadow-lg transition-colors group-hover:bg-gold group-hover:text-deepnavy">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="font-serif text-xl leading-snug text-cream">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-mutedwhite/75">{description}</p>
        <span className="mt-5 block h-px w-10 bg-gold/60 transition-all duration-300 group-hover:w-full" aria-hidden="true" />
      </div>
    </article>
  );
}
