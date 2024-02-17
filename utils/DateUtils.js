function getPassingTime(time) {
  var text = "";
  var days = Math.floor((Date.now() - time) / (1000 * 60 * 60 * 24));
  var hours = Math.floor(
    ((Date.now() - time) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  var minutes = Math.floor(
    ((Date.now() - time) % (1000 * 60 * 60)) / (1000 * 60)
  );
  var seconds = Math.floor(((Date.now() - time) % (1000 * 60)) / 1000);
  if (days > 0) {
    text += days + " день ";
    return text;
  }
  if (hours > 0) {
    text += hours + " час ";
  }
  if (minutes > 0) {
    text += minutes + " минута ";
  }
  if (seconds > 0) {
    text += seconds + " секунда ";
  }
  return text;
}

module.exports = {
  getPassingTime,
};
