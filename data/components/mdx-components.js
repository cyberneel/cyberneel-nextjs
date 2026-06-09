import FontWrapper from '../../components/FontWrapper';

export const SectionTitle = ({ children, ...props }) => (
  <h2 className="font-display text-3xl mt-12 mb-2" {...props}>{children}</h2>
);

export const Text = ({ children, ...props }) => (
  <p className="leading-relaxed text-muted" {...props}>{children}</p>
);

export function useMDXComponents(components) {
  return {
    ...components,
    Font: FontWrapper,
    SectionTitle,
    Text,
  };
}
