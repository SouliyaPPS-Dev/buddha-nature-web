import React, { forwardRef } from 'react';
import { CSSTransition } from 'react-transition-group';

interface PageTransitionProps {
  children?: React.ReactNode;
}

const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ children }, ref) => (
    <CSSTransition timeout={300} classNames='fade' nodeRef={ref}>
      <div ref={ref}>{children}</div>
    </CSSTransition>
  )
);

export default PageTransition;
