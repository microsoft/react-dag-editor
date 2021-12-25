import { IWithPropertiesRecord } from "core";

export type $Model<T> = Omit<T, "properties"> & IWithPropertiesRecord;
