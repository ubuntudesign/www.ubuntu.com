import React from "react";
import PropTypes from "prop-types";
import { useFormikContext } from "formik";
import { ActionButton } from "@canonical/react-components";
import useFreeTrial from "../../APICalls/useFreeTrial";

const FreeTrialButton = ({ setError, userInfo }) => {
  const { values, isSubmitting, dirty, isValid } = useFormikContext();
  const mutation = useFreeTrial();

  const onStartTrialClick = () => {
    mutation.mutate(values, {
      onSuccess: () => {
        // The state of the product selector is stored in the local storage
        // if a purchase is successful we empty it so the customer will see
        // the default values pre-selected instead of what they just bought.
        localStorage.removeItem("ua-subscribe-state");

        //redirect
        if (window.isGuest) {
          location.href = `/advantage/subscribe/thank-you?email=${encodeURIComponent(
            values.email
          )}`;
        } else {
          location.pathname = "/advantage";
        }
      },
      onError: (error) => {
        if (
          error.message.includes("account already had or has access to product")
        ) {
          setError(<>You already have trialled this product</>);
        } else {
          setError(
            <>
              Sorry, there was an unknown error with the free trial. Check the
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
      disabled={(!userInfo && !dirty) || !isValid || !values.terms}
      appearance="positive"
      className="col-small-2 col-medium-2 col-3 u-no-margin"
      style={{ textAlign: "center" }}
      onClick={onStartTrialClick}
      loading={isSubmitting}
    >
      Start free trial
    </ActionButton>
  );
};

FreeTrialButton.propTypes = {
  setError: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default FreeTrialButton;
