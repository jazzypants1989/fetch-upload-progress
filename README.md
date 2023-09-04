# fetch-upload-progress

Testing out how to get a progress event on uploads from the fetch API

**NOTE
This only works in Chromium browsers. That's why no one does this.**

[here's more information about streaming fetch requests](https://developer.chrome.com/articles/fetch-streaming-requests/)

[And, here's more information about WHATWG streams in general](https://web.dev/streams/)

# Set-up

1. clone repo `git clone https://github.com/jazzypants1989/fetch-upload-progress/`
2. install dependencies `npm install`
3. Set up SSL cert `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem` ( Honestly, ChatGPT gave me that line and I barely understand what it is doing. Use at your own risk.)
4. Run server and click link in console: `npm run start`

It'll probably warn you about the SSL certificate being bogus (self-signed), but there shouldn't be any real danger here.

Here it breaks down each piece:

> openssl: This is the command-line tool for using OpenSSL, a robust, full-featured open-source toolkit that implements the Secure Sockets Layer (SSL) and Transport Layer Security (TLS) protocols.
> req: This is a sub-command for OpenSSL and stands for "request." It's used for creating a new certificate signing request (CSR), but in this case, it's also used to create a new self-signed certificate.
> -newkey rsa:2048: This option tells OpenSSL to create a new private key using the RSA algorithm with a key length of 2048 bits.
> rsa: Specifies the algorithm to use for the key (RSA in this case).
>2048: Specifies the number of bits in the key. 2048 is currently recommended for good security.
>-new: This option specifies that a new CSR will be created. In this context, it's part of creating a new self-signed certificate.
>-nodes: This stands for "no DES," which means that the private key will not be encrypted with a passphrase. This is often necessary for automated processes, but it means that anyone with access to the key.pem file will have access to the unencrypted private key.
>-x509: This option tells OpenSSL to create a self-signed certificate instead of generating a certificate signing request (CSR).
>-days 3650: This specifies the number of days for which the certificate will be valid. Here, 3650 days means the certificate will be valid for 10 years.
>-keyout key.pem: This option tells OpenSSL where to save the private key. In this case, it will be saved in a file named key.pem.
>-out cert.pem: This option specifies the name of the output file for the new certificate. Here, the certificate will be saved in a file named cert.pem.
>So, in summary, this command will generate a new RSA private key with 2048 bits, create a new self-signed X.509 certificate that is valid for 10 years, save the private key in key.pem, and save the certificate in cert.pem. The private key will not be encrypted.

# Node?

`client.js` shows these principles working in Node, but Node won't let you use a self-signed certificate so you have to run the express server with `npm run express` or `node express.js` and then run `node client.js` in a separate terminal window.
