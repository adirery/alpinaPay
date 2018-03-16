let payment_request_event = undefined;
let payment_request_resolver = undefined;

self.addEventListener('canmakepayment', function(e) {
  e.respondWith(true);
});

self.addEventListener('paymentrequest', function(e) {
	payment_request_event = e;

	payment_request_resolver = new PromiseResolver();
	e.respondWith(payment_request_resolver.promise);

	var xhr = new XMLHttpRequest();
	
	//var url = "https://alpina-obp.sit.csintra.net/obp/v3.0.0/banks/psd201-bank-x--uk/accounts/123456/owner/transaction-request-types/SANDBOX_TAN/transaction-requests";
	var tokenUrl = "https://alpina-obp.sit.csintra.net/my/logins/direct"

	xhr.open("POST", tokenUrl, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.setRequestHeader("Authorization", "DirectLogin token=\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIiOiIifQ.3QgJ0xDS24ObUtpBriE9UfGVkbJPcCbwPoowdnyeShY\"");

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var json = JSON.parse(xhr.responseText);
			console.log("successful payment");
			payment_request_resolver.resolve("success");
		}
		else {
			console.log("unsuccessful payment");
			payment_request_resolver.reject("failure");
		}
	};
	var data = JSON.stringify({});
	xhr.send(data);
	
	
  	/*  
	var url = "http://localhost:8080/obp/v3.0.0/banks/psd201-bank-x--uk/accounts/123456/owner/transaction-request-types/SANDBOX_TAN/transaction-requests";
	e.openWindow(url)
    .then(window_client => {
      if(window_client == null)
        payment_request_resolver.reject('Failed to open window');
    })
    .catch(function(err) {
      payment_request_resolver.reject(err);
    })
	*/
});

/*
self.addEventListener('message', listener = function(e) {
  if (e.data == "payment_app_window_ready") {
    sendPaymentRequest();
    return;
  }

  if(e.data.methodName) {
    payment_request_resolver.resolve(e.data);
  } else {
    payment_request_resolver.reject(e.data);
  }
});

function sendPaymentRequest() {
  // Note that the returned window_client from openWindow is not used since
  // it might be changed by refreshing the opened page.
  // Refer to https://www.w3.org/TR/service-workers-1/#clients-getall
  let options = {
    includeUncontrolled: false,
    type: 'window'
  };
  clients.matchAll(options).then(function(clientList) {
    for(var i = 0; i < clientList.length; i++) {
      // Might do more communications or checks to make sure the message is
      // posted to the correct window only.

      // Copy the relevant data from the paymentrequestevent to
      // send to the payment app confirmation page.
      // Note that the entire PaymentRequestEvent can not be passed through
      // postMessage directly since it can not be cloned.
      clientList[i].postMessage(payment_request_event.total);
    }
  });
}
*/

function PromiseResolver() {
  /** @private {function(T=): void} */
  this.resolve_;

  /** @private {function(*=): void} */
  this.reject_;

  /** @private {!Promise<T>} */
  this.promise_ = new Promise(function(resolve, reject) {
    this.resolve_ = resolve;
    this.reject_ = reject;
  }.bind(this));
}

PromiseResolver.prototype = {
  /** @return {!Promise<T>} */
  get promise() {
    return this.promise_;
  },

  /** @return {function(T=): void} */
  get resolve() {
    return this.resolve_;
  },

  /** @return {function(*=): void} */
  get reject() {
    return this.reject_;
  },
};
