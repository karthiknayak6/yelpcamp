module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(e => {
      console.log("this is error" + e);
      next(e);
    })
  }
}