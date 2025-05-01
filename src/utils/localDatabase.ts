
/**
 * Simple localStorage-based database for product inventory
 */

import { Product, ProductHistory } from "@/contexts/ProductContext";

// Storage keys
const PRODUCTS_STORAGE_KEY = "stocksavvy_products";
const HISTORY_STORAGE_KEY = "stocksavvy_history";

// Get data from localStorage
export const getProducts = (): Product[] => {
  try {
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return storedProducts ? JSON.parse(storedProducts) : [];
  } catch (error) {
    console.error("Error retrieving products from localStorage:", error);
    return [];
  }
};

export const getProductHistory = (): ProductHistory[] => {
  try {
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch (error) {
    console.error("Error retrieving product history from localStorage:", error);
    return [];
  }
};

// Save data to localStorage
export const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Error saving products to localStorage:", error);
  }
};

export const saveProductHistory = (history: ProductHistory[]): void => {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Error saving product history to localStorage:", error);
  }
};

// Clear all data (for testing/reset)
export const clearDatabase = (): void => {
  localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  localStorage.removeItem(HISTORY_STORAGE_KEY);
};
