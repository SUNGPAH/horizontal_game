export  const isOverlapping = ([a, b], [c, d]) => {
  if (b >= c && b <= d) {
    return true;
  }

  if (a >= c && a <= d) {
    return true;
  }

  if (a <= c && d <= b) {
    return true;
  }

  return false;
};