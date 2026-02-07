interface SectionHeadingProps {
  title: string;
}

const SectionHeading = ({ title }: SectionHeadingProps) => (
  <h2 className="text-2xl font-serif text-white mb-6 pb-3 border-b border-white/20">
    {title}
  </h2>
);

export default SectionHeading;
