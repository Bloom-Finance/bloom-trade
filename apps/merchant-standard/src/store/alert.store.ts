import { Store } from "pullstate";

interface IAlertStore {
  message: string;
  type: "success" | "error" | "info" | "warning" | null;
  callback?: any;
}

export const AlertStore = new Store<IAlertStore>({
  message: "",
  type: null,
  callback: null,
});
