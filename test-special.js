// Test for special characters in title
const title = 'Tiêu đề bài viết nè =))';

console.log('Original title:', title);

// Step 1: Convert Vietnamese to non-accented
const normalized = title
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '') // Remove accents
  .replace(/đ/g, 'd')
  .replace(/Đ/g, 'D');

console.log('Normalized:', normalized);

// Step 2: Create slug but keep special characters
const slug = normalized
  .toLowerCase()
  .replace(/\s+/g, '-') // Replace spaces with hyphens
  .replace(/-+/g, '-') // Replace multiple hyphens with single one
  .trim()
  .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

console.log('Final slug:', slug); 