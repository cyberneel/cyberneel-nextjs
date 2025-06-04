import FontWrapper from '../../components/FontWrapper';

export function useMDXComponents(components) {
    return {
      ...components,
      Font: FontWrapper,
    }
  }