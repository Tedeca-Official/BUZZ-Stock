
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  getProducts, 
  getProductHistory, 
  saveProduct, 
  saveProducts, 
  saveProductHistory, 
  saveProductHistoryBatch,
  deleteProductFromDb,
  getHistoryForProduct as getHistoryForProductFromDb
} from "@/utils/localDatabase";

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
  salePrice?: number;
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
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  markAsSold: (id: string, saleDate: string, quantity: number, salePrice?: number) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getHistoryForProduct: (productId: string) => ProductHistory[];
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  productHistory: [],
  addProduct: async () => {},
  updateProduct: async () => {},
  markAsSold: async () => {},
  deleteProduct: async () => {},
  getProductById: () => undefined,
  getHistoryForProduct: () => [],
  isLoading: true,
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productHistory, setProductHistory] = useState<ProductHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data from Firebase on initial render
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedProducts = await getProducts();
        const fetchedHistory = await getProductHistory();
        
        setProducts(fetchedProducts);
        setProductHistory(fetchedHistory);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Add new product
  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const newProduct = {
        ...product,
        id: generateId(), // This ID will be replaced by Firestore's ID
      };

      const productId = await saveProduct(newProduct as Product);
      
      // Update the product with the correct Firestore ID
      const savedProduct = { ...newProduct, id: productId };
      setProducts([...products, savedProduct]);

      // Add purchase to history
      const newHistory: ProductHistory = {
        id: generateId(),
        productId,
        date: product.purchaseDate,
        type: "purchase",
        quantity: product.stock,
        price: product.price || undefined,
      };

      await saveProductHistory(newHistory);
      setProductHistory([...productHistory, { ...newHistory, id: productId }]);
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  // Update product
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const updatedProducts = products.map((product) => {
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
              
              // We'll save history at the end
              saveProductHistory(newHistory).then((historyId) => {
                setProductHistory([...productHistory, { ...newHistory, id: historyId }]);
              });
            }
          }
          
          const updatedProduct = { ...product, ...updates };
          // Save to Firebase
          saveProduct(updatedProduct);
          return updatedProduct;
        }
        return product;
      });
      
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  // Mark product as sold
  const markAsSold = async (id: string, saleDate: string, quantity: number, salePrice?: number) => {
    try {
      const product = products.find((p) => p.id === id);
      if (!product) return;

      // Calculate remaining stock
      const remainingStock = Math.max(0, product.stock - quantity);
      const status = remainingStock > 0 ? "In Stock" : "Sold";

      // Update product
      await updateProduct(id, {
        status,
        stock: remainingStock,
        saleDate,
        saleQuantity: quantity,
        salePrice: salePrice || product.price || undefined,
      });

      // Add sale to history
      const newHistory: ProductHistory = {
        id: generateId(),
        productId: id,
        date: saleDate,
        type: "sale",
        quantity,
        price: salePrice || product.price || undefined,
      };

      const historyId = await saveProductHistory(newHistory);
      setProductHistory([...productHistory, { ...newHistory, id: historyId }]);
    } catch (error) {
      console.error("Error marking product as sold:", error);
      throw error;
    }
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    try {
      await deleteProductFromDb(id);
      setProducts(products.filter((product) => product.id !== id));
      // Note: We keep the history for reporting purposes
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
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
        isLoading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
