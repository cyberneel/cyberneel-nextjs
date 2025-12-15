import FontWrapper from '../../components/FontWrapper';

export const SectionTitle = ({ children, ...props }) => (
  <h2 className="section-title" {...props}>{children}</h2>
)

export const Text = ({ children, ...props }) => (
  <p className="mdx-text" {...props}>{children}</p>
)

export function useMDXComponents(components) {
  return {
    ...components,
    Font: FontWrapper,
    SectionTitle,
    Text,
  }
}