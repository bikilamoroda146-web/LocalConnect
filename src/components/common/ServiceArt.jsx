import { categoryById } from '../../data/categories'
// Stand-in "photo" panel: tinted category illustration. Replace with real photography via the `src` prop.
export default function ServiceArt({ category, hue = 160, src, alt = '', className = 'h-40', size = 56 }) {
  if (src) return <img src={src} alt={alt} className={`w-full object-cover ${className}`} loading="lazy" />
  const Icon = categoryById(category)?.icon
  return (
    <div role="img" aria-label={alt || 'Service illustration'} className={`flex w-full items-center justify-center ${className}`} style={{ background: `hsl(${hue} 32% 91%)`, color: `hsl(${hue} 50% 28%)` }}>
      {Icon && <Icon size={size} strokeWidth={1.25} aria-hidden="true" />}
    </div>
  )
}
