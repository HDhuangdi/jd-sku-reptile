function getMainSkuId(html) {
  const result = html.match(/mainSkuId=(\d+)/);
  return result[1];
}

const flushPromiseSchedule = async (schedule, result = []) => {
  if (!schedule.length) return;
  const curPromise = schedule.shift();

  const curResult = await curPromise;
  result.push(curResult);
  await flushPromiseSchedule(schedule, result);
  return result;
};

module.exports = {
  getMainSkuId,
  flushPromiseSchedule,
};
