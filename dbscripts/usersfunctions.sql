DROP FUNCTION IF EXISTS CheckUser;

CREATE FUNCTION CheckUser(log TEXT, pwd TEXT) RETURNS USERTYPE AS $$
BEGIN
	RETURN (SELECT userrole FROM Users WHERE log = login and password = pwd);
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS CheckUsername;

CREATE FUNCTION CheckUsername(log TEXT) RETURNS BOOLEAN AS $$
BEGIN
	RETURN EXISTS(SELECT * FROM Users WHERE log = login);
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS CheckEmail;

CREATE FUNCTION CheckEmail(em TEXT) RETURNS BOOLEAN AS $$
BEGIN
	RETURN EXISTS(SELECT * FROM Users WHERE em = email);
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS CreateUser;

CREATE FUNCTION CreateUser(em TEXT, log TEXT, psw TEXT) RETURNS VOID AS $$
BEGIN
	INSERT INTO Users(email, login, password) VALUES (em, log, psw);
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS GetRole;

CREATE FUNCTION GetRole(log TEXT) RETURNS USERTYPE AS $$
BEGIN
	RETURN (SELECT userrole FROM Users WHERE login = log);
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS Users;

CREATE FUNCTION Users() RETURNS TABLE(userid int, login text, email text, avatar text, userinfo text) AS $$
BEGIN
	RETURN QUERY SELECT u.userid, u.login, u.email, u.avatar, u.userinfo 
		FROM Users as u
		ORDER BY userid;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS UserByID;

CREATE FUNCTION UserByID(id int) RETURNS TABLE(userid int, login text, email text, password text, role USERTYPE, avatar text, userinfo text) AS $$
BEGIN
	RETURN QUERY SELECT u.userid, u.login, u.email, u.password, u.userrole, u.avatar, u.userinfo 
		FROM Users as u
		WHERE u.userid = id;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS UserByLogin;

CREATE FUNCTION UserByLogin(log text) RETURNS TABLE(userid int, login text, email text, password text, role USERTYPE, avatar text, userinfo text) AS $$
BEGIN
	RETURN QUERY SELECT u.userid, u.login, u.email, u.password, u.userrole, u.avatar, u.userinfo 
		FROM Users as u
		WHERE u.login = log;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS SortUsers;

CREATE FUNCTION SortUsers(col text) RETURNS TABLE(userid int, login text, email text, avatar text, userinfo text) AS $$
BEGIN
	IF col = 'Логин' THEN
		RETURN QUERY SELECT u.userid, u.login, u.email, u.avatar, u.userinfo 
			FROM Users as u
			ORDER BY u.login ASC;
	ELSIF col = 'Email' THEN
		RETURN QUERY SELECT u.userid, u.login, u.email, u.avatar, u.userinfo 
			FROM Users as u
			ORDER BY u.email ASC;
	ELSE
		RETURN QUERY SELECT u.userid, u.login, u.email, u.avatar, u.userinfo 
			FROM Users as u
			ORDER BY u.userid ASC;
	END IF;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS SearchUsers;

CREATE FUNCTION SearchUsers(searchtype text, searchtext text) RETURNS TABLE(userid int, login text, email text, avatar text, userinfo text) AS $$
BEGIN
	IF searchtype = 'Логин' THEN
		RETURN QUERY SELECT u.userid, u.login, u.email, u.avatar, u.userinfo 
			FROM Users as u
			WHERE u.login = searchtext;
	ELSIF searchtype = 'Email' THEN
		RETURN QUERY SELECT u.userid, u.login, u.email, u.avatar, u.userinfo 
			FROM Users as u
			WHERE u.email = searchtext;
	ELSE
		RETURN QUERY SELECT u.userid, u.login, u.email, u.avatar, u.userinfo 
			FROM Users as u
			WHERE u.userid = cast (searchtext as int);
	END IF;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS GetUserPhotos;

CREATE FUNCTION GetUserPhotos(id int) RETURNS TABLE(path text) AS $$
BEGIN
	RETURN QUERY SELECT a.AstrophotographyPath
		FROM Astrophotographies as a
		WHERE a.UserID = id
		ORDER BY a.createdate;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS ChangeAvatar;

CREATE FUNCTION ChangeAvatar(id int, path text) RETURNS VOID AS $$
BEGIN
	UPDATE Users SET avatar = path WHERE userid = id;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS ChangeUser;

CREATE FUNCTION ChangeUser(id int, uname text, em text, pwd text, i text) RETURNS VOID AS $$
BEGIN
	UPDATE Users SET login = uname, email = em, userinfo = i, password = pwd WHERE userid = id;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS ChangeRole;

CREATE FUNCTION ChangeRole(id int, role USERTYPE) RETURNS VOID AS $$
BEGIN
	UPDATE Users SET userrole = role WHERE userid = id;
END;
$$ LANGUAGE plpgsql;
