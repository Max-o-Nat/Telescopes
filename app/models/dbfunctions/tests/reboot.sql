DROP TYPE IF EXISTS TELESCOPETYPE CASCADE;

CREATE TYPE TELESCOPETYPE AS ENUM(
	'катадиоптрический',
	'рефлектор',
	'рефрактор'
);

DROP TABLE IF EXISTS Telescopes CASCADE;

CREATE TABLE Telescopes(
	TelescopeID SERIAL PRIMARY KEY,
	TelescopeName TEXT NOT NULL UNIQUE,
	TelescopeType TELESCOPETYPE NOT NULL,
	TelescopeInfo TEXT  NOT NULL DEFAULT '',
	City TEXT NOT NULL DEFAULT 'Москва',
	Country TEXT NOT NULL DEFAULT 'Россия'
);

DROP FUNCTION IF EXISTS Telescopes;

CREATE FUNCTION Telescopes() RETURNS TABLE(telescopeid int, telescopename text, telescopetype TELESCOPETYPE, telescopeinfo text, country text, city text) AS $$
BEGIN
	RETURN QUERY SELECT t.telescopeid, t.telescopename, t.telescopetype, t.telescopeinfo, t.country, t.city 
		FROM Telescopes as t
		ORDER BY telescopename ASC;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS TelescopeByID;

CREATE FUNCTION TelescopeByID(id int) RETURNS TABLE (telescopeid int, telescopename text, telescopetype TELESCOPETYPE, telescopeinfo text, country text, city text) AS $$
BEGIN
	RETURN QUERY SELECT id, t.telescopename, t.telescopetype, t.telescopeinfo, t.country, t.city
		FROM Telescopes as t
		WHERE t.telescopeid = id
		ORDER BY telescopename ASC;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS DeleteTelescopeByID;

CREATE FUNCTION DeleteTelescopeByID(id int) RETURNS VOID AS $$
BEGIN
	DELETE FROM Telescopes WHERE telescopeid = id;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS CreateTelescope;

CREATE FUNCTION CreateTelescope(telname text, teltype TELESCOPETYPE, telinfo text, telcity text, telcountry text) RETURNS VOID AS $$
BEGIN
	INSERT INTO Telescopes(telescopename, telescopetype, telescopeinfo, city, country) VALUES(telname, teltype, telinfo, telcity, telcountry);
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS ChangeTelescope;

CREATE FUNCTION ChangeTelescope(telid int, telname text, teltype TELESCOPETYPE, telinfo text, telcity text, telcountry text) RETURNS VOID AS $$
BEGIN
	UPDATE Telescopes SET telescopename = telname, telescopetype = teltype, telescopeinfo = telinfo, city = telcity, country = telcountry WHERE telescopeid = telid;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS SortTelescopes;

CREATE FUNCTION SortTelescopes(col text) RETURNS TABLE(telescopeid int, telescopename text, telescopetype TELESCOPETYPE, telescopeinfo text, country text, city text) AS $$
BEGIN
	IF col = 'Страна' THEN
		RETURN QUERY SELECT t.telescopeid, t.telescopename, t.telescopetype, t.telescopeinfo, t.country, t.city 
			FROM Telescopes as t
			ORDER BY t.country ASC, t.telescopename ASC;
	ELSIF col = 'Город' THEN
		RETURN QUERY SELECT t.telescopeid, t.telescopename, t.telescopetype, t.telescopeinfo, t.country, t.city 
			FROM Telescopes as t
			ORDER BY t.city ASC, t.telescopename ASC;
	ELSE 
		RETURN QUERY SELECT t.telescopeid, t.telescopename, t.telescopetype, t.telescopeinfo, t.country, t.city 
			FROM Telescopes as t
			ORDER BY t.telescopetype ASC;
	END IF;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS SearchTelescopes;

CREATE FUNCTION SearchTelescopes(searchtype text, searchtext text) RETURNS TABLE(telescopeid int, telescopename text, telescopetype TELESCOPETYPE, telescopeinfo text, country text, city text) AS $$
BEGIN
	IF searchtype = 'Страна' THEN
		RETURN QUERY SELECT t.telescopeid, t.telescopename, t.telescopetype, t.telescopeinfo, t.country, t.city 
			FROM Telescopes as t
			WHERE t.country = searchtext
			ORDER BY telescopename ASC;
	ELSE
		RETURN QUERY SELECT t.telescopeid, t.telescopename, t.telescopetype, t.telescopeinfo, t.country, t.city 
			FROM Telescopes as t
			WHERE t.city = searchtext
			ORDER BY telescopename ASC;
	END IF;
END;
$$ LANGUAGE plpgsql;
