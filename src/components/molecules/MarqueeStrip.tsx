interface MarqueeStripProps {
  text?: string;
}

export function MarqueeStrip({
  text = "WE-RUN-TOGETHER / RUN- RUN - RUN-",
}: MarqueeStripProps) {
  return (
    <div className='marquee-strip'>
      <div>{text}</div>
      <div>{text}</div>
      <div>{text}</div>
      <div>{text}</div>
    </div>
  );
}
