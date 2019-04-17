DROP FUNCTION IF EXISTS Requests CASCADE;

CREATE FUNCTION Requests() RETURNS TABLE(id int, uid int, tid int, objid int, d timestamp, status rEQUESTsTATUSTYPE) AS $$
BEGIN
	RETURN QUERY SELECT requestid, userid, telescopeid, objectid, createdate, requeststatus
	FROM Requests
	ORDER BY requeststatus, telescopeid ASC, createdate ASC;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS UserRequests;

CREATE FUNCTION UserRequests(log text) RETURNS TABLE(id int, tid int, tname text, objid int, objname text, d timestamp, status rEQUESTsTATUSTYPE) AS $$
BEGIN
	RETURN QUERY SELECT r.requestid, r.telescopeid, t.telescopename, r.objectid, obj.ObjectName, r.createdate, r.requeststatus
	FROM Requests as r, Telescopes as t, Objects as obj, Users as u
	WHERE u.login = log AND u.userid = r.userid AND obj.objectid = r.objectid AND t.telescopeid = r.telescopeid 
	ORDER BY requeststatus, createdate;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS RequestTelescopes;

CREATE FUNCTION RequestTelescopes() RETURNS TABLE(telescopeid int, telescopename text) AS $$
BEGIN
	RETURN QUERY SELECT Telescopes.telescopeid, Telescopes.telescopename
		FROM Telescopes 
		WHERE EXISTS(select TelescopeVisibility(Telescopes.telescopeid))
		ORDER BY TelescopeName ASC;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS CreateRequest CASCADE;

CREATE FUNCTION CreateRequest(login text, telid int, objid int) RETURNS VOID AS $$
DECLARE uid int;
BEGIN
	uid = (SELECT userid from userbylogin(login));
	INSERT INTO Requests(userid, telescopeid, objectid) VALUES (uid, telid, objid);
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS DeleteRequestByID CASCADE;

CREATE FUNCTION DeleteRequestByID(id int) RETURNS VOID AS $$
BEGIN
	DELETE FROM Requests WHERE requestid = id;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS CreateAstrophoto;

CREATE FUNCTION CreateAstrophoto(rid int, p text) RETURNS VOID AS $$
BEGIN
	INSERT INTO Astrophotographies(requestid, astrophotographypath, userid) VALUES(rid, p, (select userid FROM Requests WHERE requestid = rid));
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS RequestUpdate;

CREATE FUNCTION RequestUpdate() RETURNS TRIGGER AS $RequestUpdate$
BEGIN
	UPDATE Requests SET requeststatus = 'выполнен' WHERE requestid = NEW.requestid;
	RETURN NEW;
END;
$RequestUpdate$ LANGUAGE plpgsql;

CREATE TRIGGER RequestUpdate AFTER INSERT ON Astrophotographies
    FOR EACH ROW EXECUTE PROCEDURE RequestUpdate();