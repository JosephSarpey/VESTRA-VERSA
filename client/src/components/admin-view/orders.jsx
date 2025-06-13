import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button as ShadButton } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Eye, Search, Filter, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { 
  getAllOrdersForAdmin, 
  getOrderDetailsForAdmin, 
  resetOrderDetails,
  setPagination,
  setFilters,
  resetFilters 
} from "@/store/admin/order-slice";
import AdminOrderDetailsView from "./order-details";

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const sortOptions = [
  { value: "createdAt:desc", label: "Newest First" },
  { value: "createdAt:asc", label: "Oldest First" },
  { value: "totalAmount:desc", label: "Amount (High to Low)" },
  { value: "totalAmount:asc", label: "Amount (Low to High)" },
];

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [searchQuery, setSearchQuery] = useState("");
  
  const dispatch = useDispatch();
  const { 
    orderList, 
    orderDetails, 
    isLoading, 
    error, 
    pagination, 
    filters 
  } = useSelector((state) => state.adminOrder);
  
  const { page, limit, total, totalPages } = pagination;
  const { status } = filters;

  // Fetch orders when filters or pagination changes
  useEffect(() => {
    const params = {
      pagination: { page, limit },
      filters: {
        ...filters,
        startDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
        endDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : '',
        search: searchQuery,
      },
    };
    
    const timer = setTimeout(() => {
      dispatch(getAllOrdersForAdmin(params));
    }, 500);
    
    return () => clearTimeout(timer);
  }, [page, limit, status, dateRange, searchQuery, dispatch]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Reset to first page when searching
    dispatch(setPagination({ page: 1 }));
  };

  const handleStatusChange = (value) => {
    dispatch(setFilters({ status: value }));
  };

  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.split(':');
    dispatch(setFilters({ sortBy, sortOrder }));
  };

  const handleItemsPerPageChange = (value) => {
    dispatch(setPagination({ limit: Number(value), page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPagination({ page: newPage }));
    }
  };

  const handleResetFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setSearchQuery("");
    dispatch(resetFilters());
  };

  const handleFetchOrderDetails = (id) => {
    dispatch(getOrderDetailsForAdmin(id));
  };

  // Calculate pagination range
  const getPageRange = () => {
    const range = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, page - half);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
    }
    
    return range;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Manage and track customer orders</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              <X className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            
            <Select onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Orders Table */}
          <div className="rounded-md border
            {isLoading ? 'opacity-50 pointer-events-none' : ''}
          ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-destructive">
                      Error loading orders: {error}
                    </TableCell>
                  </TableRow>
                ) : orderList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orderList.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        <div className="truncate max-w-[150px]" title={order._id}>
                          {order._id}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="truncate max-w-[150px]" title={order.userName || 'N/A'}>
                          {order.userName || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            'capitalize',
                            order.orderStatus === 'delivered' && 'bg-green-100 text-green-800 border-green-200',
                            order.orderStatus === 'cancelled' && 'bg-red-100 text-red-800 border-red-200',
                            order.orderStatus === 'processing' && 'bg-blue-100 text-blue-800 border-blue-200',
                            order.orderStatus === 'shipped' && 'bg-purple-100 text-purple-800 border-purple-200',
                            order.orderStatus === 'pending' && 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          )}
                        >
                          {order.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ${order.totalAmount?.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={(open) => {
                            setOpenDetailsDialog(open);
                            if (!open) dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleFetchOrderDetails(order._id)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                          {orderDetails && <AdminOrderDetailsView orderDetails={orderDetails} />}
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * limit, total)}
                </span>{' '}
                of <span className="font-medium">{total}</span> orders
              </p>
              <Select
                value={limit.toString()}
                onValueChange={(value) => handleItemsPerPageChange(value)}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={limit} />
                </SelectTrigger>
                <SelectContent side="top">
                  {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">per page</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {getPageRange().map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  className="h-8 w-8 p-0"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}
              
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => handlePageChange(totalPages)}
                disabled={page >= totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminOrdersView;
