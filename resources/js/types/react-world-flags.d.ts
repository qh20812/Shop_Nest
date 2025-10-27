declare module 'react-world-flags' {
  interface FlagProps {
    code: string;
    fallback?: React.ReactNode;
    [key: string]: unknown;
  }
  const Flag: React.ComponentType<FlagProps>;
  export default Flag;
}