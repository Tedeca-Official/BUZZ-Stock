import React, { createContext, useContext, useState, useEffect } from "react";
import { getProducts, getProductHistory, saveProducts, saveProductHistory } from "@/utils/localDatabase";

export interface Product {
  id: string;
  productId: string;
  name: string;
  purchaseDate: string;
  status: "In Stock" | "Sold";
  stock: number;
  price: number | null;
  category: string;
  saleDate?: string;
  saleQuantity?: number;
}

export interface ProductHistory {
  id: string;
  productId: string;
  date: string;
  type: "purchase" | "sale";
  quantity: number;
  price?: number;
}

interface ProductContextType {
  products: Product[];
  productHistory: ProductHistory[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  markAsSold: (id: string, saleDate: string, quantity: number) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getHistoryForProduct: (productId: string) => ProductHistory[];
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  productHistory: [],
  addProduct: () => {},
  updateProduct: () => {},
  markAsSold: () => {},
  deleteProduct: () => {},
  getProductById: () => undefined,
  getHistoryForProduct: () => [],
});

// Sample initial product data
const initialProducts: Product[] = [
  {
    id: "1",
    productId: "iph13",
    name: "iPhone 13 Pro",
    purchaseDate: "2023-01-15",
    status: "In Stock",
    stock: 5,
    price: 999,
    category: "Mobile Phones",
  },
  {
    id: "2",
    productId: "sam22",
    name: "Samsung Galaxy S22",
    purchaseDate: "2023-02-10",
    status: "In Stock",
    stock: 3,
    price: 899,
    category: "Mobile Phones",
  },
  {
    id: "3",
    productId: "mba13",
    name: "MacBook Air M2",
    purchaseDate: "2023-01-20",
    status: "Sold",
    stock: 0,
    price: 1299,
    category: "Laptops",
    saleDate: "2023-03-15",
    saleQuantity: 2,
  },
  {
    id: "4",
    productId: "dxps13",
    name: "Dell XPS 13",
    purchaseDate: "2023-03-05",
    status: "In Stock",
    stock: 2,
    price: 1199,
    category: "Laptops",
  },
];

// Sample initial history data
const initialHistory: ProductHistory[] = [
  {
    id: "h1",
    productId: "1",
    date: "2023-01-15",
    type: "purchase",
    quantity: 5,
    price: 999,
  },
  {
    id: "h2",
    productId: "2",
    date: "2023-02-10",
    type: "purchase",
    quantity: 3,
    price: 899,
  },
  {
    id: "h3",
    productId: "3",
    date: "2023-01-20",
    type: "purchase",
    quantity: 2,
    price: 1299,
  },
  {
    id: "h4",
    productId: "3",
    date: "2023-03-15",
    type: "sale",
    quantity: 2,
    price: 1349,
  },
  {
    id: "h5",
    productId: "4",
    date: "2023-03-05",
    type: "purchase",
    quantity: 2,
    price: 1199,
  },
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Load data from localStorage on initial render
  const [products, setProducts] = useState<Product[]>([]);
  const [productHistory, setProductHistory] = useState<ProductHistory[]>([]);
  
  // Load data from localStorage on initial render
  useEffect(() => {
    setProducts(getProducts());
    setProductHistory(getProductHistory());
  }, []);
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    saveProducts(products);
  }, [products]);
  
  useEffect(() => {
    saveProductHistory(productHistory);
  }, [productHistory]);

  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Add new product
  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: generateId(),
    };

    setProducts([...products, newProduct]);

    // Add purchase to history
    const newHistory: ProductHistory = {
      id: generateId(),
      productId: newProduct.id,
      date: product.purchaseDate,
      type: "purchase",
      quantity: product.stock,
      price: product.price || undefined,
    };

    setProductHistory([...productHistory, newHistory]);
  };

  // Update product
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          // If stock is being updated, add to history
          if (updates.stock !== undefined && product.stock !== updates.stock) {
            const stockDifference = (updates.stock || 0) - product.stock;
            if (stockDifference > 0) {
              const newHistory: ProductHistory = {
                id: generateId(),
                productId: id,
                date: new Date().toISOString().split('T')[0],
                type: "purchase",
                quantity: stockDifference,
                price: updates.price || product.price || undefined,
              };
              setProductHistory([...productHistory, newHistory]);
            }
          }
          
          return { ...product, ...updates };
        }
        return product;
      })
    );
  };

  // Mark product as sold
  const markAsSold = (id: string, saleDate: string, quantity: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    // Calculate remaining stock
    const remainingStock = Math.max(0, product.stock - quantity);
    const status = remainingStock > 0 ? "In Stock" : "Sold";

    // Update product
    updateProduct(id, {
      status,
      stock: remainingStock,
      saleDate,
      saleQuantity: quantity,
    });

    // Add sale to history
    const newHistory: ProductHistory = {
      id: generateId(),
      productId: id,
      date: saleDate,
      type: "sale",
      quantity,
      price: product.price || undefined,
    };

    setProductHistory([...productHistory, newHistory]);
  };

  // Delete product
  const deleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
    // Note: We keep the history for reporting purposes
  };

  // Get product by ID
  const getProductById = (id: string) => {
    return products.find((product) => product.id === id);
  };

  // Get history for a product
  const getHistoryForProduct = (productId: string) => {
    return productHistory.filter((history) => history.productId === productId);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        productHistory,
        addProduct,
        updateProduct,
        markAsSold,
        deleteProduct,
        getProductById,
        getHistoryForProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
