import * as React from "react";
import { IPropsAPI } from "..";
import { PropsAPIContext } from "../contexts";

export interface IPropsAPIContextProps {
  propsAPI: IPropsAPI;
}

export function withPropsAPIContext<
  IOriginalProps extends IPropsAPIContextProps
>(WrappedComponent: React.ComponentType<IOriginalProps>): React.ComponentClass {
  return class ComponentWithPropsAPIContext extends React.Component<
    Omit<IOriginalProps, "propsAPI">
  > {
    public static contextType = PropsAPIContext;
    public context!: React.ContextType<typeof PropsAPIContext>;

    public constructor(
      props: Omit<IOriginalProps, "propsAPI">,
      context: React.ContextType<typeof PropsAPIContext>
    ) {
      super(props, context);
    }

    public render(): React.ReactNode {
      const props = ({
        propsAPI: this.context,
        ...this.props
      } as unknown) as IOriginalProps;
      return React.createElement(WrappedComponent, props);
    }
  };
}
