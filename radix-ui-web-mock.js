import React from 'react';

// Mock for @radix-ui/react-slot
export const Slot = React.forwardRef(({ children, ...props }, ref) => {
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ref: ref,
    });
  }
  return React.createElement('div', { ...props, ref }, children);
});

// Mock for @radix-ui/react-compose-refs
export const composeRefs = (...refs) => {
  return (node) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref != null) {
        ref.current = node;
      }
    });
  };
};

export default {
  Slot,
  composeRefs,
}; 