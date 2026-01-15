# Claude Code Context Notes

## Project Overview
Actindo Middleware - Bridge between NAV (ERP), Actindo (PIM), and frontend dashboard.

## Tech Stack
- Backend: ASP.NET 10 Web API (C#)
- Frontend: SvelteKit with Svelte 5 (runes: $state, $derived, $effect)
- Database: SQLite for job history and products
- Styling: TailwindCSS with Schalke 04 theme (royal blue/white)

## Key Directories
- `/backend` - ASP.NET API
- `/frontend` - SvelteKit app

## Current Feature: Sync Status Page

### Goal
Show which products/customers exist in Actindo but NAV doesn't know the Actindo ID for.
Allow manual sync to push Actindo IDs to NAV.

### Data Sources

1. **NAV (ERP)** - `https://notify.schalke04.de/nav/test/navapi` (POST, Bearer token)
   - Get customers with Actindo ID: `{"requestType": "actindo.customer.id.get"}`
   - Get products with Actindo ID: `{"requestType": "actindo.product.id.get"}`
   - Set customer Actindo ID: `{"requestType": "actindo.customer.id.set", "customer": {"nav_id": X, "actindo_id": Y}}`
   - Set product Actindo ID: `{"requestType": "actindo.product.id.set", "products": [{"actindo_id": X, "nav_id": Y}]}`
   - Set product with variants: `{"requestType": "actindo.productids.set", "products": [{"actindo_id": X, "erp_id": Y, "variants": [...]}]}`

2. **Actindo** - Uses existing OAuth token
   - Get products: GET `{baseUrl}/Actindo.Modules.Actindo.PIM.Products.getList`
   - Response fields: `id`, `sku`, `variantStatus` (single/master/child)
   - Variants linked to master via SKU prefix (e.g., "1234" master, "1234-XXL" variant)

3. **Middleware** - Local SQLite Products table

### Sync Logic
- NAV is source of truth - all items exist there
- NAV → Actindo sync already works
- Problem: NAV doesn't know Actindo IDs
- Solution: This page shows items where NAV is missing Actindo ID, allows manual sync

### Implementation Steps
1. Add NavApiUrl and NavApiToken to settings
2. Create NavClient service for NAV API calls
3. Create SyncController with comparison endpoints
4. Create frontend /sync page with tabs (Products/Customers)
5. Show unsynchronized items with checkboxes
6. Allow single/bulk sync operations

## Important Notes
- Products table stores: Id, JobId, ActindoProductId, Sku, Name, VariantStatus, ParentSku, VariantCode, CreatedAt
- Variant matching: child SKU starts with parent SKU + "-"
- All API routes prefixed with `/api`
