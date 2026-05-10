import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

interface PageTransitionProps {
  children?: React.ReactNode;
}

function PageTransition({ children }: PageTransitionProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition timeout={300} classNames='fade' nodeRef={nodeRef}>
      <div ref={nodeRef}>{children}</div>
    </CSSTransition>
  );
}

export default PageTransition;
