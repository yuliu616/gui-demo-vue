/**
 * send local message (to messageStore)
 */
async function sendMessage({ viewName, type, text }){
  await this.$store.dispatch('messageStore/add', {
    viewName: viewName,
    type: type,
    text: text,
  });
}

export {
  sendMessage,
}
