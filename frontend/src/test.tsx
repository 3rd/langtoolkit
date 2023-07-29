import React, { ElementType, ForwardedRef, ReactElement, forwardRef } from "react";

// type LinkProps<T extends ElementType> = React.ComponentPropsWithoutRef<T> &
//   React.RefAttributes<T> & {
//     as?: T;
//   };
// function UnwrappedLink<T extends ElementType>(props: LinkProps<T>, ref: ForwardedRef<T>) {
//   const { as: Comp = "a", ...rest } = props;
//   return <Comp ref={ref} {...rest} />;
// }
// type FixedForwardRef = <T extends ElementType = "a">(
//   render: (props: LinkProps<T>, ref: ForwardedRef<T>) => React.ReactNode
// ) => (props: LinkProps<T>) => React.ReactNode;
// const fixedForwardRef = forwardRef as FixedForwardRef;
// export const WrappedLink = fixedForwardRef(UnwrappedLink);

type LinkProps<T extends ElementType = "a"> = React.ComponentPropsWithoutRef<T> &
  React.RefAttributes<T> & {
    as?: T;
  };
function UnwrappedLink<T extends ElementType>(props: LinkProps<T>, ref: ForwardedRef<T>) {
  const { as: Comp = "a", ...rest } = props;
  return <Comp ref={ref} {...rest} />;
}

type FixedForwardRef = <T extends ElementType = "a">(
  render: (props: LinkProps<T>, ref: ForwardedRef<T>) => React.ReactNode
) => (props: LinkProps<T>) => React.ReactNode;

export const WrappedLink = (forwardRef as FixedForwardRef)(UnwrappedLink);

type Args = {
  a: string;
  b: number;
  c: boolean;
};
type List = keyof Args;

const createWithDefault = <T extends Obj>({ k }: T): T => {
  return obj;
};

//-----------------------------------------------------------------------------------------

const x = {} as LinkProps;

<WrappedLink
  onClick={(e) => {
    console.log(e);
  }}
/>;

<WrappedLink
  as="button"
  onClick={(e) => {
    console.log(e);
  }}
/>;
