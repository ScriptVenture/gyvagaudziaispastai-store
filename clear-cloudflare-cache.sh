#!/bin/bash

# Cloudflare API script to clear cache
# You need to replace these values with your actual Cloudflare credentials

ZONE_ID="your_zone_id_here"
API_TOKEN="your_api_token_here"
EMAIL="your_cloudflare_email_here"

# Option 1: Purge everything
echo "Purging all cache..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

# Option 2: Purge specific URLs (uncomment to use instead)
echo "Purging specific cart API URLs..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "files": [
      "https://gyva.appiolabs.com/api/cart",
      "https://gyva.appiolabs.com/api/cart/add",
      "https://gyva.appiolabs.com/api/cart/update",
      "https://gyva.appiolabs.com/api/cart/delete",
      "https://gyva.appiolabs.com/api/cart/addresses"
    ]
  }'

echo "Cache purge request sent!"
