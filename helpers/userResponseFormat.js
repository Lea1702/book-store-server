const formatUser = function(user){
    formattedUser = {
        userId: (user.id),
        email: user.email,
        token: user.token,
        type: user.type
    };
    return formattedUser;
};

module.exports = formatUser;