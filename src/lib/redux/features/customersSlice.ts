import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Customer {
  id: string;
  name: string;
  email: string;
  registeredDate: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive" | "suspended";
  phone?: string;
  address?: string;
}

interface CustomersState {
  customers: Customer[];
  initialized: boolean;
}

const initialState: CustomersState = {
  customers: [],
  initialized: false,
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    initializeCustomers: (state) => {
      if (!state.initialized) {
        // Add mock customers for demonstration
        state.customers = [
          {
            id: "CUST-001",
            name: "John Doe",
            email: "john@example.com",
            phone: "+1 (555) 123-4567",
            address: "123 Main St, New York, NY 10001",
            registeredDate: "2025-12-15T10:30:00Z",
            totalOrders: 5,
            totalSpent: 243.95,
            status: "active",
          },
          {
            id: "CUST-002",
            name: "Sarah Wilson",
            email: "sarah@example.com",
            phone: "+1 (555) 234-5678",
            address: "456 Oak Ave, Los Angeles, CA 90001",
            registeredDate: "2026-01-05T14:20:00Z",
            totalOrders: 3,
            totalSpent: 165.97,
            status: "active",
          },
          {
            id: "CUST-003",
            name: "Mike Chen",
            email: "mike@example.com",
            phone: "+1 (555) 345-6789",
            address: "789 Pine Rd, Chicago, IL 60601",
            registeredDate: "2026-01-10T08:15:00Z",
            totalOrders: 2,
            totalSpent: 119.98,
            status: "active",
          },
          {
            id: "CUST-004",
            name: "Emma Davis",
            email: "emma@example.com",
            phone: "+1 (555) 456-7890",
            address: "321 Elm St, Houston, TX 77001",
            registeredDate: "2025-11-20T16:45:00Z",
            totalOrders: 8,
            totalSpent: 567.92,
            status: "active",
          },
          {
            id: "CUST-005",
            name: "Alex Johnson",
            email: "alex@example.com",
            phone: "+1 (555) 567-8901",
            address: "654 Maple Dr, Phoenix, AZ 85001",
            registeredDate: "2025-10-08T12:00:00Z",
            totalOrders: 1,
            totalSpent: 54.99,
            status: "suspended",
          },
          {
            id: "CUST-006",
            name: "Lisa Anderson",
            email: "lisa@example.com",
            phone: "+1 (555) 678-9012",
            address: "987 Cedar Ln, Philadelphia, PA 19101",
            registeredDate: "2026-01-18T09:30:00Z",
            totalOrders: 12,
            totalSpent: 1234.56,
            status: "active",
          },
          {
            id: "CUST-007",
            name: "David Brown",
            email: "david@example.com",
            phone: "+1 (555) 789-0123",
            registeredDate: "2025-09-12T11:15:00Z",
            totalOrders: 0,
            totalSpent: 0,
            status: "inactive",
          },
          {
            id: "CUST-008",
            name: "Jennifer Lee",
            email: "jennifer@example.com",
            phone: "+1 (555) 890-1234",
            address: "159 Birch St, San Antonio, TX 78201",
            registeredDate: "2026-01-20T15:20:00Z",
            totalOrders: 4,
            totalSpent: 289.96,
            status: "active",
          },
        ];
        state.initialized = true;
      }
    },

    updateCustomerStatus: (
      state,
      action: PayloadAction<{ customerId: string; status: Customer["status"] }>
    ) => {
      const customer = state.customers.find((c) => c.id === action.payload.customerId);
      if (customer) {
        customer.status = action.payload.status;
      }
    },

    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.unshift(action.payload);
    },

    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.customers.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },

    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.customers = state.customers.filter((c) => c.id !== action.payload);
    },
  },
});

export const {
  initializeCustomers,
  updateCustomerStatus,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} = customersSlice.actions;
export default customersSlice.reducer;
