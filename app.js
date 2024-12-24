function dashboard(req,res,next){
  res.send('dashboard endpoint');
}

function profile(req,res,next){
  res.send('profile endpoint');
}
module.exports = {dashboard, profile}