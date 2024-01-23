export const sendNotification = (message: string, type: string) => {
  logseq.UI.showMsg(message, type);
};
