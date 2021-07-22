from requests.exceptions import HTTPError


class UAContractsAPI:
    def __init__(
        self,
        session,
        authentication_token,
        token_type="Macaroon",
        api_url="https://contracts.canonical.com",
        is_for_view=False,
    ):
        """
        Expects a Talisker session in most circumstances,
        from `talisker.requests.get_session()`
        """

        self.session = session
        self.authentication_token = authentication_token
        self.token_type = token_type
        self.api_url = api_url.rstrip("/")
        self.is_for_view = is_for_view

    def _request(self, method, path, json=None, params=None):
        headers = {
            "Authorization": (
                f"{self.token_type} " f"{self.authentication_token}"
            )
        }

        response = self.session.request(
            method=method,
            url=f"{self.api_url}/{path}",
            json=json,
            headers=headers,
            params=params,
        )
        response.raise_for_status()

        return response

    def get_accounts(self, email=""):
        params = {"email": email} if email else None
        try:
            response = self._request(
                method="get", path="v1/accounts", params=params
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                if self.is_for_view:
                    raise UAContractsAPIAuthErrorView(error)
                raise UAContractsAPIAuthError(error)

            if self.is_for_view:
                raise UAContractsAPIErrorView(error)
            raise UAContractsAPIError(error)

        return response.json().get("accounts", [])

    def get_account_contracts(self, account_id: str):
        try:
            response = self._request(
                method="get", path=f"v1/accounts/{account_id}/contracts"
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                if self.is_for_view:
                    raise UAContractsAPIAuthErrorView(error)
                raise UAContractsAPIAuthError(error)

            if self.is_for_view:
                raise UAContractsAPIErrorView(error)

            raise UAContractsAPIError(error)

        return response.json().get("contracts", [])

    def get_contract_token(self, contract_id: str):
        try:
            response = self._request(
                method="post",
                path=f"v1/contracts/{contract_id}/token",
                json={},
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                if self.is_for_view:
                    raise UAContractsAPIAuthErrorView(error)
                raise UAContractsAPIAuthError(error)

            if self.is_for_view:
                raise UAContractsAPIErrorView(error)

            raise UAContractsAPIError(error)

        return response.json().get("contractToken")

    def get_contract_machines(self, contract_id: str):
        try:
            response = self._request(
                method="get",
                path=f"v1/contracts/{contract_id}/context/machines",
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                raise UAContractsAPIAuthError(error)

            raise UAContractsAPIError(error)

        return response.json()

    def get_customer_info(self, account_id):
        try:
            response = self._request(
                method="get",
                path=f"v1/accounts/{account_id}/customer-info/stripe",
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                if self.is_for_view:
                    raise UAContractsAPIAuthErrorView(error)
                raise UAContractsAPIAuthError(error)

            if self.is_for_view:
                raise UAContractsAPIErrorView(error)

            raise UAContractsAPIError(error)

        return response.json()

    def put_customer_info(
        self, account_id, payment_method_id, address, name, tax_id
    ):
        try:
            response = self._request(
                method="put",
                path=f"v1/accounts/{account_id}/customer-info/stripe",
                json={
                    "defaultPaymentMethod": {"Id": payment_method_id},
                    "paymentMethodID": payment_method_id,
                    "address": address,
                    "name": name,
                    "taxID": tax_id,
                },
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                raise UAContractsAPIAuthError(error)

            raise UAContractsAPIError(error)

        return response.json()

    def put_anonymous_customer_info(self, account_id, name, address, tax_id):
        try:
            response = self._request(
                method="put",
                path=f"v1/accounts/{account_id}/customer-info/stripe",
                json={"address": address, "name": name, "taxID": tax_id},
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                raise UAContractsAPIAuthError(error)

            raise UAContractsAPIError(error)

        return response.json()

    def put_payment_method(self, account_id, payment_method_id):
        try:
            response = self._request(
                method="put",
                path=f"v1/accounts/{account_id}/customer-info/stripe",
                json={
                    "defaultPaymentMethod": {"Id": payment_method_id},
                },
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                raise UAContractsAPIAuthError(error)

            raise UAContractsAPIError(error)

        return response.json()

    def post_stripe_invoice_id(self, tx_type, tx_id, invoice_id):
        try:
            response = self._request(
                method="post",
                path=f"v1/{tx_type}/{tx_id}/payment/stripe/{invoice_id}",
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                raise UAContractsAPIAuthError(error)

            raise UAContractsAPIError(error)

        return response.json() if response.status_code != 200 else None

    def get_renewal(self, renewal_id):
        try:
            response = self._request(
                method="get", path=f"v1/renewals/{renewal_id}"
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                raise UAContractsAPIAuthError(error)

            raise UAContractsAPIError(error)

        return response.json()

    def accept_renewal(self, renewal_id):
        try:
            response = self._request(
                method="post", path=f"v1/renewals/{renewal_id}/acceptance"
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                raise UAContractsAPIAuthError(error)
            if error.response.status_code == 500:
                return response.json()
            else:
                raise error

        return {}

    def get_product_listings(self, marketplace: str) -> dict:
        try:
            response = self._request(
                method="get",
                path=f"v1/marketplace/{marketplace}/product-listings",
            )
        except HTTPError as error:
            if self.is_for_view:
                raise UAContractsAPIErrorView(error)
            else:
                raise UAContractsAPIError(error)

        return response.json()

    def get_account_subscriptions(
        self, account_id: str, marketplace: str, filters=None
    ) -> dict:
        if filters:
            filters = "&".join(
                "{}={}".format(key, value) for key, value in filters.items()
            )

        try:
            response = self._request(
                method="get",
                path=(
                    f"v1/accounts/{account_id}"
                    f"/marketplace/{marketplace}"
                    f"/subscriptions?{filters}"
                ),
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                if self.is_for_view:
                    raise UAContractsAPIAuthErrorView(error)
                else:
                    raise UAContractsAPIAuthError(error)

            if self.is_for_view:
                raise UAContractsAPIErrorView(error)

            raise UAContractsAPIError(error)

        return response.json().get("subscriptions", [])

    def get_account_purchases(self, account_id: str, filters=None) -> dict:
        if filters:
            filters = "&".join(
                "{}={}".format(key, value)
                for key, value in filters.items()
                if value is not None
            )

        try:
            response = self._request(
                method="get",
                path=f"v1/accounts/{account_id}/purchases?{filters}",
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                raise UAContractsAPIAuthError(error)

            raise UAContractsAPIError(error)

        return response.json().get("purchases", [])

    def get_purchase(self, purchase_id: str) -> dict:
        try:
            response = self._request(
                method="get", path=f"v1/purchase/{purchase_id}"
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                if self.is_for_view:
                    raise UAContractsAPIAuthErrorView(error)
                else:
                    raise UAContractsAPIAuthError(error)

            if self.is_for_view:
                raise UAContractsAPIErrorView(error)

            raise UAContractsAPIError(error)

        return response.json()

    def ensure_purchase_account(
        self,
        email: str = "",
        account_name: str = "",
        payment_method_id: str = "",
        country: str = "",
    ) -> dict:
        try:
            response = self._request(
                method="post",
                path="v1/purchase-account",
                json={
                    "email": email,
                    "name": account_name,
                    "defaultPaymentMethod": {"Id": payment_method_id},
                    "address": {"country": country},
                },
            )
        except HTTPError as err:
            # Raise an UnauthorizedError in case of unauthorized response.
            if email and payment_method_id and err.response.status_code == 401:
                resp = err.response.json()
                raise UnauthorizedError(resp["code"], resp["message"])
            # Re-raise the same error otherwise.
            raise
        return response.json()

    def get_purchase_account(self) -> dict:
        try:
            response = self._request(method="get", path="v1/purchase-account")
        except HTTPError as error:
            if error.response.status_code == 401:
                if self.is_for_view:
                    raise UAContractsAPIAuthErrorView(error)
                raise UAContractsAPIAuthError(error)

            if error.response.status_code == 404:
                raise UAContractsUserHasNoAccount(error)

            if self.is_for_view:
                raise UAContractsAPIErrorView(error)

            raise UAContractsAPIError(error)

        return response.json()

    def purchase_from_marketplace(
        self, marketplace: str, purchase_request: dict
    ) -> dict:
        try:
            response = self._request(
                method="post",
                path=f"v1/marketplace/{marketplace}/purchase",
                json=purchase_request,
            )
        except HTTPError as http_error:
            if http_error.response.status_code == 401:
                raise UAContractsAPIAuthError(http_error)

            if (
                "cannot remove all subscription items"
                in http_error.response.json()["message"]
            ):
                raise CannotCancelLastContractError(http_error)

            raise UAContractsAPIError(http_error)

        return response.json()

    def preview_purchase_from_marketplace(
        self, marketplace: str, purchase_request: dict
    ) -> dict:
        try:
            response = self._request(
                method="post",
                path=f"v1/marketplace/{marketplace}/purchase/preview",
                json=purchase_request,
            )
        except HTTPError as http_error:
            if http_error.response.status_code == 401:
                raise UAContractsAPIAuthError(http_error)

            if (
                "cannot remove all subscription items"
                in http_error.response.json()["message"]
            ):
                raise CannotCancelLastContractError(http_error)

            raise UAContractsAPIError(http_error)

        return response.json()

    def cancel_subscription(self, subscription_id: str) -> dict:
        try:
            response = self._request(
                method="delete",
                path=f"v1/subscriptions/{subscription_id}",
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                raise UAContractsAPIAuthError(error)

            raise UAContractsAPIError(error)

        return response.json() if response.status_code != 200 else None

    def get_subscription_auto_renewal(self, subscription_id: str) -> dict:
        try:
            response = self._request(
                method="get",
                path=f"v1/subscription/{subscription_id}/auto-renewal",
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                if self.is_for_view:
                    raise UAContractsAPIAuthErrorView(error)
                raise UAContractsAPIAuthError(error)

            if self.is_for_view:
                raise UAContractsAPIErrorView(error)
            raise UAContractsAPIError(error)

        return response.json()

    def post_subscription_auto_renewal(
        self, subscription_id: str, should_auto_renew: bool
    ) -> dict:
        try:
            response = self._request(
                method="post",
                path=f"v1/subscription/{subscription_id}/auto-renewal",
                json={"shouldAutoRenew": should_auto_renew},
            )
        except HTTPError as error:
            if error.response.status_code == 401:
                raise UAContractsAPIAuthError(error)

            raise UAContractsAPIError(error)

        return response.json() if response.status_code != 200 else None


class UnauthorizedError(Exception):
    """An error representing an unauthorized request."""

    def __init__(self, code, message):
        self.code = code
        self.message = message

    def __str__(self):
        return f"unauthorized error: {self.code}: {self.message}"

    def asdict(self):
        return self.__dict__


class CannotCancelLastContractError(HTTPError):
    def __init__(self, error: HTTPError):
        super().__init__(request=error.request, response=error.response)


class UAContractsAPIError(HTTPError):
    def __init__(self, error: HTTPError):
        super().__init__(request=error.request, response=error.response)


class UAContractsAPIAuthError(HTTPError):
    def __init__(self, error: HTTPError):
        super().__init__(request=error.request, response=error.response)


class UAContractsAPIErrorView(HTTPError):
    def __init__(self, error: HTTPError):
        super().__init__(request=error.request, response=error.response)


class UAContractsAPIAuthErrorView(HTTPError):
    def __init__(self, error: HTTPError):
        super().__init__(request=error.request, response=error.response)


class UAContractsUserHasNoAccount(HTTPError):
    def __init__(self, error: HTTPError):
        super().__init__(request=error.request, response=error.response)
