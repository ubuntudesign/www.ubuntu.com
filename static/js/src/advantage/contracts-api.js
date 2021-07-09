export async function getPurchase(purchaseID) {
  const queryString = window.location.search; // Pass arguments to the flask backend eg. "test_backend=true"

  let response = await fetch(
    `/advantage/purchases/${purchaseID}${queryString}`,
    {
      cache: "no-store",
    }
  );

  let data = await response.json();
  return data;
}

export async function ensurePurchaseAccount({
  email,
  accountName,
  paymentMethodID,
  country,
}) {
  const queryString = window.location.search; // Pass arguments to the flask backend eg. "test_backend=true"

  let response = await fetch(`/advantage/purchase-account${queryString}`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      account_name: accountName,
      payment_method_id: paymentMethodID,
      country: country,
    }),
  });

  const data = await response.json();
  return data;
}

export async function getRenewal(renewalID) {
  const queryString = window.location.search; // Pass arguments to the flask backend eg. "test_backend=true"

  let response = await fetch(`/advantage/renewals/${renewalID}${queryString}`, {
    cache: "no-store",
  });

  let data = await response.json();
  return data;
}

export async function getCustomerInfo(accountId) {
  const queryString = window.location.search; // Pass arguments to the flask backend eg. "test_backend=true"

  let response = await fetch(
    `/advantage/customer-info/${accountId}${queryString}`,
    {
      cache: "no-store",
    }
  );

  let data = await response.json();
  return data;
}

export async function postInvoiceID(transactionType, transactionID, invoiceID) {
  const queryString = window.location.search; // Pass arguments to the flask backend eg. "test_backend=true"

  let response = await fetch(
    `/advantage/${transactionType}/${transactionID}/invoices/${invoiceID}${queryString}`,
    {
      cache: "no-store",
      credentials: "include",
      method: "POST",
    }
  );

  let data = await response.json();
  return data;
}

export async function postRenewalIDToProcessPayment(renewalID) {
  const queryString = window.location.search; // Pass arguments to the flask backend eg. "test_backend=true"

  let response = await fetch(
    `/advantage/renewals/${renewalID}/process-payment${queryString}`,
    {
      cache: "no-store",
      credentials: "include",
      method: "POST",
    }
  );

  let data = await response.json();
  return data;
}

export async function postPurchaseData(
  accountID,
  products,
  previousPurchaseId
) {
  const queryString = window.location.search; // Pass arguments to the flask backend eg. "test_backend=true"

  let response = await fetch(`/advantage/subscribe${queryString}`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account_id: accountID,
      products: products,
      previous_purchase_id: previousPurchaseId,
      period: products[0].period,
    }),
  });

  let data = await response.json();
  return data;
}

export async function cancelContract(accountId, previousPurchaseId, productId) {
  const queryString = window.location.search; // Pass arguments to the flask backend eg. "test_backend=true"

  let response = await fetch(`/advantage/subscribe${queryString}`, {
    method: "DELETE",
    cache: "no-store",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account_id: accountId,
      previous_purchase_id: previousPurchaseId,
      product_listing_id: productId,
    }),
  });

  let data = await response.json();
  return data;
}

export async function resizeContract(
  accountId,
  previousPurchaseId,
  productId,
  quantity,
  period
) {
  const queryString = window.location.search; // Pass arguments to the flask backend eg. "test_backend=true"

  let response = await fetch(`/advantage/subscribe${queryString}`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account_id: accountId,
      previous_purchase_id: previousPurchaseId,
      period: period,
      products: [
        {
          product_listing_id: productId,
          quantity: quantity,
        },
      ],
      resizing: true,
    }),
  });

  let data = await response.json();
  return data;
}

export async function postPurchasePreviewData(
  accountID,
  products,
  previousPurchaseId
) {
  const queryString = window.location.search; // Pass arguments to the flask backend eg. "test_backend=true"

  let response = await fetch(`/advantage/subscribe/preview${queryString}`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account_id: accountID,
      products: products,
      previous_purchase_id: previousPurchaseId,
      period: products[0].period,
    }),
  });

  let data = await response.json();
  return data;
}

export async function postCustomerInfoToStripeAccount({
  paymentMethodID,
  accountID,
  address,
  name,
  taxID,
}) {
  const queryString = window.location.search; // Pass arguments to the flask backend eg. "test_backend=true"

  let response = await fetch(`/advantage/customer-info${queryString}`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payment_method_id: paymentMethodID,
      account_id: accountID,
      address: address,
      name: name,
      tax_id: taxID,
    }),
  });

  let data = await response.json();
  return data;
}

export async function postCustomerInfoForPurchasePreview(
  accountID,
  name,
  address,
  taxID
) {
  const queryString = window.location.search; // Pass arguments to the flask backend eg. "test_backend=true"

  let response = await fetch(`/advantage/customer-info-anon${queryString}`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account_id: accountID,
      name: name,
      address: address,
      tax_id: taxID,
    }),
  });

  let data = await response.json();
  return data;
}

export async function setPaymentMethod(accountID, paymentMethodId) {
  const queryString = window.location.search; // Pass arguments to the flask backend eg. "test_backend=true"

  let response = await fetch(`/advantage/payment-method${queryString}`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account_id: accountID,
      payment_method_id: paymentMethodId,
    }),
  });

  let data = await response.json();
  return data;
}

export async function setAutoRenewal(value) {
  const queryString = window.location.search; // Pass arguments to the flask backend eg. "test_backend=true"

  let response = await fetch(`/advantage/set-auto-renewal${queryString}`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      should_auto_renew: value,
    }),
  });

  let data = await response.json();
  return data;
}

export async function postGuestFreeTrial({
  email,
  account_name,
  name,
  address,
  productListingId,
  quantity,
}) {
  const queryString = window.location.search; // Pass arguments to the flask backend eg. "test_backend=true"

  let response = await fetch(`/advantage/post-guest-trial${queryString}`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      account_name: account_name,
      name: name,
      address: address,
      products: [
        {
          product_listing_id: productListingId,
          quantity: quantity,
        },
      ],
    }),
  });

  let data = await response.json();
  return data;
}

export async function postLoggedInFreeTrial({
  accountID,
  name,
  address,
  productListingId,
  quantity,
}) {
  const queryString = window.location.search; // Pass arguments to the flask backend eg. "test_backend=true"

  let response = await fetch(`/advantage/post-trial${queryString}`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account_id: accountID,
      name: name,
      address: address,
      products: [
        {
          product_listing_id: productListingId,
          quantity: quantity,
        },
      ],
    }),
  });

  let data = await response.json();
  return data;
}
