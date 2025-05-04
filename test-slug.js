// Test script for Vietnamese to slug conversion
try {
  console.log('Starting test...');
  
  const vietnameseTests = [
    'Đây là một tiêu đề tiếng Việt có dấu',
    'Thông tin mới nhất về Covid-19 tại Việt Nam',
    'Cách làm món bánh xèo ngon tuyệt',
    'Hà Nội ô nhiễm không khí nghiêm trọng',
    'Động đất mạnh 6,5 độ richter',
    'Tiêu đề bài viết nè =))'
  ];

  console.log('Test strings defined');

  // Function to normalize Vietnamese text and create slug
  function createSlug(text) {
    console.log(`Processing: "${text}"`);
    
    try {
      // Step 1: Convert Vietnamese to non-accented
      const normalized = text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
      
      console.log(`Normalized: "${normalized}"`);
      
      // Step 2: Create slug
      const slug = normalized
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove all non-word chars (including =, ), (, etc.)
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single one
        .trim()
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      
      console.log(`Final slug: "${slug}"`);
      
      return slug;
    } catch (err) {
      console.error('Error in createSlug:', err);
      return '';
    }
  }

  console.log('Starting tests...');
  
  // Test each title
  vietnameseTests.forEach((title, index) => {
    console.log(`\nTest #${index + 1}:`);
    console.log('Original:', title);
    console.log('Slug:', createSlug(title));
    console.log('---');
  });
  
  console.log('All tests completed.');
} catch (err) {
  console.error('Test failed with error:', err);
} 