import React from "react";
import PropTypes from "prop-types";
import { useFormikContext } from "formik";
import { ActionButton } from "@canonical/react-components";
import usePurchase from "../../APICalls/usePurchase";
import usePendingPurchase from "../../APICalls/usePendingPurchase";

const PayNowButton = ({ setError }) => {
  const { values } = useFormikContext();
  const purchaseMutation = usePurchase();

  const {
    setPendingPurchaseID,
    isLoading: isPendingPurchaseLoading,
  } = usePendingPurchase();

  const onPayClick = () => {
    purchaseMutation.mutate("", {
      onSuccess: (data) => {
        //start polling
        setPendingPurchaseID(data);
      },
      onError: (error) => {
        if (error.message.includes("can only make one purchase at a time")) {
          setError(
            <>
              You already have a pending purchase. Please go to{" "}
              <a href="/advantage/payment-methods">payment methods</a> to retry.
            </>
          );
        } else {
          setError(
            <>
              Sorry, there was an unknown error with with the payment. Check the
              details and try again. Contact{" "}
              <a href="https://ubuntu.com/contact-us">Canonical sales</a> if the
              problem persists.
            </>
          );
        }
      },
    });
  };
  return (
    <ActionButton
      className="col-small-2 col-medium-2 col-3 u-no-margin"
      appearance="positive"
      style={{ textAlign: "center" }}
      disabled={!values.terms}
      onClick={onPayClick}
      loading={purchaseMutation.isLoading || isPendingPurchaseLoading}
    >
      Pay
    </ActionButton>
  );
};

PayNowButton.propTypes = {
  setError: PropTypes.func.isRequired,
};

export default PayNowButton;
