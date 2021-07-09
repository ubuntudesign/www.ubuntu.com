import { createSlice } from "@reduxjs/toolkit";
import { loadState } from "../../../utils/persitState";

const params = new URLSearchParams(window.location.search);

const initialUIState = {
  otherVersionsModal: {
    show: false,
  },
  purchaseModal: {
    show: false,
  },
};

const UISlice = createSlice({
  name: "ui",
  initialState: params.has("free_trial")
    ? { ...initialUIState, purchaseModal: { show: true } }
    : loadState("ua-subscribe-state", "ui", initialUIState),
  reducers: {
    toggleOtherVersionsModal(state) {
      state.otherVersionsModal.show = !state.otherVersionsModal.show;
    },
    togglePurchaseModal(state) {
      state.purchaseModal.show = !state.purchaseModal.show;
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = UISlice;

export const { toggleOtherVersionsModal, togglePurchaseModal } = actions;

export default reducer;
