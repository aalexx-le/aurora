-- add trigger for asset price insert event (1m, 5m, 1h)
CREATE OR REPLACE FUNCTION notify_asset_price_inserted()
    RETURNS TRIGGER AS $$
BEGIN
    PERFORM notify_asset_price_1m_inserted(NEW);
    PERFORM notify_asset_price_5m_inserted(NEW);
    PERFORM notify_asset_price_1h_inserted(NEW);
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1 min notifier
CREATE OR REPLACE FUNCTION notify_asset_price_1m_inserted(NEW "AssetPrice")
    RETURNS VOID AS $$
BEGIN
    PERFORM pg_notify('asset-price-1m-inserted', row_to_json(NEW)::text);
END;
$$ LANGUAGE plpgsql;

-- 5 min notifier
CREATE OR REPLACE FUNCTION notify_asset_price_5m_inserted(NEW "AssetPrice")
    RETURNS VOID AS $$
DECLARE
    latest_asset_price "asset_price_5m";
BEGIN
    SELECT * INTO latest_asset_price FROM "asset_price_5m" WHERE "assetInfoId" = NEW."assetInfoId" ORDER BY open_time DESC LIMIT 1;

    IF NEW.open_time = latest_asset_price.open_time THEN
            PERFORM pg_notify('asset-price-5m-inserted', row_to_json(latest_asset_price)::text);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 1 hour notifier
CREATE OR REPLACE FUNCTION notify_asset_price_1h_inserted(NEW "AssetPrice")
    RETURNS VOID AS $$
DECLARE
    latest_asset_price "asset_price_1h";
BEGIN
    SELECT * INTO latest_asset_price FROM "asset_price_1h" WHERE "assetInfoId" = NEW."assetInfoId" ORDER BY open_time DESC LIMIT 1;

    IF NEW.open_time = latest_asset_price.open_time THEN
            PERFORM pg_notify('asset-price-1h-inserted', row_to_json(latest_asset_price)::text);
    END IF;
END;
$$ LANGUAGE plpgsql;