/* eslint-disable */
/**
 * AUTO-GENERATED STUB — will be overwritten by `npx convex dev`.
 */
import type { DataModelFromSchemaDefinition, DocumentByName, TableNamesInDataModel, SystemTableNames } from "convex/server";
import type { GenericId } from "convex/values";
import schema from "../schema.js";

type SchemaDefinition = typeof schema;

export type DataModel = DataModelFromSchemaDefinition<SchemaDefinition>;
export type TableNames = TableNamesInDataModel<DataModel>;
export type Doc<TableName extends TableNames> = DocumentByName<DataModel, TableName>;
export type Id<TableName extends TableNames | SystemTableNames> = GenericId<TableName>;
