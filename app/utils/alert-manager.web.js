const RCTAlertManager = {
  alertWithArgs: (args, callback) => {
    // For web, we'll use the browser's native alert
    if (args.title) {
      window.alert(args.message || args.title);
    }
    if (callback) {
      callback();
    }
  },
};

export default RCTAlertManager; 