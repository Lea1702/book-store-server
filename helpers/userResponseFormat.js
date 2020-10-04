const formatUser = function(user){
    formattedUser = {
        userId: (user.id),
        email: user.email,
        token: user.token,
    };
    return formattedUser;
};

module.exports = formatUser;
