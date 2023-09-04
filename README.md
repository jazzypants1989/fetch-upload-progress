# fetch-upload-progress
Testing out how to get a progress event on uploads from the fetch API

# Set-up

1. clone repo `git clone https://github.com/jazzypants1989/fetch-upload-progress/` 
2. install dependencies `npm install`
3. Set up SSL cert `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem` ( Honestly, ChatGPT gave me that line and I barely understand what it is doing. Use at your own risk.)
4. Run server and click link in console: `npm run start`
