import * as React from "react";
import type { ICanvasGroup } from "../../models/canvas";
import type { ContentState } from "../../models/ContentState";
import { Group } from "./Group";

export interface IGraphGroupsRendererProps {
  data: ContentState;
  groups: ICanvasGroup[];
}

export const GraphGroupsRenderer: React.FC<IGraphGroupsRendererProps> = (
  props
) => {
  return (
    <g>
      {React.useMemo(
        () =>
          props.groups.map((group) => {
            return <Group key={group.id} group={group} data={props.data} />;
          }),
        [props.groups, props.data]
      )}
    </g>
  );
};
