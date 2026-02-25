import type { DBSchema } from "@/types/dbDesign";

export const sampleDBSchema: DBSchema = {
  id: "sample-db-1",
  name: "Sample Schema",
  description: "Sample ER schema for development. Replace with API when backend is available.",
  entities: [
    {
      id: "user",
      name: "user",
      displayName: "User",
      attributes: [
        { name: "id", type: "UUID", primaryKey: true },
        { name: "email", type: "VARCHAR(255)", nullable: false },
        { name: "created_at", type: "TIMESTAMP", nullable: false },
      ],
    },
    {
      id: "order",
      name: "order",
      displayName: "Order",
      attributes: [
        { name: "id", type: "UUID", primaryKey: true },
        { name: "user_id", type: "UUID", nullable: false },
        { name: "total", type: "DECIMAL(10,2)" },
        { name: "status", type: "VARCHAR(50)" },
      ],
    },
    {
      id: "order_item",
      name: "order_item",
      displayName: "OrderItem",
      attributes: [
        { name: "id", type: "UUID", primaryKey: true },
        { name: "order_id", type: "UUID", nullable: false },
        { name: "product_id", type: "UUID", nullable: false },
        { name: "quantity", type: "INTEGER" },
      ],
    },
  ],
  relationships: [
    { id: "r1", sourceEntityId: "user", targetEntityId: "order", type: "one-to-many" },
    { id: "r2", sourceEntityId: "order", targetEntityId: "order_item", type: "one-to-many" },
  ],
  createdAt: new Date().toISOString(),
};
