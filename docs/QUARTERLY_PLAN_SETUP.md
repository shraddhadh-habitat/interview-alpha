# Quarterly Plan Setup — Supabase RPC Update

## Summary
The frontend now supports quarterly subscription option (₹1,999/quarter = ₹667/month). The Supabase `approve_payment` RPC function needs to be updated to handle the quarterly plan's 3-month expiration logic.

## Current Status
- ✅ Frontend: Pricing page shows Monthly (₹799), Quarterly (₹1,999), Yearly (₹6,999)
- ✅ Frontend: Discount codes work with all three tiers
- ⚠️ Backend: `approve_payment` RPC must handle plan-based expiration

## Required RPC Update

### Current Logic (assuming all are monthly)
```sql
-- OLD: This assumes all subscriptions are 1 month
UPDATE profiles
SET 
  subscription_status = 'active',
  subscription_plan = plan,
  subscription_expires_at = NOW() + INTERVAL '1 month',
  monthly_sessions_reset_at = NOW()
WHERE id = user_id;
```

### New Logic (plan-aware)
```sql
-- NEW: Calculate expiration based on plan value
UPDATE profiles
SET 
  subscription_status = 'active',
  subscription_plan = plan,
  subscription_expires_at = CASE 
    WHEN plan = 'monthly' THEN NOW() + INTERVAL '1 month'
    WHEN plan = 'quarterly' THEN NOW() + INTERVAL '3 months'
    WHEN plan = 'yearly' THEN NOW() + INTERVAL '1 year'
    ELSE NOW() + INTERVAL '1 month'  -- fallback
  END,
  monthly_sessions_reset_at = NOW()
WHERE id = user_id;
```

## Steps to Update

### 1. Navigate to Supabase Dashboard
- Go to https://app.supabase.com
- Select your project
- Go to **SQL Editor**

### 2. Find and Update `approve_payment` Function
- In the left sidebar, expand **Functions**
- Find `approve_payment`
- Click to view the function definition
- Update the `UPDATE profiles` statement to use the CASE logic above

### 3. Test the Change
1. Go to Admin Panel (interviewalpha.ai/admin)
2. Find a pending payment with `plan: 'quarterly'`
3. Click "Approve"
4. Verify the subscription_expires_at is set to 3 months from now

## Payment Request Table Structure
(Reference only — no changes needed)

```sql
CREATE TABLE payment_requests (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  user_email TEXT NOT NULL,
  plan TEXT NOT NULL,  -- 'monthly', 'quarterly', 'yearly'
  amount_inr INT NOT NULL,
  upi_ref TEXT NOT NULL UNIQUE,
  discount_code TEXT,
  discount_percent INT,
  final_amount INT,
  status TEXT DEFAULT 'pending',  -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES auth.users(id),
  rejection_note TEXT
);
```

## Discount Code Prices

| Code | Type | Monthly | Quarterly | Yearly |
|------|------|---------|-----------|---------|
| ALPHA2026 | 10% | ₹719 | ₹1,799 | ₹6,299 |
| PMREADY10 | 10% | ₹719 | ₹1,799 | ₹6,299 |
| FOUNDER20 | 20% | ₹639 | ₹1,599 | ₹5,599 |

## Timeline & Sessions Reset

All plans:
- Monthly: Sessions reset after 1 month
- Quarterly: Sessions reset after 3 months  
- Yearly: Sessions reset after 1 year

The `monthly_sessions_reset_at` field is set to NOW() on approval. Session usage is tracked against the `subscription_expires_at` date.

## Quick Checklist
- [ ] Update `approve_payment` RPC with CASE logic
- [ ] Test quarterly payment approval in admin panel
- [ ] Verify 3-month expiration is set correctly
- [ ] Test other plans still work (monthly, yearly)
- [ ] Confirm discount codes apply correctly
