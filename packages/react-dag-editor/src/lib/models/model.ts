import { IWithPropertiesRecord } from "../property";

export type $Model<T> = Omit<T, "properties"> & IWithPropertiesRecord;
