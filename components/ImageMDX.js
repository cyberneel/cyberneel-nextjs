export default function ImageMDX({ src, alt, width = '100%', caption }) {
  return (
    <figure className="mx-auto" style={{ width }}>
      <img src={src} alt={alt} className="mx-auto" />
      {caption && <figcaption className="mt-2 text-center text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}
