import type { LLDDesign } from "@/types/lldDesign";

export const sampleLLDDesign: LLDDesign = {
  id: "sample-lld-1",
  name: "Sample LLD",
  description: "Sample class diagram and API for development. Replace with API when backend is available.",
  classes: [
    {
      id: "UserService",
      name: "UserService",
      properties: [
        { name: "userRepo", type: "UserRepository", visibility: "private" },
        { name: "logger", type: "Logger", visibility: "private" },
      ],
      methods: [
        { name: "getById", returnType: "Promise<User>", parameters: [{ name: "id", type: "string" }], visibility: "public" },
        { name: "create", returnType: "Promise<User>", parameters: [{ name: "dto", type: "CreateUserDto" }], visibility: "public" },
      ],
    },
    {
      id: "OrderService",
      name: "OrderService",
      properties: [
        { name: "orderRepo", type: "OrderRepository", visibility: "private" },
        { name: "userService", type: "UserService", visibility: "private" },
      ],
      methods: [
        { name: "placeOrder", returnType: "Promise<Order>", parameters: [{ name: "userId", type: "string" }, { name: "items", type: "OrderItem[]" }], visibility: "public" },
      ],
    },
  ],
  apis: [
    {
      id: "main-api",
      name: "Main API",
      basePath: "/api/v1",
      endpoints: [
        { id: "e1", method: "GET", path: "/users/:id", summary: "Get user by ID", responseType: "User" },
        { id: "e2", method: "POST", path: "/users", summary: "Create user", requestBody: "CreateUserDto", responseType: "User" },
        { id: "e3", method: "POST", path: "/orders", summary: "Place order", requestBody: "PlaceOrderDto", responseType: "Order" },
      ],
    },
  ],
  createdAt: new Date().toISOString(),
};
