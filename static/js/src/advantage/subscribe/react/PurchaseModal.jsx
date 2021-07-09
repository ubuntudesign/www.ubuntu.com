import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  ActionButton,
  Notification,
  Spinner,
} from "@canonical/react-components";
import useStripeCustomerInfo from "./APICalls/useStripeCustomerInfo";
import registerPaymentMethod from "./APICalls/registerPaymentMethod";
import PaymentMethodSummary from "./components/PaymentMethodSummary";
import PaymentMethodForm from "./components/PaymentMethodForm";
import Summary from "./components/Summary";
import { Formik } from "formik";
import useProduct from "./APICalls/useProduct";
import usePendingPurchase from "./APICalls/usePendingPurchase";
import { useQueryClient } from "react-query";
import { getErrorMessage } from "../../error-handler";
import usePreview from "./APICalls/usePreview";
import TotalSection from "./components/TotalSection";
import FreeTrialRadio from "./components/FreeTrialRadio";
import TermsCheckBox from "./components/TermsCheckBox";
import PositiveButton from "./components/PositiveButton";

const getUserInfoFromVariables = (data, variables) => {
  return {
    customerInfo: {
      email: variables.email,
      name: variables.name,
      address: {
        line1: variables.address,
        postal_code: variables.postalCode,
        country: variables.country,
        city: variables.city,
        state:
          variables.country === "US" ? variables.usState : variables.caProvince,
      },
      defaultPaymentMethod: {
        brand: data.paymentMethod.brand,
        last4: data.paymentMethod.last4,
        expMonth: data.paymentMethod.exp_month,
        expYear: data.paymentMethod.exp_year,
      },
      taxID: { value: variables.VATNumber.value },
    },
    accountInfo: {
      name: variables.organisationName,
    },
  };
};

const PurchaseModal = () => {
  const [error, setError] = useState(null);
  const [isCardValid, setCardValid] = useState(false);
  const {
    data: userInfo,
    isLoading: isUserInfoLoading,
  } = useStripeCustomerInfo();
  const { isLoading: isPreviewLoading } = usePreview();
  const { isLoading: isProductLoading } = useProduct();
  const [step, setStep] = useState(
    userInfo?.customerInfo?.defaultPaymentMethod ? 2 : 1
  );
  const queryClient = useQueryClient();

  const { data: pendingPurchase, error: purchaseError } = usePendingPurchase();

  const paymentMethodMutation = registerPaymentMethod();
  const { product } = useProduct();

  const initialValues = {
    freeTrial:
      product?.canBeTrialled && !(step === 2 && window.isGuest)
        ? "useFreeTrial"
        : "payNow",
    email: userInfo?.customerInfo?.email ?? "",
    name: userInfo?.customerInfo?.name ?? "",
    buyingFor:
      !window.accountId || userInfo?.accountInfo?.name
        ? "organisation"
        : "myself",
    organisationName: userInfo?.accountInfo?.name ?? "",
    address: userInfo?.customerInfo?.address?.line1 ?? "",
    postalCode: userInfo?.customerInfo?.address?.postal_code ?? "",
    country: userInfo?.customerInfo?.address?.country ?? "",
    city: userInfo?.customerInfo?.address?.city ?? "",
    usState: userInfo?.customerInfo?.address?.state ?? "",
    caProvince: userInfo?.customerInfo?.address?.state ?? "",
    VATNumber: userInfo?.customerInfo?.taxID?.value ?? "",
    terms: false,
  };

  useEffect(() => {
    if (userInfo?.customerInfo?.defaultPaymentMethod) {
      setStep(2);
    }
  }, [userInfo]);

  useEffect(() => {
    // the initial call was successful but it returned an error while polling the purchase status
    if (purchaseError) {
      if (
        purchaseError.message.includes(
          "We are unable to authenticate your payment method"
        )
      ) {
        setError(
          <>
            We were unable to verify your credit card. Check the details and try
            again. Contact{" "}
            <a href="https://ubuntu.com/contact-us">Canonical sales</a> if the
            problem persists.
          </>
        );
      } else {
        setError(
          <>
            We were unable to process the payment. Check the details and try
            again. Contact{" "}
            <a href="https://ubuntu.com/contact-us">Canonical sales</a> if the
            problem persists.
          </>
        );
      }
      setStep(1);
    }
  }, [purchaseError]);

  useEffect(() => {
    if (pendingPurchase?.status === "done") {
      // The state of the product selector is stored in the local storage
      // if a purchase is successful we empty it so the customer will see
      // the default values pre-selected instead of what they just bought.
      localStorage.removeItem("ua-subscribe-state");

      //redirect
      if (window.isGuest) {
        location.href = `/advantage/subscribe/thank-you?email=${encodeURIComponent(
          pendingPurchase?.invoice?.customerEmail
        )}`;
      } else {
        location.pathname = "/advantage";
      }
    }
  }, [pendingPurchase]);

  const onSubmit = (values, actions) => {
    setError(null);
    paymentMethodMutation.mutate(values, {
      onSuccess: (data, variables) => {
        window.accountId = data.accountId;
        actions.setValues({ terms: false });
        setStep(2);
        queryClient.setQueryData(
          "userInfo",
          getUserInfoFromVariables(data, variables)
        );
        queryClient.invalidateQueries("preview");

        actions.setSubmitting(false);
      },
      onError: (error) => {
        if (error.message === "email_already_exists") {
          setError(
            <>
              An Ubuntu One account with this email address exists. Please{" "}
              <a href="/login">sign in</a> to your account first.
            </>
          );
        } else {
          // Tries to match the error with a known error code and defaults to a generic error if it fails
          setError(
            getErrorMessage({ message: "", code: error.message }) ?? (
              <>
                Sorry, there was an unknown error with your credit card. Check
                the details and try again. Contact{" "}
                <a href="https://ubuntu.com/contact-us">Canonical sales</a> if
                the problem persists.
              </>
            )
          );
        }

        actions.setSubmitting(false);
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={onSubmit}
    >
      {() => (
        <>
          <header className="p-modal__header">
            <h2 className="p-modal__title u-no-margin--bottom" id="modal-title">
              Complete purchase {status}
            </h2>
          </header>
          <div id="modal-description" className="p-modal__body">
            {isUserInfoLoading || isProductLoading || isPreviewLoading ? (
              <Col
                size="12"
                className="u-align--center"
                style={{ padding: "10rem 0" }}
              >
                <Spinner />
              </Col>
            ) : (
              <>
                <Summary />
                {error && (
                  <Notification type="negative" status="Error:">
                    {error}
                  </Notification>
                )}

                {product?.canBeTrialled ? <FreeTrialRadio step={step} /> : null}

                {step === 1 ? (
                  <PaymentMethodForm setCardValid={setCardValid} />
                ) : (
                  <PaymentMethodSummary setStep={setStep} />
                )}
                <TotalSection />
                <TermsCheckBox step={step} />
              </>
            )}
          </div>
          <footer className="p-modal__footer">
            <Row className="u-no-padding">
              <ActionButton
                className="js-cancel-modal col-small-2 col-medium-2 col-start-medium-3 col-start-large-7 col-3 u-no-margin"
                appearance="neutral"
                aria-controls="purchase-modal"
                style={{ textAlign: "center" }}
                onClick={() => {
                  setError(null);
                }}
              >
                Cancel
              </ActionButton>

              <PositiveButton
                step={step}
                isCardValid={isCardValid}
                setError={setError}
                userInfo={userInfo}
              />
            </Row>
          </footer>
        </>
      )}
    </Formik>
  );
};

export default PurchaseModal;
