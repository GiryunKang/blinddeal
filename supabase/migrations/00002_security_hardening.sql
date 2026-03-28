-- Security hardening: prevent users from modifying protected fields
-- is_admin, verification_level, membership_tier should only be changed by service_role

-- Drop existing update policy if it exists, then create a restricted one
DO $$
BEGIN
  -- Create a function that prevents modification of protected fields
  CREATE OR REPLACE FUNCTION prevent_protected_field_changes()
  RETURNS TRIGGER AS $func$
  BEGIN
    -- Only service_role can modify these fields
    IF current_setting('request.jwt.claims', true)::json->>'role' != 'service_role' THEN
      NEW.is_admin := OLD.is_admin;
      NEW.verification_level := OLD.verification_level;
      NEW.membership_tier := OLD.membership_tier;
      NEW.membership_expires_at := OLD.membership_expires_at;
    END IF;
    RETURN NEW;
  END;
  $func$ LANGUAGE plpgsql SECURITY DEFINER;
END
$$;

-- Apply trigger to profiles table
DROP TRIGGER IF EXISTS protect_profile_fields ON profiles;
CREATE TRIGGER protect_profile_fields
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_protected_field_changes();

-- Ensure deal status can only be set to 'closed'/'cancelled' by participants or admin
-- (existing RLS should handle this, but add explicit constraint)
DO $$
BEGIN
  CREATE OR REPLACE FUNCTION prevent_unauthorized_deal_status()
  RETURNS TRIGGER AS $func$
  BEGIN
    -- Only allow status changes by owner or service_role
    IF current_setting('request.jwt.claims', true)::json->>'role' != 'service_role'
       AND NEW.owner_id != (current_setting('request.jwt.claims', true)::json->>'sub')::uuid THEN
      NEW.status := OLD.status;
    END IF;
    RETURN NEW;
  END;
  $func$ LANGUAGE plpgsql SECURITY DEFINER;
END
$$;

DROP TRIGGER IF EXISTS protect_deal_status ON deals;
CREATE TRIGGER protect_deal_status
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION prevent_unauthorized_deal_status();
