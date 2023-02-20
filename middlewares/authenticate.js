const jwtDecode = require("../helpers/utility").jwtDecode;
const apiResponse = require("../helpers/apiResponse");
const userSchema = require("../models/userModel/userSchema");
const statusMessage = require("../config/config").statusMessage;

let authUser = (req, res, next) => {
  let token = req.headers.token;
  // console.log(token);
  if (!token) {
    return apiResponse.unauthorizedResponse(res, statusMessage.TOKEN_NOT_FOUND);
  }
  jwtDecode(token, (err, _id) => {
    if (err) {
      return apiResponse.unauthorizedResponse(
        res,
        statusMessage.INVALID_ACESS_TOKEN
      );
    }
    userSchema.findOne({ _id }, (err, user) => {
      console.log("_id", _id);
      if (err) {
        return apiResponse.unauthorizedResponse(res, statusMessage.DB_ERROR);
      } else if (!user) {
        return apiResponse.unauthorizedResponse(
          res,
          statusMessage.INVALID_USER
        );
      } else if (user.token !== token) {
        return apiResponse.sessionExpired(res, statusMessage.TOKEN_EXPIRE);
      }else if (user.status === "DELETED") {
        return apiResponse.unauthorizedResponse(
          res,
          statusMessage.INVALID_USER
        );
      } else if (user.status !== "ACTIVE") {
        return apiResponse.unauthorizedResponse(
          res,
          statusMessage.INACTIVE_USER
        );
      }
      req.headers.decoded_id = _id;
      req.user = user;
      next();
    });
  });
};

let consessiveAuth = (req, res, next) => {
  let token = req.headers.token;
  if (!token) {
    next();
    return;
  }
  jwtDecode(token, (err, _id) => {
    if (err) {
      return apiResponse.unauthorizedResponse(
        res,
        statusMessage.INVALID_ACESS_TOKEN
      );
    }
    userSchema.findOne({ _id }, (err, user) => {
      if (err) {
        return apiResponse.unauthorizedResponse(res, statusMessage.DB_ERROR);
      } else if (!user) {
        return apiResponse.unauthorizedResponse(
          res,
          statusMessage.INVALID_USER
        );
      } else if (user.status !== "ACTIVE") {
        return apiResponse.unauthorizedResponse(
          res,
          statusMessage.INACTIVE_USER
        );
      }
      req.headers.decoded_id = _id;
      req.user = user;
      next();
    });
  });
};

let authChampion = (req, res, next) => {
  let token = req.headers.token;
  if (!token) {
    return apiResponse.unauthorizedResponse(res, statusMessage.TOKEN_NOT_FOUND);
  }
  jwtDecode(token, (err, _id) => {
    if (err) {
      return apiResponse.unauthorizedResponse(
        res,
        statusMessage.INVALID_ACESS_TOKEN
      );
    }
    userSchema.findOne({ _id }, (err, user) => {
      if (err) {
        return apiResponse.unauthorizedResponse(res, statusMessage.DB_ERROR);
      } else if (!user) {
        return apiResponse.unauthorizedResponse(
          res,
          statusMessage.INVALID_USER
        );
      } else if (user.status !== "ACTIVE") {
        return apiResponse.unauthorizedResponse(
          res,
          statusMessage.INACTIVE_USER
        );
      } else if (user.token !== token) {
        return apiResponse.sessionExpired(res, statusMessage.SESSION_EXPIRED);
      }
      req.headers.decoded_id = _id;
      req.user = user;
      next();
    });
  });
};
let authAdmin = (req, res, next) => {
  let token = req.headers.token;
  if (!token) {
    return apiResponse.unauthorizedResponse(res, statusMessage.TOKEN_NOT_FOUND);
  }
  jwtDecode(token, (err, _id) => {
    if (err) {
      return apiResponse.unauthorizedResponse(
        res,
        statusMessage.INVALID_ACESS_TOKEN
      );
    }
    userSchema.find({ _id }, (err, user) => {
      // console.log("user", user);

      if (err) {
        return apiResponse.unauthorizedResponse(res, statusMessage.DB_ERROR);
      } else if (!user || !user[0] || user[0].userType !== "ADMIN") {
        return apiResponse.unauthorizedResponse(
          res,
          statusMessage.INVALID_USER
        );
      }
      req.headers.decoded_id = _id;
      next();
    });
  });
};

let authHub = (req, res, next) => {
  let token = req.headers.token;
  if (!token) {
    return apiResponse.unauthorizedResponse(res, statusMessage.TOKEN_NOT_FOUND);
  }
  jwtDecode(token, (err, _id) => {
    if (err) {
      return apiResponse.unauthorizedResponse(
        res,
        statusMessage.INVALID_ACESS_TOKEN
      );
    }

    userSchema.find({ _id }, (err, user) => {
      if (err) {
        return apiResponse.unauthorizedResponse(res, statusMessage.DB_ERROR);
      } else if (!user || !user[0] || user[0].userType !== "HUB") {
        return apiResponse.unauthorizedResponse(
          res,
          statusMessage.INVALID_USER
        );
      }
      req.headers.decoded_id = _id;
      req.headers.usersGfs = user[0].hubCred.gfs;
      req.users = user[0];

      next();
    });
  });
};

// authCashCollector
let authCashCollector = (req, res, next) => {
  let token = req.headers.token;
  if (!token) {
    return apiResponse.unauthorizedResponse(res, statusMessage.TOKEN_NOT_FOUND);
  }
  jwtDecode(token, (err, _id) => {
    if (err) {
      return apiResponse.unauthorizedResponse(
        res,
        statusMessage.INVALID_ACESS_TOKEN
      );
    }
    userSchema.findOne({ _id }, (err, user) => {
      if (err) {
        return apiResponse.unauthorizedResponse(res, statusMessage.DB_ERROR);
      } else if (!user) {
        return apiResponse.unauthorizedResponse(
          res,
          statusMessage.INVALID_USER
        );
      } else if (user.status !== "ACTIVE") {
        return apiResponse.unauthorizedResponse(
          res,
          statusMessage.INACTIVE_USER
        );
      } else if (user.token !== token) {
        return apiResponse.sessionExpired(res, statusMessage.SESSION_EXPIRED);
      }
      req.headers.decoded_id = _id;
      req.user = user;
      next();
    });
  });
};

let authDeliverySupervisor = (req, res, next) => {
  let token = req.headers.token;
  if (!token) {
    return apiResponse.unauthorizedResponse(res, statusMessage.TOKEN_NOT_FOUND);
  }
  jwtDecode(token, (err, _id) => {
    if (err) {
      return apiResponse.unauthorizedResponse(
        res,
        statusMessage.INVALID_ACESS_TOKEN
      );
    }
    userSchema.findOne({ _id }, (err, user) => {
      if (err) {
        return apiResponse.unauthorizedResponse(res, statusMessage.DB_ERROR);
      } else if (!user) {
        return apiResponse.unauthorizedResponse(
          res,
          statusMessage.INVALID_USER
        );
      } else if (user.status !== "ACTIVE") {
        return apiResponse.unauthorizedResponse(
          res,
          statusMessage.INACTIVE_USER
        );
      } else if (user.token !== token) {
        return apiResponse.sessionExpired(res, statusMessage.SESSION_EXPIRED);
      }
      req.headers.decoded_id = _id;
      req.user = user;
      next();
    });
  });
};

module.exports = {
  authUser: authUser,
  authChampion: authChampion,
  authCashCollector: authCashCollector,
  authDeliverySupervisor: authDeliverySupervisor,
  authAdmin: authAdmin,
  authHub: authHub,
  consessiveAuth: consessiveAuth,
};
