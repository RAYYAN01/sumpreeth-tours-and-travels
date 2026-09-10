type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  center?: boolean;
};

export default function SectionHeading({ eyebrow, title, intro, center }: Props) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-saffron-600">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      {intro && <p className="mt-3 text-bodytext">{intro}</p>}
    </div>
  );
}
