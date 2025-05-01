
/**
 * Firebase Firestore database for product inventory
 */

import { Product, ProductHistory } from "@/contexts/ProductContext";
import { db } from "./firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  setDoc
} from "firebase/firestore";

// Collection names
const PRODUCTS_COLLECTION = "products";
const HISTORY_COLLECTION = "product_history";

// Get data from Firestore
export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsCollection = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error("Error retrieving products from Firestore:", error);
    return [];
  }
};

export const getProductHistory = async (): Promise<ProductHistory[]> => {
  try {
    const historyCollection = collection(db, HISTORY_COLLECTION);
    const snapshot = await getDocs(historyCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductHistory));
  } catch (error) {
    console.error("Error retrieving product history from Firestore:", error);
    return [];
  }
};

// Save data to Firestore
export const saveProduct = async (product: Product): Promise<string> => {
  try {
    if (product.id) {
      // Update existing product
      const productRef = doc(db, PRODUCTS_COLLECTION, product.id);
      await updateDoc(productRef, { ...product });
      return product.id;
    } else {
      // Add new product
      const newProduct = { ...product };
      delete newProduct.id; // Remove id field for new products
      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), newProduct);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error saving product to Firestore:", error);
    throw error;
  }
};

export const saveProducts = async (products: Product[]): Promise<void> => {
  try {
    // This is a batch operation example
    for (const product of products) {
      await saveProduct(product);
    }
  } catch (error) {
    console.error("Error saving products to Firestore:", error);
  }
};

export const saveProductHistory = async (history: ProductHistory): Promise<string> => {
  try {
    if (history.id) {
      // Update existing history
      const historyRef = doc(db, HISTORY_COLLECTION, history.id);
      await updateDoc(historyRef, { ...history });
      return history.id;
    } else {
      // Add new history entry
      const newHistory = { ...history };
      delete newHistory.id; // Remove id field for new entries
      const docRef = await addDoc(collection(db, HISTORY_COLLECTION), newHistory);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error saving history to Firestore:", error);
    throw error;
  }
};

export const saveProductHistoryBatch = async (historyItems: ProductHistory[]): Promise<void> => {
  try {
    for (const item of historyItems) {
      await saveProductHistory(item);
    }
  } catch (error) {
    console.error("Error saving product history to Firestore:", error);
  }
};

// Delete product
export const deleteProductFromDb = async (id: string): Promise<void> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product from Firestore:", error);
    throw error;
  }
};

// Get history for a specific product
export const getHistoryForProduct = async (productId: string): Promise<ProductHistory[]> => {
  try {
    const historyCollection = collection(db, HISTORY_COLLECTION);
    const q = query(historyCollection, where("productId", "==", productId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductHistory));
  } catch (error) {
    console.error("Error retrieving product history from Firestore:", error);
    return [];
  }
};

// Clear all data (for testing/reset)
export const clearDatabase = async (): Promise<void> => {
  // This function is left as a placeholder
  // In a real app, you would implement proper clearing logic
  console.warn("clearDatabase not implemented for Firestore");
};
