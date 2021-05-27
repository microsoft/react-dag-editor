import * as React from "react";
import { IPanelContext, PanelContext } from "../contexts";

interface ISidePanelProps {
  svgRef: React.RefObject<SVGSVGElement>;
}

export const SidePanel: React.FunctionComponent<ISidePanelProps> = props => {
  const panelContext = React.useContext<IPanelContext>(PanelContext);
  const { name, data } = panelContext.state;

  if (!name) {
    return null;
  }

  const panelConfig = panelContext.configList.get(name);

  if (!panelConfig) {
    return null;
  }

  return (
    <div className="side-panel-container">
      {panelConfig.render(data, props.svgRef)}
    </div>
  );
};
