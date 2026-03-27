import React from 'react'

export interface PropsWithForwardedRef<T = unknown> extends React.PropsWithChildren {
  forwardedRef?: React.Ref<T> | undefined;
}

export const withForwardedRef = (Component) => {
  const forwardRef = (props, ref) => <Component {...props} forwardedRef={ref} />
  return React.forwardRef(forwardRef)
}
