
import React, { useState } from "react";
import { useProducts, Product } from "@/contexts/ProductContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddProductForm from "@/components/products/AddProductForm";

const Products = () => {
  const { products, isLoading } = useProducts();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Get unique categories for filter
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Apply filters and search
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === null || product.status === statusFilter;

    const matchesCategory =
      categoryFilter === null || product.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleRowClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <div className="flex space-x-2">
          {isAdmin && (
            <Button 
              onClick={() => setIsAddProductOpen(true)} 
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-sm"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 border-gray-200 rounded-lg"
            />
          </div>

          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center border-gray-200 text-gray-700 rounded-lg">
                  <Filter className="mr-2 h-4 w-4" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border border-gray-100 shadow-md rounded-lg">
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("In Stock")}>
                  In Stock
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Sold")}>
                  Sold
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center border-gray-200 text-gray-700 rounded-lg">
                  <Filter className="mr-2 h-4 w-4" />
                  Category
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border border-gray-100 shadow-md rounded-lg">
                <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                  All Categories
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category} 
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 rounded-lg">
                  <TableHead className="text-gray-600 font-medium rounded-l-lg">ID</TableHead>
                  <TableHead className="text-gray-600 font-medium">Name</TableHead>
                  <TableHead className="text-gray-600 font-medium">Category</TableHead>
                  <TableHead className="text-gray-600 font-medium">Status</TableHead>
                  <TableHead className="text-gray-600 font-medium">Stock</TableHead>
                  <TableHead className="text-gray-600 font-medium">Price</TableHead>
                  <TableHead className="text-gray-600 font-medium rounded-r-lg">Purchase Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                      No products found. Add your first product to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow 
                      key={product.id} 
                      onClick={() => handleRowClick(product.id)}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium">{product.productId}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <ProductStatusBadge status={product.status} stock={product.stock} />
                      </TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        {product.price ? `$${product.price.toFixed(2)}` : "-"}
                      </TableCell>
                      <TableCell>{formatDate(product.purchaseDate)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="bg-white rounded-xl border border-gray-200 shadow-xl p-0 overflow-hidden sm:max-w-[600px]">
          <DialogHeader className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <DialogTitle className="text-xl font-semibold text-gray-800">Add New Product</DialogTitle>
            <DialogDescription className="text-gray-600">
              Enter the details for the new product.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6">
            <AddProductForm onComplete={() => setIsAddProductOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ProductStatusBadgeProps {
  status: string;
  stock: number;
}

const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({ status, stock }) => {
  if (status === "Sold") {
    return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Sold</Badge>;
  }
  
  if (stock <= 2) {
    return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Low Stock</Badge>;
  }
  
  return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>;
};

// Helper function to format dates
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default Products;
