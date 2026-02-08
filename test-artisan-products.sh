#!/bin/bash

# Test Artisan Products CRUD Operations

echo "=== Testing Artisan Products CRUD ==="
echo ""

# Base URL
BASE_URL="http://localhost:8080/api/seller"

# You need to replace this with a valid artisan token
# Login as artisan first and copy the token
TOKEN="YOUR_ARTISAN_TOKEN_HERE"

echo "1. Testing GET /api/seller/products"
curl -X GET "$BASE_URL/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

echo ""
echo ""

echo "2. Testing POST /api/seller/products (Create Product)"
curl -X POST "$BASE_URL/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Handcrafted Clay Pot",
    "description": "Beautiful handmade clay pot with traditional designs",
    "price": 1500,
    "originalPrice": 2000,
    "stock": 10,
    "category": "pottery",
    "subcategory": "Vases",
    "materials": ["Clay", "Natural Glaze"],
    "dimensions": "15cm x 15cm x 20cm",
    "weight": "800g",
    "colors": ["Red", "Brown", "Terracotta"],
    "tags": ["handmade", "traditional", "eco-friendly"],
    "shippingTime": "3-5 business days",
    "isHandmade": true,
    "isFeatured": false,
    "images": ["https://example.com/pot1.jpg"],
    "videos": []
  }'

echo ""
echo ""

echo "3. Testing GET /api/seller/products (Verify product was created)"
curl -X GET "$BASE_URL/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

echo ""
echo ""
echo "=== Test Complete ==="
echo "Check the responses above to verify:"
echo "- Product was created with approvalStatus: 'pending'"
echo "- Product appears in the products list"
echo "- All fields match the input"
