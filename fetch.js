/**
 * @param {number} totalSize - The total size of the request payload
 * @param {function} onProgress - Callback function for tracking progress
 * @returns {TransformStream} - A transform stream
 * @example
 * const progressStream = createProgressStream(13, onProgress)
 */
function createProgressStream(totalSize, onProgress) {
  let totalBytesSent = 0
  return new TransformStream({
    transform(chunk, controller) {
      totalBytesSent += chunk.length
      const percentage = ((totalBytesSent / totalSize) * 100).toFixed(2)
      onProgress(percentage)
      controller.enqueue(chunk)
    },
  })
}

/**
 * @typedef {Object} ExtendedRequestInit
 * @extends RequestInit
 * @property {number} [size] - The size of the request payload
 * @property {function} [onProgress] - Callback function for tracking progress
 */

/**
 * @param {string} url - The URL to fetch
 * @param {ExtendedRequestInit} [options] - The fetch options
 * @returns {Promise<Response> & {abort?: function}}
 * @example
 * const response = await enhancedFetch("https://httpbin.org/post", {
 *  method: "POST",
 * body: stream,
 * duplex: "half", // Use half-duplex mode to receive the response
 * size: 13, // Size of 'Hello, world!' in bytes
 * onProgress, // Pass the onProgress callback
 * })
 *
 * function onProgress(percentage) {
 * console.log(`Upload progress: ${percentage}%`)
 * }
 */
export function enhancedFetch(url, options = {}) {
  const abortController = new AbortController()
  const signal = abortController.signal
  options.signal = signal

  if (options.body && typeof options.body.pipeThrough === "function") {
    const totalSize = options.size || 0 // Replace with actual size if available
    const progressStream = createProgressStream(
      totalSize,
      options.onProgress || (() => {})
    )
    options.body = options.body.pipeThrough(progressStream)
  }

  /**
   * @type {Promise<Response> & {abort?: function}} fetchPromise
   */
  let fetchPromise = fetch(url, options)

  fetchPromise.abort = function () {
    abortController.abort()
  }

  return fetchPromise
}
