import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrderItem {
  id: number;
  title: string;
  price: string;
  quantity: number;
  productType: "key" | "account";
  category: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
}

interface OrdersState {
  orders: Order[];
  initialized: boolean;
}

const initialState: OrdersState = {
  orders: [],
  initialized: false,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    initializeOrders: (state) => {
      if (!state.initialized) {
        // Add some mock orders for demonstration
        state.orders = [
          {
            id: "ORD-001",
            customerName: "John Doe",
            customerEmail: "john@example.com",
            orderDate: "2026-01-23T10:30:00Z",
            status: "completed",
            items: [
              {
                id: 1,
                title: "Elden Ring: Shadow of the Erdtree",
                price: "$39.99",
                quantity: 1,
                productType: "key",
                category: "RPG",
              },
            ],
            subtotal: 39.99,
            tax: 4.0,
            total: 43.99,
            paymentMethod: "Credit Card",
          },
          {
            id: "ORD-002",
            customerName: "Sarah Wilson",
            customerEmail: "sarah@example.com",
            orderDate: "2026-01-23T14:20:00Z",
            status: "processing",
            items: [
              {
                id: 2,
                title: "Cyberpunk 2077: Ultimate Edition",
                price: "$29.99",
                quantity: 1,
                productType: "account",
                category: "Action",
              },
              {
                id: 101,
                title: "Windows 11 Pro Retail Key",
                price: "$14.99",
                quantity: 2,
                productType: "key",
                category: "OS",
              },
            ],
            subtotal: 59.97,
            tax: 6.0,
            total: 65.97,
            paymentMethod: "PayPal",
          },
          {
            id: "ORD-003",
            customerName: "Mike Chen",
            customerEmail: "mike@example.com",
            orderDate: "2026-01-24T08:15:00Z",
            status: "pending",
            items: [
              {
                id: 3,
                title: "Minecraft: Java & Bedrock Edition",
                price: "$19.99",
                quantity: 3,
                productType: "key",
                category: "Sandbox",
              },
            ],
            subtotal: 59.97,
            tax: 6.0,
            total: 65.97,
            paymentMethod: "Credit Card",
          },
          {
            id: "ORD-004",
            customerName: "Emma Davis",
            customerEmail: "emma@example.com",
            orderDate: "2026-01-22T16:45:00Z",
            status: "completed",
            items: [
              {
                id: 102,
                title: "Microsoft Office 2021 Pro Plus",
                price: "$24.99",
                quantity: 1,
                productType: "key",
                category: "Productivity",
              },
            ],
            subtotal: 24.99,
            tax: 2.5,
            total: 27.49,
            paymentMethod: "Credit Card",
          },
          {
            id: "ORD-005",
            customerName: "Alex Johnson",
            customerEmail: "alex@example.com",
            orderDate: "2026-01-21T12:00:00Z",
            status: "cancelled",
            items: [
              {
                id: 4,
                title: "God of War Ragnarök",
                price: "$49.99",
                quantity: 1,
                productType: "account",
                category: "Adventure",
              },
            ],
            subtotal: 49.99,
            tax: 5.0,
            total: 54.99,
            paymentMethod: "PayPal",
          },
        ];
        state.initialized = true;
      }
    },

    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: Order["status"] }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },

    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },

    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
    },
  },
});

export const { initializeOrders, updateOrderStatus, addOrder, deleteOrder } =
  ordersSlice.actions;
export default ordersSlice.reducer;
