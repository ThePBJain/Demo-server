function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
}
//this below may not work...
function ensureOAuthenticated(req, res, next) {
    const requireAuth = passport.authenticate('user-mobile', { session: false });

    return requireAuth;
}

function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        return next();
    }
    req.flash('message', {
        status: 'danger',
        value: 'You are not an Admin.'
    });
    res.redirect('/auth/login');
}

function ensureAdminJSON(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        return next();
    }
    res.status(401)
        .json({
            status: 'error',
            message: 'You do not have permission to do that.'
        });
}

function loginRedirect(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        return next();
    }
}

function setUserInfo(request) {
    const getUserInfo = {
        _id: request._id,
        email: request.email
    };

    return getUserInfo;
};


module.exports = {
    setUserInfo: setUserInfo,
    ensureAuthenticated: ensureAuthenticated,
    ensureAdmin: ensureAdmin,
    ensureAdminJSON: ensureAdminJSON,
    loginRedirect: loginRedirect
};
