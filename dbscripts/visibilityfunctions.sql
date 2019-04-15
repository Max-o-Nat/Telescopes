DROP FUNCTION IF EXISTS Visibility CASCADE;

CREATE FUNCTION Visibility() RETURNS TABLE(id int, telid int, objid int) AS $$
BEGIN
	RETURN QUERY SELECT visibilityid, telescopeid, objectid
	FROM Visibility
	ORDER BY telescopeid ASC;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS TelescopeVisibility;

CREATE FUNCTION TelescopeVisibility(tid int) RETURNS TABLE(id int, telid int, objid int, objname text) AS $$
BEGIN
	RETURN QUERY SELECT v.visibilityid, v.telescopeid, v.objectid, obj.ObjectName
	FROM Visibility as v, Objects as obj
	WHERE v.telescopeid = tid AND v.objectid = obj.objectid 
	ORDER BY objectid ASC;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS ObjectVisibility;

CREATE FUNCTION ObjectVisibility(obid int) RETURNS TABLE(id int, telid int, objid int) AS $$
BEGIN
	RETURN QUERY SELECT visibilityid, telescopeid, objectid
	FROM Visibility
	WHERE objectid = obid
	ORDER BY telescopeid ASC;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS SortVisibility;

CREATE FUNCTION SortVisibility() RETURNS TABLE(id int, telid int, objid int) AS $$
BEGIN
	RETURN QUERY SELECT visibilityid, telescopeid, objectid
	FROM Visibility
	ORDER BY objectid ASC;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS CreateVisibility CASCADE;

CREATE FUNCTION CreateVisibility(telid int, objid int) RETURNS VOID AS $$
BEGIN
	INSERT INTO Visibility(telescopeid, objectid) VALUES (telid, objid);
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS DeleteVisibilityByID CASCADE;

CREATE FUNCTION DeleteVisibilityByID(id int) RETURNS VOID AS $$
BEGIN
	DELETE FROM Visibility WHERE visibilityid = id;
END;
$$ LANGUAGE plpgsql;