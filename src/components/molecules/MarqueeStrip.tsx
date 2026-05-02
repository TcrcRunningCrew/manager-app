interface MarqueeStripProps {
  text?: string;
}

export function MarqueeStrip({
  text = "RUN · RUN · RUN — KEEP THE PACE — ",
}: MarqueeStripProps) {
  return (
    <div className="marquee-strip">
      <div>{text}</div>
      <div>{text}</div>
      <div>{text}</div>
      <div>{text}</div>
    </div>
  );
}
