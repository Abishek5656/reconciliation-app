import api from "./axios";

export const uploadFile = async (formData) => {
  return await api.post("/upload", formData, {
    headers: {
      "Content-Type": undefined,
    },
  });
};

export const getTransactions = async (params) => {
  return await api.get("/transactions", { params });
};

export const triggerReconciliation = async () => {
  return await api.post("/transactions/reconcile");
};

export const getSummary = async () => {
  return await api.get("/transactions/summary");
};
