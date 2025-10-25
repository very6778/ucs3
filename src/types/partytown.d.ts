declare module '@builder.io/partytown/react' {
  import { ComponentType, ReactNode } from 'react';

  interface PartytownProps {
    children?: ReactNode;
    debug?: boolean;
    forward?: string[];
    lib?: string;
  }

  export const Partytown: ComponentType<PartytownProps>;
} 