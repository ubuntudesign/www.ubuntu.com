import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";

const useProduct = () => {
  const [observerSet, setObserverSet] = useState(false);

  const buyButton = document.querySelector("#buy-now-button");
  const queryClient = useQueryClient();

  function handleProductChange() {
    queryClient.invalidateQueries("product");
  }

  //observerSet prevents us from creating a new observer on each render
  if (!observerSet) {
    const observer = new MutationObserver(handleProductChange);
    observer.observe(buyButton, {
      attributes: true,
    });
    setObserverSet(true);
  }

  const { data } = useQuery("product", async () => {
    return {
      product: JSON.parse(buyButton.dataset.product),
      quantity: parseInt(buyButton.dataset.quantity),
    };
  });

  return {
    product: data?.product,
    quantity: data?.quantity,
    isMonthly: data?.product?.period === "monthly",
    isLoading: !data,
  };
};

export default useProduct;
