import * as React from "react";
import { ICanvasGroup } from "../../Graph.interface";
import { GraphModel } from "../../models/GraphModel";
import { Group } from "./Group";

export interface IGraphGroupsRendererProps {
  data: GraphModel;
  groups: ICanvasGroup[];
}

export const GraphGroupsRenderer: React.FC<IGraphGroupsRendererProps> = props => {
  return (
    <g>
      {React.useMemo(
        () =>
          props.groups.map(group => {
            return <Group key={group.id} group={group} data={props.data} />;
          }),
        [props.groups, props.data]
      )}
    </g>
  );
};
