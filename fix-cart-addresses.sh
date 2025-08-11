#!/bin/bash

# Fix cart addresses issue by adding Lithuania to Europe region
# This script adds Lithuania country to the existing Europe region

echo "🔧 Fixing cart addresses issue - Adding Lithuania to Europe region..."

# Environment variables
MEDUSA_BACKEND_URL="https://gyva.appiolabs.com"
REGION_ID="reg_01K296PMYVZ4W5Y8MCAKBC4J4E"

# First, let's create the Lithuania country if it doesn't exist
echo "📍 Creating Lithuania country..."

# Create Lithuania country
LITHUANIA_RESPONSE=$(curl -s -X POST "${MEDUSA_BACKEND_URL}/admin/countries" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST "${MEDUSA_BACKEND_URL}/admin/auth/token" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@medusajs.com","password":"supersecret"}' | jq -r '.access_token')" \
  -d '{
    "iso_2": "lt",
    "iso_3": "ltu", 
    "num_code": "440",
    "name": "LITHUANIA",
    "display_name": "Lithuania",
    "region_id": "'${REGION_ID}'"
  }' 2>/dev/null)

echo "Lithuania creation response: $LITHUANIA_RESPONSE"

# Alternative approach: Update the region to include Lithuania
echo "🌍 Adding Lithuania to Europe region..."

# Get admin token
echo "🔑 Getting admin token..."
ADMIN_TOKEN=$(curl -s -X POST "${MEDUSA_BACKEND_URL}/admin/auth/token" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medusajs.com","password":"supersecret"}' | jq -r '.access_token')

if [ "$ADMIN_TOKEN" = "null" ] || [ -z "$ADMIN_TOKEN" ]; then
  echo "❌ Failed to get admin token. Please check admin credentials."
  exit 1
fi

echo "✅ Admin token obtained successfully"

# Add Lithuania to region via countries endpoint
echo "🇱🇹 Adding Lithuania to Europe region..."
ADD_COUNTRY_RESPONSE=$(curl -s -X POST "${MEDUSA_BACKEND_URL}/admin/regions/${REGION_ID}/countries" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{"country_code": "lt"}')

echo "Add country response: $ADD_COUNTRY_RESPONSE"

# Verify the fix
echo "🔍 Verifying Lithuania is now in Europe region..."
VERIFICATION=$(curl -s "${MEDUSA_BACKEND_URL}/store/regions" \
  -H "x-publishable-api-key: pk_9bc413fe9e6f35947ecdbc997880ce9228be7fe34a55a6d202af4facfc4301a4" | \
  jq -r '.regions[0].countries[] | select(.iso_2 == "lt") | .display_name')

if [ "$VERIFICATION" = "Lithuania" ]; then
  echo "✅ SUCCESS: Lithuania is now properly added to Europe region!"
  echo "🎉 Cart addresses issue should now be fixed!"
else
  echo "❌ FAILED: Lithuania was not added to the region."
  echo "📋 Current countries in Europe region:"
  curl -s "${MEDUSA_BACKEND_URL}/store/regions" \
    -H "x-publishable-api-key: pk_9bc413fe9e6f35947ecdbc997880ce9228be7fe34a55a6d202af4facfc4301a4" | \
    jq -r '.regions[0].countries[].display_name'
fi

echo "🏁 Cart address fix script completed!"
