import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

const initialState = {
  orderList: [],
  orderDetails: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  filters: {
    status: '',
    search: '',
    startDate: '',
    endDate: '',
    sortBy: 'orderDate',
    sortOrder: 'desc',
  },
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "order/getAllOrdersForAdmin",
  async (params = {}, { getState }) => {
    const { pagination, filters } = getState().adminOrder;
    const { page, limit } = params.pagination || pagination;
    const { status, search, startDate, endDate, sortBy, sortOrder } = params.filters || filters;
    
    let url = `/api/admin/orders?page=${page}&limit=${limit}`;
    
    if (status) url += `&status=${status}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    if (sortBy) url += `&sortBy=${sortBy}`;
    if (sortOrder) url += `&sortOrder=${sortOrder}`;

    const response = await axios.get(url);
    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "order/getOrderDetailsForAdmin",
  async (id) => {
    const response = await axios.get(`/api/admin/orders/${id}`);
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await axios.patch(
      `/api/admin/orders/${id}/status`,
      { orderStatus }
    );
    return { order: response.data.data, id };
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Orders
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data.orders;
        state.pagination = {
          ...state.pagination,
          total: action.payload.data.pagination.total,
          totalPages: action.payload.data.pagination.totalPages,
        };
      })
      .addCase(getAllOrdersForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.orderList = [];
        toast.error("Failed to fetch orders");
      })
      
      // Get Order Details
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.orderDetails = null;
        toast.error("Failed to fetch order details");
      })
      
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { order, id } = action.payload;
        state.isLoading = false;
        
        // Update in order list
        state.orderList = state.orderList.map(item => 
          item._id === id ? { ...item, ...order } : item
        );
        
        // Update in order details if it's the current order
        if (state.orderDetails?._id === id) {
          state.orderDetails = { ...state.orderDetails, ...order };
        }
        
        toast.success("Order status updated successfully");
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        toast.error(action.error.message || "Failed to update order status");
      });
  },
});

export const { 
  resetOrderDetails, 
  setPagination, 
  setFilters, 
  resetFilters 
} = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
