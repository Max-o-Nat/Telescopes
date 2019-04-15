DROP FUNCTION IF EXISTS Objects CASCADE;

CREATE FUNCTION Objects() RETURNS TABLE(id int, objname text, objh real, obja real, objinfo text) AS $$
BEGIN
	RETURN QUERY SELECT objectid, objectname, h, a, info
	FROM Objects
	ORDER BY objectid ASC;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS SortObjects CASCADE;

CREATE FUNCTION SortObjects() RETURNS TABLE(id int, objname text, objh real, obja real, objinfo text) AS $$
BEGIN
	RETURN QUERY SELECT objectid, objectname, h, a, info
	FROM Objects
	ORDER BY objectname ASC, objectid ASC;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS SearchObjects CASCADE;

CREATE FUNCTION SearchObjects(col text, searchtext text) RETURNS TABLE(id int, objname text, objh real, obja real, objinfo text) AS $$
BEGIN
	IF col = 'ID небесного тела' THEN
		RETURN QUERY SELECT objectid, objectname, h, a, info
		FROM Objects
		WHERE objectid = CAST (searchtext AS int);
	ELsIF col = 'Ќазвание небесного тела' THEN
		RETURN QUERY SELECT objectid, objectname, h, a, info
		FROM Objects
		WHERE objectname = searchtext;
	END IF;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS ObjectByID CASCADE;

CREATE FUNCTION ObjectByID(obid int) RETURNS TABLE(id int, objname text, objh real, obja real, objinfo text) AS $$
BEGIN
	RETURN QUERY SELECT objectid, objectname, H, A, info
	FROM Objects
	WHERE objectid = obid;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS DeleteObjectByID CASCADE;

CREATE FUNCTION DeleteObjectByID(id int) RETURNS VOID AS $$
BEGIN
	DELETE FROM Objects WHERE objectid = id;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS ChangeObject CASCADE;

CREATE FUNCTION ChangeObject(id int, name text, obh real, oba real, obinfo text) RETURNS VOID AS $$
BEGIN
	UPDATE Objects SET objectname = name, h = obh, a = oba, info = obinfo WHERE objectid = id;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS CreateObject CASCADE;

CREATE FUNCTION CreateObject(name text, obh real, oba real, obinfo text) RETURNS VOID AS $$
BEGIN
	INSERT INTO Objects(objectname, h, a, info) VALUES(name, obh, oba, obinfo);
END;
$$ LANGUAGE plpgsql;


