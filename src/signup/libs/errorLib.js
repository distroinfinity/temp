import * as Sentry from "@sentry/browser";

const isLocal = process.env.NODE_ENV === "development";

export function initSentry() {
  if (isLocal) {
    return;
  }

  Sentry.init({ dsn: "https://f6846e00f3d446659c249cf4e41b7631@o393839.ingest.sentry.io/5243349" });
}

export function logError(error, errorInfo = null) {
  if (isLocal) {
    return;
  }

  Sentry.withScope((scope) => {
    errorInfo && scope.setExtras(errorInfo);
    Sentry.captureException(error);
  });
}

export function onError(error) {
  let errorInfo = {};
  let message = error.toString();
  console.log("error is",error);
  console.log("message is", message);
  // Auth errors
  if (!(error instanceof Error) && error.message) {
    //console.log("instance of error and has message");
    errorInfo = error;
    message = error.message;
    error = new Error(message);
    // API errors
  } else if (error.config && error.config.url) {
    errorInfo.url = error.config.url;
  }
  if (error.errorType === "ApiError") {
    message = error.error;
    errorInfo = error;
  }

  logError(error, errorInfo);

  alert(message);
}