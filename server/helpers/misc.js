function getMainSkuId(html) {
  const result = html.match(/mainSkuId=(\d+)/);
  return result ? result[1] : "";
}

const flushPromiseSchedule = async (schedule, result = []) => {
  if (!schedule.length) return;
  const curPromise = schedule.shift();

  const curResult = await curPromise;
  result.push(curResult);
  await flushPromiseSchedule(schedule, result);
  return result;
};

function getUserAgent() {
  return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36";
}

module.exports = {
  getMainSkuId,
  flushPromiseSchedule,
  getUserAgent,
};
