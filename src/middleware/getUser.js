
const getUser = async (req, res, next) => {
    const {User} = req.app.get('models')
    const user = await User.findOne({where: {id: req.body.profile_id || 0}})
    if(!user) return res.status(401).end()
    req.user = user
    next()
}
module.exports = {getUser}