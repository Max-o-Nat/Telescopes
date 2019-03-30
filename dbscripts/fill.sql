COPY Telescopes (TelescopeName, TelescopeType)
	FROM 'C:/tmp/TeamWork/Telescopes/dbscripts/Telescopes.txt';

COPY Objects (ObjectName, H, A)
	FROM 'C:/tmp/TeamWork/Telescopes/dbscripts/Objects.txt';

COPY Visibility (TelescopeID, ObjectID)
	FROM 'C:/tmp/TeamWork/Telescopes/dbscripts/Visibility.txt';