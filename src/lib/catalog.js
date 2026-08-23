import fs from 'fs';
import path from 'path';

export async function getProducts() {
  const filePath = path.join(process.cwd(), 'public', 'product-assets', 'data.json');
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to load products:', error);
    return [];
  }
}

export async function getCategories() {
  const filePath = path.join(process.cwd(), 'public', 'category-assets', 'data.json');
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to load categories:', error);
    return [];
  }
}

export async function getJournalPosts() {
  const filePath = path.join(process.cwd(), 'public', 'blog-assets', 'data.json');
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to load journal posts:', error);
    return [];
  }
}
