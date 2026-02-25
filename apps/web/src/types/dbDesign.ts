/**
 * Database design / ER diagram types.
 * Backend can replace with real schema from API.
 */

export interface EntityAttribute {
  name: string;
  type: string;
  primaryKey?: boolean;
  nullable?: boolean;
  defaultValue?: string | null;
}

export interface Entity {
  id: string;
  name: string;
  displayName: string;
  attributes: EntityAttribute[];
  x?: number;
  y?: number;
}

export interface Relationship {
  id: string;
  name?: string;
  sourceEntityId: string;
  targetEntityId: string;
  type: "one-to-one" | "one-to-many" | "many-to-many";
  sourceCardinality?: string;
  targetCardinality?: string;
}

export interface DBSchema {
  id: string;
  name: string;
  description?: string;
  entities: Entity[];
  relationships: Relationship[];
  createdAt?: string;
}
