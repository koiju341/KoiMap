This is a personal project that trying to mimic the function provided by Google Map. Running a NodeJS server and integrated with MongoDB for query result stored in DB.





Installation 
1. Download and install nodejs (https://nodejs.org/en)
2. Install required libarary for backend servers:
    Express (https://expressjs.com/)    run 'npm install express' in terminal at directory
    Mongoose (https://mongoosejs.com/)  run 'npm install mongoose' in terminal at directory
    Https (https://www.npmjs.com/package/https?activeTab=readme) run 'npm install https' in terminal at directory
    Fs (https://www.npmjs.com/package/fs) run 'npm install fs' in terminal at directory
3. Setup MongoDB (https://www.mongodb.com/) for a database
4. Install OpenSSL (https://www.openssl.org/) and create self-signed certificate and key for https connection
5. Put the key and certificate to the directory and change the name to localhost.pem and localhost-key.pem
6. Change server.js:
   ```
	mongoose.connect('mongodb://<localhost/ipaddress>/mapdata') << this depends on your database setting (its connection ip and port)

	var server = https.createServer(option, app).listen(8443,'<localhost/ipaddress>', () =>{
   ```
   Change /db/index.js:
   ```
	const url = 'https://<localhost/ipaddress>:8443/'
   ```
8. Run 'node server.js' in terminal
9. Open https://<localhost/ipaddress>:8443/# to view the map.
