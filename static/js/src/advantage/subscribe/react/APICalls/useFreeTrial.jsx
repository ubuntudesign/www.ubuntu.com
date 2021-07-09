import { useMutation } from "react-query";
import {
  postGuestFreeTrial,
  postLoggedInFreeTrial,
} from "../../../contracts-api";
import useProduct from "./useProduct";

const FreeTrial = () => {
  const { product, quantity } = useProduct();

  const mutation = useMutation(async (formData) => {
    if (!product) {
      throw new Error("Product missing");
    }

    const {
      name,
      organisation,
      email,
      address,
      city,
      country,
      postalCode,
      usState,
      caProvince,
    } = formData;

    const addressObject = {
      city: city,
      country: country,
      line1: address,
      postal_code: postalCode,
      state: country === "US" ? usState : caProvince,
    };

    let res;

    if (window.isGuest) {
      res = await postGuestFreeTrial({
        email: email,
        name: organisation || name,
        address: addressObject,
        productListingId: product.id,
        quantity: quantity,
      });
    } else {
      res = await postLoggedInFreeTrial({
        accountID: window.accountId,
        name: organisation || name,
        address: addressObject,
        productListingId: product.id,
        quantity: quantity,
      });
    }

    if (res.errors) {
      throw new Error(res.errors);
    }
    return res;
  });

  return mutation;
};

export default FreeTrial;
