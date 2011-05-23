API DOCS
========
How it works
------------
Basically you send the request in the format "[function] [parameter] [parameter] ..." directly to the server(ALWAYS ON 1 LINE).
This will return like this:

	[returnvalue]
	[returnvalue]
	...

the socket closes when everything is sent

Technical
---------
### login

description: Gives you an access token for the functions that require one

parameters: username:String, password:String

returns: access_token:String

example usage: login testuser testpassword


### addPair

description: Adds a pair of students

parameters: [student1, student2]:JSON

returns: pair_id:Integer

example usage: addPair [{"username":"teuneboon","firstname":"Teun","surname":"Beijers","email":"teun@beijers.eu","number_of_guests":12,"studentnumber":13371},{"username":"ganonmaster","firstname":"Hidde","surname":"Jansen","email":"ganon@mastah.nl","number_of_guests":2,"studentnumber":13372}]
