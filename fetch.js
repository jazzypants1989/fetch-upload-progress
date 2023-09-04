// function createProgressStream(totalSize, onProgress) {
//   let totalBytesSent = 0;
//   return new TransformStream({
//     transform(chunk, controller) {
//       totalBytesSent += chunk.length;
//       const percentage = ((totalBytesSent / totalSize) * 100).toFixed(2);
//       onProgress(percentage);
//       controller.enqueue(chunk);
//     }
//   });
// }

// export function enhancedFetch(url, options = {}) {
//   const abortController = new AbortController();
//   const signal = abortController.signal;
//   options.signal = signal;

//   if (options.body && typeof options.body.pipeThrough === 'function') {
//     const totalSize = options.size || 0; // Replace with actual size if available
//     const progressStream = createProgressStream(totalSize, options.onProgress || (() => {}));
//     options.body = options.body.pipeThrough(progressStream);
//   }

//   let fetchPromise = fetch(url, options);

//   fetchPromise.abort = function() {
//     abortController.abort();
//   };

//   return fetchPromise;
// }

// export function enhancedFetch(url, options = {}) {
//   const abortController = new AbortController();
//   const signal = abortController.signal;
//   options.signal = signal;

//   let fetchPromise = fetch(url, options);

//   fetchPromise.abort = function() {
//     abortController.abort();
//   };

//   return fetchPromise;
// }

// Readable Stream
// export function enhancedFetch(url, options = {}) {
//   const abortController = new AbortController();
//   const signal = abortController.signal;
//   options.signal = signal;

//   let fetchPromise = fetch(url, options);

//   fetchPromise = fetchPromise.then((response) => {
//     return new Response(response.body, response);
//   });

//   fetchPromise.abort = function () {
//     abortController.abort();
//   };

//   return fetchPromise;
// }

// Transform stream
// export function enhancedFetch(url, options = {}) {
//   const abortController = new AbortController();
//   const signal = abortController.signal;
//   options.signal = signal;

//   let fetchPromise = fetch(url, options);

//   fetchPromise = fetchPromise.then((response) => {
//     if (response.body && typeof response.body.pipeTo === 'function') {
//       const { readable, writable } = new TransformStream();
//       response.body.pipeTo(writable);
//       return new Response(readable, response);
//     }
//     console.error("No native pipeTo method. You're probably on an old version of Node. Sorry, no abort method for you!")
//     return response;
//   }).catch((error) => {
//     console.log('Fetch operation failed:', error);
//     throw error;
//   });

//   fetchPromise.abort = function () {
//     console.log('Abort called');
//     abortController.abort();
//   };

//   return fetchPromise;
// }
