type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  center?: boolean;
};

export default function SectionHeading({ eyebrow, title, intro, center }: Props) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
      <h2 className="text-h2 font-bold">{title}</h2>
      {intro && <p className="mt-3.5 text-lead text-bodytext">{intro}</p>}
    </div>
  );
}
