=(basic) API DOCS=
==How it works==
Basically you send the request in the format "<function> <parameter> <parameter> ..." directly to the server.
This will return like this:

	<returnvalue>
	<returnvalue>
	...
	GO

the GO tells you that everything has been sent.

==Technical==
function: login
description: Gives you an access token for the functions that require one
parameters: username<string>, password<string>
returns: access_token<string>
example usage: login testuser testpassword

function: addPair
description: Adds a pair of students
parameters: [student1, student2]<JSON>
returns: pair_id<int>
example usage: addPair [{"username":"teuneboon","firstname":"Teun","surname":"Beijers","email":"teun@beijers.eu","number_of_guests":12,"studentnumber":13371},{"username":"ganonmaster","firstname":"Hidde","surname":"Jansen","email":"ganon@mastah.nl","number_of_guests":2,"studentnumber":13372}]
