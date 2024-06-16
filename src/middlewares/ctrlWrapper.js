export const ctrlWrapper = (ctrl) => {
  return (req, res, next) => {
    ctrl(req, res).catch(next);
  };
};
